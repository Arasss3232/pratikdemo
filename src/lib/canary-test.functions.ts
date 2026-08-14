import { createServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

export const testCanaryPipeline = createServerFn({ method: "POST" })
  .handler(async () => {
    const canary = "CMS-CANARY-2026-REFLECTION-TEST";
    
    // 1. Get Top Bar Section ID
    const { data: section } = await supabase
      .from("page_sections")
      .select("id")
      .eq("section_key", "top_bar_content")
      .maybeSingle();
      
    if (!section) return { success: false, error: "Section not found" };
    
    // 2. Update WhatsApp Label Field
    const { data: updated, error } = await supabase
      .from("section_content")
      .update({ value_text: canary } as any)
      .eq("section_id", section.id)
      .eq("field_key", "whatsapp_label")
      .select()
      .single();
      
    if (error) return { success: false, error: error.message };
    
    return { success: true, updated };
  });

export const restoreCanaryPipeline = createServerFn({ method: "POST" })
  .handler(async () => {
    const original = "WhatsApp";
    
    const { data: section } = await supabase
      .from("page_sections")
      .select("id")
      .eq("section_key", "top_bar_content")
      .maybeSingle();
      
    if (!section) return { success: false, error: "Section not found" };
    
    await supabase
      .from("section_content")
      .update({ value_text: original } as any)
      .eq("section_id", section.id)
      .eq("field_key", "whatsapp_label");
      
    return { success: true };
  });
