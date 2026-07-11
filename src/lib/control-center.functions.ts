import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Ctx = { supabase: any; userId: string };

async function assertStaff(context: any): Promise<void> {
  const sb: any = (context as Ctx).supabase;
  const { data } = await sb.rpc("is_internal_staff", { _user_id: (context as Ctx).userId });
  if (!data) throw new Error("Bu işlem için yetkiniz bulunmuyor.");
}

// ------- Snapshot: tek istekle kontrol merkezi verisi -------

export const getControlCenterSnapshot = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<any> => {
    await assertStaff(context);
    const sb: any = (context as Ctx).supabase;
    const userId = (context as Ctx).userId;

    const countHead = (t: string, filter?: (q: any) => any) => {
      const q = sb.from(t).select("id", { count: "exact", head: true });
      return filter ? filter(q) : q;
    };

    const [
      products, publishedProducts, draftProducts, missingProductImages,
      services, brochures, activeBrochures,
      newMessages, quoteRequests, pendingQuotes,
      jobApplications, blogPosts,
      openFindings, urgentFindings,
      openTasks,
      pendingProposals,
      recentActivity,
      preferences,
      recentProposals,
      recentFindings,
    ] = await Promise.all([
      countHead("products"),
      countHead("products", (q) => q.eq("published", true)),
      countHead("products", (q) => q.eq("published", false)),
      countHead("products", (q) => q.is("image_url", null)),
      countHead("services"),
      countHead("homepage_brochures"),
      countHead("homepage_brochures", (q) => q.eq("is_active", true)),
      countHead("contact_messages", (q) => q.eq("status", "new")),
      countHead("quote_requests"),
      countHead("quote_requests", (q) => q.eq("status", "pending")),
      countHead("job_applications", (q) => q.eq("status", "new")),
      countHead("blog_posts"),
      countHead("ai_audit_findings", (q) => q.eq("status", "open")),
      countHead("ai_audit_findings", (q) => q.eq("status", "open").eq("severity", "acil")),
      countHead("ai_task_items", (q) => q.eq("user_id", userId).in("status", ["open", "in_progress"])),
      countHead("ai_action_proposals", (q) => q.in("status", ["pending", "approved"])),
      sb.from("ai_action_proposals")
        .select("id, action_type, target_table, target_id, status, created_at")
        .order("created_at", { ascending: false })
        .limit(10),
      sb.from("ai_project_preferences").select("*").maybeSingle(),
      sb.from("ai_action_proposals")
        .select("id, action_type, target_table, target_id, status, risk, created_at, request_summary")
        .in("status", ["pending", "approved"])
        .order("created_at", { ascending: false })
        .limit(6),
      sb.from("ai_audit_findings")
        .select("id, category, severity, message_tr, suggestion_tr, target_table, target_id, action_type, status, detected_at")
        .eq("status", "open")
        .order("detected_at", { ascending: false })
        .limit(20),
    ]);

    const missingImages = missingProductImages.count ?? 0;
    const draftContent = draftProducts.count ?? 0;
    const urgent = urgentFindings.count ?? 0;
    const openFn = openFindings.count ?? 0;

    // Basit sağlık puanı: 100 - eksiklik ağırlığı
    let health = 100;
    health -= Math.min(30, urgent * 6);
    health -= Math.min(20, missingImages * 2);
    health -= Math.min(15, Math.max(0, openFn - urgent) * 1);
    health = Math.max(30, Math.min(100, Math.round(health)));

    return {
      counts: {
        products: products.count ?? 0,
        publishedProducts: publishedProducts.count ?? 0,
        draftProducts: draftProducts.count ?? 0,
        missingProductImages: missingImages,
        services: services.count ?? 0,
        brochures: brochures.count ?? 0,
        activeBrochures: activeBrochures.count ?? 0,
        newMessages: newMessages.count ?? 0,
        quoteRequests: quoteRequests.count ?? 0,
        pendingQuotes: pendingQuotes.count ?? 0,
        jobApplications: jobApplications.count ?? 0,
        blogPosts: blogPosts.count ?? 0,
        openFindings: openFn,
        urgentFindings: urgent,
        openTasks: openTasks.count ?? 0,
        pendingProposals: pendingProposals.count ?? 0,
      },
      healthScore: health,
      recentActivity: recentActivity.data ?? [],
      preferences: preferences.data ?? null,
      pendingChanges: recentProposals.data ?? [],
      recommendations: recentFindings.data ?? [],
    };
  });

// ------- Site sağlık taraması -------

export const runSiteAudit = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<any> => {
    await assertStaff(context);
    const sb: any = (context as Ctx).supabase;

    // Yeni taramaya başlamadan önce daha önceki açık bulguları temizleyelim.
    await sb.from("ai_audit_findings").delete().eq("status", "open");

    const findings: any[] = [];

    // Ürünler: eksik görsel
    const missingImg = await sb
      .from("products")
      .select("id, name")
      .is("image_url", null)
      .limit(50);
    for (const p of missingImg.data ?? []) {
      findings.push({
        category: "urun",
        severity: "onemli",
        target_table: "products",
        target_id: p.id,
        message_tr: `"${p.name}" ürününün ana görseli eksik.`,
        suggestion_tr: "Ürün için bir kapak görseli yükleyin veya AI'ye alternatif metin hazırlatın.",
        action_type: "bulk_fix_alt_text",
      });
    }

    // Ürünler: eksik açıklama
    const missingDesc = await sb
      .from("products")
      .select("id, name")
      .or("description.is.null,description.eq.")
      .limit(50);
    for (const p of missingDesc.data ?? []) {
      findings.push({
        category: "urun",
        severity: "iyilestirme",
        target_table: "products",
        target_id: p.id,
        message_tr: `"${p.name}" ürününün açıklaması boş.`,
        suggestion_tr: "Yapay Zekâ ile bir taslak açıklama hazırlayın.",
        action_type: "update_product_content",
      });
    }

    // SEO: eksik seo başlığı (blog)
    const seoBlog = await sb
      .from("blog_posts")
      .select("id, title")
      .or("seo_title.is.null,seo_description.is.null")
      .limit(50);
    for (const b of seoBlog.data ?? []) {
      findings.push({
        category: "seo",
        severity: "onemli",
        target_table: "blog_posts",
        target_id: b.id,
        message_tr: `"${b.title}" yazısının Google başlığı veya açıklaması eksik.`,
        suggestion_tr: "Bu yazının Google'da görünen kısa açıklamasını iyileştirin.",
        action_type: "update_blog_content",
      });
    }

    // Broşür: süresi geçmiş ama aktif
    const nowIso = new Date().toISOString();
    const expiredBr = await sb
      .from("homepage_brochures")
      .select("id, title")
      .eq("is_active", true)
      .lt("expire_at", nowIso)
      .limit(50);
    for (const b of expiredBr.data ?? []) {
      findings.push({
        category: "brosur",
        severity: "acil",
        target_table: "homepage_brochures",
        target_id: b.id,
        message_tr: `"${b.title}" broşürünün yayın süresi dolmuş fakat hâlâ aktif.`,
        suggestion_tr: "Süresi geçen broşürü pasif duruma alın.",
        action_type: "deactivate_expired_brochures",
      });
    }

    // Broşür: eksik mobil görsel
    const noMobile = await sb
      .from("homepage_brochures")
      .select("id, title")
      .eq("is_active", true)
      .or("image_mobile_url.is.null,image_mobile_url.eq.")
      .limit(50);
    for (const b of noMobile.data ?? []) {
      findings.push({
        category: "brosur",
        severity: "iyilestirme",
        target_table: "homepage_brochures",
        target_id: b.id,
        message_tr: `"${b.title}" broşürünün mobil görseli tanımlı değil.`,
        suggestion_tr: "Mobil için ayrı bir görsel yükleyin, yoksa masaüstü görseli kullanılır.",
      });
    }

    // SSS: eksik cevap
    const emptyFaq = await sb
      .from("faqs")
      .select("id, question")
      .or("answer.is.null,answer.eq.")
      .limit(50);
    for (const f of emptyFaq.data ?? []) {
      findings.push({
        category: "sss",
        severity: "iyilestirme",
        target_table: "faqs",
        target_id: f.id,
        message_tr: `"${f.question}" sorusunun cevabı boş.`,
        suggestion_tr: "Yapay Zekâ'dan taslak bir yanıt isteyin.",
        action_type: "update_faq_content",
      });
    }

    // Site ayarları: telefon veya e-posta eksik
    const settings = await sb.from("site_settings").select("*").maybeSingle();
    const s = settings.data ?? null;
    if (s) {
      if (!s.phone) {
        findings.push({
          category: "iletisim",
          severity: "onemli",
          target_table: "site_settings",
          target_id: s.id,
          message_tr: "Site genel ayarlarında telefon numarası tanımlı değil.",
          suggestion_tr: "Site Ayarları > İletişim bölümünden telefon ekleyin.",
        });
      }
      if (!s.email) {
        findings.push({
          category: "iletisim",
          severity: "onemli",
          target_table: "site_settings",
          target_id: s.id,
          message_tr: "Site genel ayarlarında e-posta adresi tanımlı değil.",
          suggestion_tr: "Ziyaretçilerin ulaşabilmesi için e-posta ekleyin.",
        });
      }
    }

    if (findings.length > 0) {
      const { error } = await sb.from("ai_audit_findings").insert(findings);
      if (error) throw new Error(error.message);
    }

    return { insertedCount: findings.length };
  });

// ------- Bulgu durumu güncelleme -------

export const updateFindingStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown): { id: string; status: "open" | "snoozed" | "dismissed" | "resolved" } => {
    const d = input as any;
    if (!d?.id || !d?.status) throw new Error("Geçersiz istek");
    return d;
  })
  .handler(async ({ data, context }): Promise<any> => {
    await assertStaff(context);
    const sb: any = (context as Ctx).supabase;
    const patch: any = { status: data.status };
    if (data.status === "resolved") patch.resolved_at = new Date().toISOString();
    if (data.status === "snoozed") {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      patch.snooze_until = d.toISOString();
    }
    const { error } = await sb.from("ai_audit_findings").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ------- Görevler -------

export const listMyTasks = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<any> => {
    await assertStaff(context);
    const sb: any = (context as Ctx).supabase;
    const userId = (context as Ctx).userId;
    const { data, error } = await sb
      .from("ai_task_items")
      .select("id, title_tr, description_tr, status, priority, source, due_at, created_at")
      .eq("user_id", userId)
      .in("status", ["open", "in_progress"])
      .order("priority", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createTask = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown): { title_tr: string; description_tr?: string; priority?: string } => {
    const d = input as any;
    if (!d?.title_tr || typeof d.title_tr !== "string") throw new Error("Başlık zorunlu");
    return { title_tr: d.title_tr.slice(0, 300), description_tr: d.description_tr ?? null, priority: d.priority ?? "normal" };
  })
  .handler(async ({ data, context }): Promise<any> => {
    await assertStaff(context);
    const sb: any = (context as Ctx).supabase;
    const { error } = await sb.from("ai_task_items").insert({
      user_id: (context as Ctx).userId,
      title_tr: data.title_tr,
      description_tr: data.description_tr,
      priority: data.priority,
      source: "user",
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const completeTask = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown): { id: string } => {
    const d = input as any;
    if (!d?.id) throw new Error("Geçersiz istek");
    return d;
  })
  .handler(async ({ data, context }): Promise<any> => {
    await assertStaff(context);
    const sb: any = (context as Ctx).supabase;
    const { error } = await sb
      .from("ai_task_items")
      .update({ status: "done", completed_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ------- Tercihler -------

export const savePreferences = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown): any => input ?? {})
  .handler(async ({ data, context }): Promise<any> => {
    await assertStaff(context);
    const sb: any = (context as Ctx).supabase;
    const patch: any = {};
    for (const k of ["tone", "formality", "default_mode", "homepage_density", "visual_style", "brand_terms"]) {
      if ((data as any)[k] !== undefined) patch[k] = (data as any)[k];
    }
    patch.updated_by = (context as Ctx).userId;
    const { error } = await sb.from("ai_project_preferences").update(patch).eq("singleton", true);
    if (error) throw new Error(error.message);
    return { ok: true };
  });