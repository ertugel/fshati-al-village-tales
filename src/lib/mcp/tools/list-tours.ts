import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "list_tours",
  title: "List tours",
  description: "List active tours offered on Fshati.al with optional filters.",
  inputSchema: {
    zone: z.string().optional(),
    difficulty: z.string().optional().describe("e.g. easy, moderate, hard"),
    duration_category: z.string().optional().describe("e.g. day, multi-day"),
    limit: z.number().int().min(1).max(50).optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ zone, difficulty, duration_category, limit }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    let q = supabase
      .from("tours")
      .select("id,title,duration,duration_category,price,difficulty,zone,description,includes,featured")
      .eq("is_active", true)
      .eq("status", "active")
      .limit(limit ?? 20);
    if (zone) q = q.ilike("zone", `%${zone}%`);
    if (difficulty) q = q.eq("difficulty", difficulty);
    if (duration_category) q = q.eq("duration_category", duration_category);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { tours: data ?? [] },
    };
  },
});
