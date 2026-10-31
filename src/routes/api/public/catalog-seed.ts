import { createFileRoute } from "@tanstack/react-router";
import { timingSafeEqual } from "crypto";
import seed from "@/lib/catalog-seed.json";

// One-time loader: fills public.catalog_items from the staged product list, then this route and the JSON are removed.
export const Route = createFileRoute("/api/public/catalog-seed")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const got = Buffer.from(request.headers.get("x-bot-secret") ?? "");
        const exp = Buffer.from(process.env["BOT_INGEST_SECRET"] ?? "");
        if (!exp.length || got.length !== exp.length || !timingSafeEqual(got, exp)) {
          return new Response("Unauthorized", { status: 401 });
        }
        const { supabaseAdmin } = await import("@/lib/db.server");
        const rows = seed as Array<Record<string, unknown>>;
        let ok = 0;
        let fail = 0;
        for (const r of rows) {
          const { error } = await supabaseAdmin.from("catalog_items").upsert(r, { onConflict: "key" });
          if (error) {
            fail++;
            console.error("catalog seed failed for", r.key, error.message);
          } else {
            ok++;
          }
        }
        return Response.json({ ok, fail, total: rows.length });
      },
    },
  },
});
