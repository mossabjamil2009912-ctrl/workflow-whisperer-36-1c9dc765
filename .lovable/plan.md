# Business: always ask inverter size (and phase if both exist) before the three choices

## What already works (bot + app)
- After picking a size (e.g. 80 kW), the three choices come only from that size's systems.
- If the recommended system is the largest of that size, only "أقل استقلالية" and "موصى به" appear. If it is the smallest, only "موصى به" and "أكثر استقلالية".
- Single/three phase is asked only when that size has both.

## What changes
- Today, when only one inverter size covers the value (e.g. 6,000 kWh/month → only 20 kW), the bot and app pick it silently and jump to the three choices. From now on the inverter question is always shown, even with one size (one button), so the customer always chooses the inverter first.
- Same in the app: the inverter size buttons always appear for business values above the home range.
- Phase question unchanged: asked only when the chosen size has both single and three phase; otherwise chosen automatically.

## Steps
1. Bot: stop auto-picking the inverter when there is one option; show the inverter buttons.
2. App: always show the inverter size step for business values above the home range.
3. Test in the bot with 6,000 and 30,000 kWh/month (choose 80) and confirm the buttons match the app.

## Technical details
- n8n State Machine: remove the `_opts.length === 1` auto-select in `com_inv_ask` and the matching auto-select before entering `com_inv_ask` (recovery path and `com_value` handler), so the step always renders `invkw_*` buttons.
- `QuoteBuilder.tsx` form submit: show inverter choices whenever `inverterChoices(opts).length >= 1`.
