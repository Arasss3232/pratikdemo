import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { ACTION_REGISTRY, type ActionType } from "./ai-assistant-registry";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash";
const MAX_MSG_LEN = 4000;
const MAX_HISTORY = 16;
const RATE_PER_HOUR = 60;

type Row = Record<string, unknown>;
type ProposalRow = {
  id: string;
  action_type: string;
  target_table: string;
  target_id: string | null;
  summary: string;
  before_value: Record<string, unknown>;
  after_value: Record<string, unknown>;
  proposed_changes: Record<string, unknown>;
  risk_level: string;
  status: string;
  reversible: boolean;
  error_message: string | null;
  created_at: string;
  applied_at: string | null;
};

async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const { data } = await ctx.supabase.rpc("is_super_admin", { _user_id: ctx.userId });
  if (!data) throw new Error("Bu işlem için yetkiniz bulunmuyor.");
}

// -----------------------------------------------------------------------------
// Conversations
// -----------------------------------------------------------------------------

export const aiListConversations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("ai_conversations")
      .select("id, title, category, pinned, archived, last_message_at, created_at")
      .order("pinned", { ascending: false })
      .order("last_message_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const aiCreateConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { title?: string; category?: string }) => ({
    title: (input?.title ?? "Yeni görüşme").slice(0, 120),
    category: input?.category?.slice(0, 60),
  }))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { data: row, error } = await context.supabase
      .from("ai_conversations")
      .insert({ user_id: context.userId, title: data.title, category: data.category ?? null })
      .select("id, title, category, pinned, archived, last_message_at, created_at")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const aiDeleteConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => ({ id: String(input.id) }))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("ai_conversations")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const aiRenameConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; title: string }) => ({
    id: String(input.id),
    title: String(input.title ?? "").slice(0, 120),
  }))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("ai_conversations")
      .update({ title: data.title || "Yeni görüşme" })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const aiGetMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { conversationId: string }) => ({
    conversationId: String(input.conversationId),
  }))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { data: rows, error } = await context.supabase
      .from("ai_messages")
      .select("id, role, content, metadata, proposal_id, created_at")
      .eq("conversation_id", data.conversationId)
      .order("created_at", { ascending: true })
      .limit(300);
    if (error) throw new Error(error.message);

    const proposalIds = (rows ?? [])
      .map((r: Row) => r.proposal_id)
      .filter(Boolean) as string[];

    let proposals: Record<string, ProposalRow> = {};
    if (proposalIds.length) {
      const { data: props } = await context.supabase
        .from("ai_action_proposals")
        .select("*")
        .in("id", proposalIds);
      for (const p of (props ?? []) as ProposalRow[]) proposals[p.id] = p;
    }
    return { messages: rows ?? [], proposals };
  });

// -----------------------------------------------------------------------------
// Context: list records for the picker
// -----------------------------------------------------------------------------

export const aiListTargets = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { actionType: string; search?: string }) => ({
    actionType: String(input.actionType),
    search: (input.search ?? "").slice(0, 120),
  }))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const entry = ACTION_REGISTRY[data.actionType as ActionType];
    if (!entry) throw new Error("Geçersiz modül");
    let q = context.supabase
      .from(entry.table)
      .select(`id, ${entry.labelField}`)
      .order(entry.labelField, { ascending: true })
      .limit(50);
    if (data.search) q = q.ilike(entry.labelField, `%${data.search}%`);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return (rows ?? []).map((r: Row) => ({
      id: String(r.id),
      label: String(r[entry.labelField] ?? "—"),
    }));
  });

export const aiGetTarget = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { actionType: string; targetId: string }) => ({
    actionType: String(input.actionType),
    targetId: String(input.targetId),
  }))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const entry = ACTION_REGISTRY[data.actionType as ActionType];
    if (!entry) throw new Error("Geçersiz modül");
    const cols = ["id", entry.labelField, ...entry.allowedFields].join(",");
    const { data: row, error } = await context.supabase
      .from(entry.table)
      .select(cols)
      .eq("id", data.targetId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row ?? null;
  });

// -----------------------------------------------------------------------------
// Chat send
// -----------------------------------------------------------------------------

function buildSystemPrompt(): string {
  const menu = Object.entries(ACTION_REGISTRY)
    .map(([key, e]) =>
      `- ${key} → tablo: ${e.table}; izinli alanlar: ${e.allowedFields.join(", ")}`)
    .join("\n");
  return `Sen bir Türkçe web sitesi yönetim asistanısın. Kullanıcı, bir hırdavat B2B şirketinin yönetim panelini kullanıyor.

Kurallar:
- Her yanıtın Türkçe, kurumsal ve net olsun.
- Kullanıcı bir kaydı ve modülü seçmediyse sadece öneri ver veya soru sor. Kayıt seçilmemişse proposal üretme.
- Kullanıcı bir "bağlam" bloğu gönderdiyse (action_type + target_id + mevcut alanlar), o kayıt için değişiklik önerisi üretebilirsin.
- Asla teknik özellik, marka, sertifika, fiyat veya iş taahhüdü uydurma. Bilgi eksikse öneriyi taslak olarak işaretle ve summary'de belirt.
- İzin verilen aksiyon tipleri ve alanları:
${menu}
- Sadece izinli alanları değiştir.

Cevabını KATİ olarak aşağıdaki JSON şemasında dön (başka metin ekleme):
{
  "reply": "kısa açıklayıcı Türkçe yanıt",
  "proposal": null | {
    "action_type": "<yukarıdaki listeden>",
    "target_id": "<seçili kayıt id'si>",
    "summary": "değişikliğin bir cümlelik özeti",
    "risk_level": "low" | "medium",
    "changes": { "alan_adı": "yeni değer", ... },
    "reasoning": "kısa gerekçe"
  }
}`;
}

async function checkRateLimit(context: { supabase: any; userId: string }) {
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await context.supabase
    .from("ai_messages")
    .select("id", { count: "exact", head: true })
    .eq("role", "user")
    .gte("created_at", since);
  if ((count ?? 0) >= RATE_PER_HOUR) {
    throw new Error("Saatlik kullanım sınırına ulaştınız. Daha sonra tekrar deneyin.");
  }
}

async function callLovableAi(messages: any[]) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Yapay zekâ servisi yapılandırılmamış.");
  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      response_format: { type: "json_object" },
      temperature: 0.4,
    }),
  });
  if (res.status === 429) throw new Error("Yapay zekâ servisi şu anda çok yoğun. Bir süre sonra tekrar deneyin.");
  if (res.status === 402) throw new Error("Yapay zekâ kredisi tükendi. Yönetici ile iletişime geçin.");
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("[ai] gateway error", res.status, body.slice(0, 400));
    throw new Error("Yapay zekâ hizmetine şu anda ulaşılamıyor.");
  }
  const data = await res.json();
  const raw: string = data?.choices?.[0]?.message?.content ?? "{}";
  try { return JSON.parse(raw); } catch {
    return { reply: raw.slice(0, 2000), proposal: null };
  }
}

function validateProposal(p: any): { ok: true; value: any } | { ok: false; error: string } {
  if (!p || typeof p !== "object") return { ok: false, error: "Öneri boş." };
  const at = p.action_type as ActionType;
  const entry = ACTION_REGISTRY[at];
  if (!entry) return { ok: false, error: "Bilinmeyen aksiyon tipi." };
  if (!p.target_id || typeof p.target_id !== "string") return { ok: false, error: "Hedef kayıt eksik." };
  if (!p.changes || typeof p.changes !== "object") return { ok: false, error: "Değişiklik verisi eksik." };
  const cleaned: Record<string, string> = {};
  for (const [k, v] of Object.entries(p.changes)) {
    if (!entry.allowedFields.includes(k)) continue;
    if (v == null) continue;
    const s = String(v);
    const max = entry.maxLen[k] ?? 2000;
    if (s.length > max) return { ok: false, error: `${entry.fieldLabels[k]} en fazla ${max} karakter olabilir.` };
    cleaned[k] = s;
  }
  if (Object.keys(cleaned).length === 0) return { ok: false, error: "Uygulanabilir alan bulunamadı." };
  return {
    ok: true,
    value: {
      action_type: at,
      target_table: entry.table,
      target_id: String(p.target_id),
      summary: String(p.summary ?? "İçerik güncellemesi").slice(0, 300),
      risk_level: p.risk_level === "medium" ? "medium" : "low",
      changes: cleaned,
    },
  };
}

export const aiSendMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: {
    conversationId: string;
    content: string;
    context?: { actionType: string; targetId: string } | null;
  }) => ({
    conversationId: String(input.conversationId),
    content: String(input.content ?? "").slice(0, MAX_MSG_LEN),
    context: input.context
      ? { actionType: String(input.context.actionType), targetId: String(input.context.targetId) }
      : null,
  }))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    if (!data.content.trim()) throw new Error("Mesaj boş olamaz.");
    await checkRateLimit(context);

    // Load history
    const { data: history } = await context.supabase
      .from("ai_messages")
      .select("role, content")
      .eq("conversation_id", data.conversationId)
      .order("created_at", { ascending: true })
      .limit(MAX_HISTORY);

    // Context row snapshot
    let contextBlock = "";
    let targetSnapshot: Row | null = null;
    if (data.context) {
      const entry = ACTION_REGISTRY[data.context.actionType as ActionType];
      if (entry) {
        const cols = ["id", entry.labelField, ...entry.allowedFields].join(",");
        const { data: row } = await context.supabase
          .from(entry.table)
          .select(cols)
          .eq("id", data.context.targetId)
          .maybeSingle();
        targetSnapshot = row;
        if (row) {
          const current: Record<string, unknown> = {};
          for (const f of entry.allowedFields) current[f] = row[f];
          contextBlock = `\n\n[Bağlam]\naction_type: ${data.context.actionType}\ntarget_id: ${data.context.targetId}\nMevcut alanlar:\n${JSON.stringify(current, null, 2)}`;
        }
      }
    }

    const userContent = data.content + contextBlock;

    // Store user message first
    await context.supabase.from("ai_messages").insert({
      conversation_id: data.conversationId,
      role: "user",
      content: data.content,
      metadata: data.context ? { context: data.context } : {},
    });

    // Build model messages
    const modelMessages = [
      { role: "system", content: buildSystemPrompt() },
      ...(history ?? []).map((m: Row) => ({ role: m.role, content: m.content })),
      { role: "user", content: userContent },
    ];

    let ai: any;
    try {
      ai = await callLovableAi(modelMessages);
    } catch (e: any) {
      const msg = e?.message ?? "Yapay zekâ hizmetine ulaşılamadı.";
      await context.supabase.from("ai_messages").insert({
        conversation_id: data.conversationId,
        role: "assistant",
        content: msg,
        metadata: { error: true },
      });
      await context.supabase
        .from("ai_conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", data.conversationId);
      throw e;
    }

    const reply: string = String(ai.reply ?? "").slice(0, 4000) ||
      "Yardımcı olabileceğim başka bir şey var mı?";

    let proposalId: string | null = null;
    let proposalRow: ProposalRow | null = null;

    if (ai.proposal) {
      const v = validateProposal(ai.proposal);
      if (v.ok && targetSnapshot) {
        const entry = ACTION_REGISTRY[v.value.action_type as ActionType];
        const before: Record<string, unknown> = {};
        for (const k of Object.keys(v.value.changes)) before[k] = targetSnapshot[k] ?? null;

        const { data: p, error } = await context.supabase
          .from("ai_action_proposals")
          .insert({
            conversation_id: data.conversationId,
            created_by: context.userId,
            action_type: v.value.action_type,
            target_table: entry.table,
            target_id: v.value.target_id,
            summary: v.value.summary,
            before_value: before,
            after_value: v.value.changes,
            proposed_changes: v.value.changes,
            risk_level: v.value.risk_level,
            status: "pending",
          })
          .select("*")
          .single();
        if (!error && p) {
          proposalId = p.id;
          proposalRow = p as ProposalRow;
        }
      }
    }

    const { data: assistantMsg } = await context.supabase
      .from("ai_messages")
      .insert({
        conversation_id: data.conversationId,
        role: "assistant",
        content: reply,
        proposal_id: proposalId,
      })
      .select("id, role, content, metadata, proposal_id, created_at")
      .single();

    await context.supabase
      .from("ai_conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", data.conversationId);

    return { assistantMessage: assistantMsg, proposal: proposalRow };
  });

// -----------------------------------------------------------------------------
// Approve / reject / undo
// -----------------------------------------------------------------------------

export const aiApproveProposal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => ({ id: String(input.id) }))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { data: prop, error: fetchErr } = await context.supabase
      .from("ai_action_proposals")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (fetchErr || !prop) throw new Error("Öneri bulunamadı.");
    if (prop.status !== "pending") throw new Error("Bu öneri artık uygulanamaz.");
    const entry = ACTION_REGISTRY[prop.action_type as ActionType];
    if (!entry) throw new Error("Bilinmeyen aksiyon tipi.");

    // Re-snapshot the CURRENT before applying (for accurate undo)
    const cols = ["id", ...entry.allowedFields].join(",");
    const { data: current, error: curErr } = await context.supabase
      .from(entry.table)
      .select(cols)
      .eq("id", prop.target_id)
      .maybeSingle();
    if (curErr || !current) throw new Error("Hedef kayıt bulunamadı.");

    const changes = prop.proposed_changes as Record<string, unknown>;
    const before: Record<string, unknown> = {};
    const clean: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(changes)) {
      if (!entry.allowedFields.includes(k)) continue;
      before[k] = current[k] ?? null;
      clean[k] = v;
    }
    if (Object.keys(clean).length === 0) throw new Error("Uygulanabilir alan yok.");

    const { error: upErr } = await context.supabase
      .from(entry.table)
      .update(clean)
      .eq("id", prop.target_id);
    if (upErr) {
      await context.supabase
        .from("ai_action_proposals")
        .update({ status: "failed", error_message: upErr.message })
        .eq("id", data.id);
      throw new Error("İçerik güncellenemedi. Mevcut veriler korunmuştur.");
    }

    const { data: updated } = await context.supabase
      .from("ai_action_proposals")
      .update({
        status: "applied",
        applied_at: new Date().toISOString(),
        applied_by: context.userId,
        before_value: before,
      })
      .eq("id", data.id)
      .select("*")
      .single();
    return updated;
  });

export const aiRejectProposal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => ({ id: String(input.id) }))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { data: updated, error } = await context.supabase
      .from("ai_action_proposals")
      .update({ status: "rejected" })
      .eq("id", data.id)
      .eq("status", "pending")
      .select("*")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return updated;
  });

export const aiUndoProposal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => ({ id: String(input.id) }))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { data: prop, error } = await context.supabase
      .from("ai_action_proposals")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error || !prop) throw new Error("Kayıt bulunamadı.");
    if (prop.status !== "applied") throw new Error("Sadece uygulanmış değişiklikler geri alınabilir.");
    const entry = ACTION_REGISTRY[prop.action_type as ActionType];
    if (!entry) throw new Error("Aksiyon tipi tanınmadı.");
    const before = (prop.before_value ?? {}) as Record<string, unknown>;
    const clean: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(before)) {
      if (entry.allowedFields.includes(k)) clean[k] = v;
    }
    if (Object.keys(clean).length === 0) throw new Error("Geri alınabilecek alan yok.");
    const { error: upErr } = await context.supabase
      .from(entry.table)
      .update(clean)
      .eq("id", prop.target_id);
    if (upErr) throw new Error("Geri alma sırasında bir hata oluştu.");
    const { data: updated } = await context.supabase
      .from("ai_action_proposals")
      .update({ status: "undone" })
      .eq("id", data.id)
      .select("*")
      .single();
    return updated;
  });

// -----------------------------------------------------------------------------
// History
// -----------------------------------------------------------------------------

export const aiListHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input?: { status?: string; limit?: number }) => ({
    status: input?.status ?? null,
    limit: Math.min(Math.max(input?.limit ?? 100, 1), 300),
  }))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    let q = context.supabase
      .from("ai_action_proposals")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (data.status) q = q.eq("status", data.status);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });
