import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "list_events",
  title: "List upcoming events",
  description: "List upcoming cultural and sporting events across Albania on Fshati.al.",
  inputSchema: {
    zone: z.string().optional(),
    limit: z.number().int().min(1).max(50).optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ zone, limit }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    let q = supabase
      .from("events")
      .select("id,title,type,start_date,end_date,location,zone,description,price,price_note,featured")
      .eq("status", "active")
      .order("start_date", { ascending: true })
      .limit(limit ?? 20);
    if (zone) q = q.ilike("zone", `%${zone}%`);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { events: data ?? [] },
    };
  },
});
