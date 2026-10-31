# Roadmap

- [x] Delete «يحتاج مخطط» from the chat filter bar
- [x] Move «يحتاج موظف» next to «الكل» in the chat filter bar
- [x] Publish so the filter-bar changes reach the public site
- [x] Reports tab: PVsyst/SLD requests from the bot, per-system PDF files, open + send to customer
- [ ] Switch the live bot to send PVsyst/SLD as requests — blocked: app can't save bot data until the database service key is added
- [x] Editable kWh price (default 290) + app home/business picks copied exactly from the bot
- [x] Bot reads kWh price from the app
- [x] Edit quote items (qty, swap, price, delete) after closing the price card — this copy only
- [x] Three choices (less / recommended / more independence) in app and bot home path
- [x] Bot: three choices for large business systems
- [x] Business three choices = the very next size (app)
- [x] App: pick inverter size + single/three phase for business, like the bot
- [x] Bot: inverter size → phase → three choices (very next size) for business
- [x] App: always ask inverter size first for business, even if only one size
- [ ] Bot: always ask inverter size first — after the key fix
- [x] Connect n8n in the new workspace (linked: حمود's n8n)
- [x] Restore bot password secret (BOT_INGEST_SECRET) — needs publish to take effect
- [ ] Fix duplicate bot replies: cause = every WhatsApp message arrives twice and the app's duplicate guard rejects the bot (missing keys), so both copies reply — blocked on SUPABASE_SERVICE_ROLE_KEY, then publish
