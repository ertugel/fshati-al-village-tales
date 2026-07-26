import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "list_destinations",
  title: "List destinations",
  description:
    "List active rural tourism destinations on Fshati.al (agritourism, guesthouses, hotels). Supports optional filters.",
  inputSchema: {
    zone: z.string().optional().describe("Filter by zone (e.g. 'Alps', 'Riviera', 'Berat')."),
    type: z.string().optional().describe("Filter by accommodation type."),
    featured: z.boolean().optional().describe("Only featured destinations."),
    limit: z.number().int().min(1).max(50).optional().describe("Max results (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ zone, type, featured, limit }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    let q = supabase
      .from("destinations")
      .select("id,name,type,zone,price,price_unit,description,rating,review_count,featured,image_url")
      .eq("status", "active")
      .limit(limit ?? 20);
    if (zone) q = q.ilike("zone", `%${zone}%`);
    if (type) q = q.eq("type", type);
    if (featured) q = q.eq("featured", true);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { destinations: data ?? [] },
    };
  },
});
