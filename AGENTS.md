<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Bot items, prices and datasheet PDFs live only in `public.catalog_items`, edited from the dashboard and served to n8n via `/api/public/bot-catalog` — one source of truth so quotes and catalogs never diverge.
- PVsyst/SLD files are uploaded once per ready-made system (`preset_reports`, keyed by preset title) and sent by staff from `report_requests`; the bot only files a request, so customers never get an unreviewed report.
- The kWh price lives in `public.app_settings` (key `kwh_price`), edited from the quote screen and sent to n8n inside `/api/public/bot-catalog` — one value for bot and app.
- Quote system picks in `QuoteBuilder` are a literal port of the bot's resNearest/comInvOptions rules; change both together so they never disagree.
