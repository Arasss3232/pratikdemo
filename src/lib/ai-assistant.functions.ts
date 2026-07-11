import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { ACTION_REGISTRY, type ActionType } from "./ai-assistant-registry";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash";
const MAX_MSG_LEN = 4000;
const MAX_HISTORY = 16;
const RATE_PER_HOUR = 60;

type AnyObj = Record<string, any>;

async function assertAdmin(context: any): Promise<void> {
  const sb: any = context.supabase;
  const { data } = await sb.rpc("is_super_admin", { _user_id: context.userId });
  if (!data) throw new Error("Bu işlem için yetkiniz bulunmuyor.");
}

// ---------- Conversations ----------

export const aiListConversations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<any> => {
    await assertAdmin(context);
    const sb: any = (context as any).supabase;
    const { data, error } = await sb
      .from("ai_conversations")
      .select("id, title, category, pinned, archived, last_message_at, created_at")
      .order("pinned", { ascending: false })
      .order("last_message_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return (data ?? []) as any;
  });

export const aiCreateConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { title?: string; category?: string }) => ({
    title: (input?.title ?? "Yeni görüşme").slice(0, 120),
    category: input?.category?.slice(0, 60) ?? null,
  }))
  .handler(async ({ context, data }): Promise<any> => {
    await assertAdmin(context);
    const sb: any = (context as any).supabase;
    const { data: row, error } = await sb
      .from("ai_conversations")
      .insert({ user_id: (context as any).userId, title: data.title, category: data.category })
      .select("id, title, category, pinned, archived, last_message_at, created_at")
      .single();
    if (error) throw new Error(error.message);
    return row as any;
  });

export const aiDeleteConversation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => ({ id: String(input.id) }))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const sb: any = (context as any).supabase;
    const { error } = await sb.from("ai_conversations").delete().eq("id", data.id);
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
    const sb: any = (context as any).supabase;
    const { error } = await sb
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
  .handler(async ({ context, data }): Promise<any> => {
    await assertAdmin(context);
    const sb: any = (context as any).supabase;
    const { data: rows, error } = await sb
      .from("ai_messages")
      .select("id, role, content, metadata, proposal_id, created_at")
      .eq("conversation_id", data.conversationId)
      .order("created_at", { ascending: true })
      .limit(300);
    if (error) throw new Error(error.message);

    const proposalIds = (rows ?? [])
      .map((r: AnyObj) => r.proposal_id)
      .filter(Boolean) as string[];

    const proposals: Record<string, any> = {};
    if (proposalIds.length) {
      const { data: props } = await sb
        .from("ai_action_proposals")
        .select("*")
        .in("id", proposalIds);
      for (const p of (props ?? []) as AnyObj[]) proposals[String(p.id)] = p;
    }
    return { messages: rows ?? [], proposals } as any;
  });

// ---------- Targets ----------

export const aiListTargets = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { actionType: string; search?: string }) => ({
    actionType: String(input.actionType),
    search: (input.search ?? "").slice(0, 120),
  }))
  .handler(async ({ context, data }): Promise<any> => {
    await assertAdmin(context);
    const entry = ACTION_REGISTRY[data.actionType as ActionType];
    if (!entry) throw new Error("Geçersiz modül");
    const sb: any = (context as any).supabase;
    let q = sb
      .from(entry.table)
      .select(`id, ${entry.labelField}`)
      .order(entry.labelField, { ascending: true })
      .limit(50);
    if (data.search) q = q.ilike(entry.labelField, `%${data.search}%`);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return ((rows ?? []) as AnyObj[]).map((r) => ({
      id: String(r.id),
      label: String(r[entry.labelField] ?? "—"),
    })) as any;
  });

export const aiGetTarget = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { actionType: string; targetId: string }) => ({
    actionType: String(input.actionType),
    targetId: String(input.targetId),
  }))
  .handler(async ({ context, data }): Promise<any> => {
    await assertAdmin(context);
    const entry = ACTION_REGISTRY[data.actionType as ActionType];
    if (!entry) throw new Error("Geçersiz modül");
    const sb: any = (context as any).supabase;
    const cols = ["id", entry.labelField, ...entry.allowedFields].join(",");
    const { data: row, error } = await sb
      .from(entry.table)
      .select(cols)
      .eq("id", data.targetId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (row ?? null) as any;
  });

// ---------- Chat send ----------

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

async function checkRateLimit(context: any) {
  const sb: any = context.supabase;
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  // Per-user rate limit: only count messages inside this user's own conversations
  const { data: myConvos } = await sb
    .from("ai_conversations")
    .select("id")
    .eq("user_id", (context as any).userId);
  const ids = ((myConvos ?? []) as AnyObj[]).map((r) => r.id);
  if (ids.length === 0) return;
  const { count } = await sb
    .from("ai_messages")
    .select("id", { count: "exact", head: true })
    .eq("role", "user")
    .in("conversation_id", ids)
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
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages,
      response_format: { type: "json_object" },
      temperature: 0.4,
    }),
  });
  if (res.status === 429) throw new Error("Yapay zekâ servisi çok yoğun. Bir süre sonra tekrar deneyin.");
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
  .handler(async ({ context, data }): Promise<any> => {
    await assertAdmin(context);
    if (!data.content.trim()) throw new Error("Mesaj boş olamaz.");
    await checkRateLimit(context);
    const sb: any = (context as any).supabase;

    const { data: history } = await sb
      .from("ai_messages")
      .select("role, content")
      .eq("conversation_id", data.conversationId)
      .order("created_at", { ascending: true })
      .limit(MAX_HISTORY);

    let contextBlock = "";
    let targetSnapshot: AnyObj | null = null;
    if (data.context) {
      const entry = ACTION_REGISTRY[data.context.actionType as ActionType];
      if (entry) {
        const cols = ["id", entry.labelField, ...entry.allowedFields].join(",");
        const { data: row } = await sb
          .from(entry.table)
          .select(cols)
          .eq("id", data.context.targetId)
          .maybeSingle();
        targetSnapshot = (row ?? null) as AnyObj | null;
        if (targetSnapshot) {
          const current: AnyObj = {};
          for (const f of entry.allowedFields) current[f] = targetSnapshot[f];
          contextBlock = `\n\n[Bağlam]\naction_type: ${data.context.actionType}\ntarget_id: ${data.context.targetId}\nMevcut alanlar:\n${JSON.stringify(current, null, 2)}`;
        }
      }
    }

    const userContent = data.content + contextBlock;

    await sb.from("ai_messages").insert({
      conversation_id: data.conversationId,
      role: "user",
      content: data.content,
      metadata: (data.context ? { context: data.context } : {}) as any,
    });

    const modelMessages = [
      { role: "system", content: buildSystemPrompt() },
      ...((history ?? []) as AnyObj[]).map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: userContent },
    ];

    let ai: any;
    try {
      ai = await callLovableAi(modelMessages);
    } catch (e: any) {
      const msg = e?.message ?? "Yapay zekâ hizmetine ulaşılamadı.";
      await sb.from("ai_messages").insert({
        conversation_id: data.conversationId,
        role: "assistant",
        content: msg,
        metadata: { error: true } as any,
      });
      await sb
        .from("ai_conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", data.conversationId);
      throw e;
    }

    const reply: string = String(ai.reply ?? "").slice(0, 4000) ||
      "Yardımcı olabileceğim başka bir şey var mı?";

    let proposalId: string | null = null;
    let proposalRow: AnyObj | null = null;

    if (ai.proposal) {
      const v = validateProposal(ai.proposal);
      if (v.ok && targetSnapshot) {
        const entry = ACTION_REGISTRY[v.value.action_type as ActionType];
        const before: AnyObj = {};
        for (const k of Object.keys(v.value.changes)) before[k] = targetSnapshot[k] ?? null;

        const { data: p, error } = await sb
          .from("ai_action_proposals")
          .insert({
            conversation_id: data.conversationId,
            created_by: (context as any).userId,
            action_type: v.value.action_type,
            target_table: entry.table,
            target_id: v.value.target_id,
            summary: v.value.summary,
            before_value: before as any,
            after_value: v.value.changes as any,
            proposed_changes: v.value.changes as any,
            risk_level: v.value.risk_level,
            status: "pending",
          })
          .select("*")
          .single();
        if (!error && p) {
          proposalId = (p as AnyObj).id;
          proposalRow = p as AnyObj;
        }
      }
    }

    const { data: assistantMsg } = await sb
      .from("ai_messages")
      .insert({
        conversation_id: data.conversationId,
        role: "assistant",
        content: reply,
        proposal_id: proposalId,
      })
      .select("id, role, content, metadata, proposal_id, created_at")
      .single();

    await sb
      .from("ai_conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", data.conversationId);

    return { assistantMessage: assistantMsg ?? null, proposal: proposalRow } as any;
  });

// ---------- Approve / Reject / Undo ----------

export const aiApproveProposal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => ({ id: String(input.id) }))
  .handler(async ({ context, data }): Promise<any> => {
    await assertAdmin(context);
    const sb: any = (context as any).supabase;
    const { data: prop, error: fetchErr } = await sb
      .from("ai_action_proposals")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (fetchErr || !prop) throw new Error("Öneri bulunamadı.");
    const p = prop as AnyObj;
    if (p.status !== "pending") throw new Error("Bu öneri artık uygulanamaz.");
    const entry = ACTION_REGISTRY[p.action_type as ActionType];
    if (!entry) throw new Error("Bilinmeyen aksiyon tipi.");

    const cols = ["id", ...entry.allowedFields].join(",");
    const { data: current, error: curErr } = await sb
      .from(entry.table)
      .select(cols)
      .eq("id", p.target_id)
      .maybeSingle();
    if (curErr || !current) throw new Error("Hedef kayıt bulunamadı.");
    const cur = current as AnyObj;

    const changes = (p.proposed_changes ?? {}) as AnyObj;
    const before: AnyObj = {};
    const clean: AnyObj = {};
    for (const [k, v] of Object.entries(changes)) {
      if (!entry.allowedFields.includes(k)) continue;
      before[k] = cur[k] ?? null;
      clean[k] = v;
    }
    if (Object.keys(clean).length === 0) throw new Error("Uygulanabilir alan yok.");

    const { error: upErr } = await sb.from(entry.table).update(clean).eq("id", p.target_id);
    if (upErr) {
      await sb
        .from("ai_action_proposals")
        .update({ status: "failed", error_message: upErr.message })
        .eq("id", data.id);
      throw new Error("İçerik güncellenemedi. Mevcut veriler korunmuştur.");
    }

    const { data: updated } = await sb
      .from("ai_action_proposals")
      .update({
        status: "applied",
        applied_at: new Date().toISOString(),
        applied_by: (context as any).userId,
        before_value: before as any,
      })
      .eq("id", data.id)
      .select("*")
      .single();
    return (updated ?? null) as any;
  });

export const aiRejectProposal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => ({ id: String(input.id) }))
  .handler(async ({ context, data }): Promise<any> => {
    await assertAdmin(context);
    const sb: any = (context as any).supabase;
    const { data: updated, error } = await sb
      .from("ai_action_proposals")
      .update({ status: "rejected" })
      .eq("id", data.id)
      .eq("status", "pending")
      .select("*")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (updated ?? null) as any;
  });

export const aiUndoProposal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => ({ id: String(input.id) }))
  .handler(async ({ context, data }): Promise<any> => {
    await assertAdmin(context);
    const sb: any = (context as any).supabase;
    const { data: prop, error } = await sb
      .from("ai_action_proposals")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error || !prop) throw new Error("Kayıt bulunamadı.");
    const p = prop as AnyObj;
    if (p.status !== "applied") throw new Error("Sadece uygulanmış değişiklikler geri alınabilir.");
    const entry = ACTION_REGISTRY[p.action_type as ActionType];
    if (!entry) throw new Error("Aksiyon tipi tanınmadı.");
    const before = (p.before_value ?? {}) as AnyObj;
    const clean: AnyObj = {};
    for (const [k, v] of Object.entries(before)) {
      if (entry.allowedFields.includes(k)) clean[k] = v;
    }
    if (Object.keys(clean).length === 0) throw new Error("Geri alınabilecek alan yok.");
    const { error: upErr } = await sb.from(entry.table).update(clean).eq("id", p.target_id);
    if (upErr) throw new Error("Geri alma sırasında bir hata oluştu.");
    const { data: updated } = await sb
      .from("ai_action_proposals")
      .update({ status: "undone" })
      .eq("id", data.id)
      .select("*")
      .single();
    return (updated ?? null) as any;
  });

// ---------- History ----------

export const aiListHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input?: { status?: string; limit?: number }) => ({
    status: input?.status ?? null,
    limit: Math.min(Math.max(input?.limit ?? 100, 1), 300),
  }))
  .handler(async ({ context, data }): Promise<any> => {
    await assertAdmin(context);
    const sb: any = (context as any).supabase;
    let q = sb
      .from("ai_action_proposals")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (data.status) q = q.eq("status", data.status);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return (rows ?? []) as any;
  });
