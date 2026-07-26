import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "list_guides",
  title: "List local guides",
  description: "List active local guides on Fshati.al with optional filters.",
  inputSchema: {
    zone: z.string().optional().describe("Filter by any zone the guide covers."),
    language: z.string().optional().describe("Filter by spoken language."),
    limit: z.number().int().min(1).max(50).optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ zone, language, limit }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    let q = supabase
      .from("guides")
      .select("id,name,specialization,languages,zones,price_per_day,price_max,rating,bio")
      .eq("is_active", true)
      .limit(limit ?? 20);
    if (zone) q = q.contains("zones", [zone]);
    if (language) q = q.contains("languages", [language]);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { guides: data ?? [] },
    };
  },
});
