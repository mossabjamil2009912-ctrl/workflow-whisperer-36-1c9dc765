// Simulation numbers for a customer's system, scaled from the reference PVsyst run
// (Dhamran Sawan Center, Sanaa, 396 × 720 W, Meteonorm 9.0). Pure functions — no I/O.

export const SITE = { name: "Sanaa", country: "Yemen", lat: 15.3539, lon: 44.2059, alt: 2258, tz: "UTC+3", albedo: 0.2, tilt: 7.5 };
export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// Reference monthly weather + array results (per month) from the reference report.
export const REF = {
  kwp: 285.12,
  produced: 576816,
  globHor: [181.6, 180.3, 210.5, 200.7, 224.6, 206.7, 186.0, 190.1, 203.1, 213.8, 178.8, 175.4],
  diffHor: [38.7, 40.9, 51.53, 63.11, 63.69, 75.21, 84.51, 72.46, 60.0, 43.61, 41.04, 40.87],
  tAmb: [15.03, 17.13, 18.53, 19.93, 22.03, 23.63, 23.23, 22.43, 21.73, 18.03, 15.93, 14.43],
  globInc: [179.5, 178.6, 209.2, 199.9, 224.5, 206.9, 186.0, 189.6, 202.1, 212.1, 176.8, 173.3],
  globEff: [173.3, 172.5, 202.2, 193.1, 217.0, 200.0, 179.7, 183.2, 195.3, 204.9, 170.8, 167.4],
  eArray: [47207, 46389, 54066, 51459, 57483, 52801, 47750, 48626, 51737, 54930, 46439, 45830],
};
export const PANEL_W = 720;
export const PR = 0.8651;
export const LOSSES: [string, string][] = [
  ["Global incident in coll. plane", "-0.56%"], ["Near Shadings: irradiance loss", "-0.14%"], ["Soiling loss factor", "-3.00%"],
  ["IAM factor on global", "-0.26%"], ["PV loss due to irradiance level", "-0.12%"], ["PV loss due to temperature", "-4.68%"],
  ["Module quality loss", "+0.75%"], ["LID - Light induced degradation", "-2.00%"], ["Mismatch loss, modules and strings", "-2.00%"],
  ["Ohmic wiring loss", "-0.05%"], ["Inverter Loss during operation (efficiency)", "-2.24%"], ["System unavailability", "-1.88%"],
  ["Battery global loss", "-0.29%"],
];

export type SystemSpec = { kw: number; invCount: number; three: boolean; panels: number; batKwh: number };

const digits = (s: string) => s.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x660));

/** Reads inverter size/count, phase, panel count and battery kWh from a request's system text. */
export function parseSystem(label: string | null | undefined): SystemSpec | null {
  if (!label) return null;
  const t = digits(label);
  const num = (re: RegExp) => { const m = t.match(re); return m?.[1] ? parseFloat(m[1]) : 0; };
  const kw = num(/(\d+(?:\.\d+)?)\s*كيلو(?!\s*\))/);
  const panels = num(/ألواح:?\s*(\d+)/) || num(/(\d+)\s*(?:لوح|ألواح)/);
  if (!kw || !panels) return null;
  return {
    kw,
    invCount: num(/[×x]\s*(\d+)/) || 1,
    three: /3\s*فاز|ثلاث/.test(t),
    panels,
    batKwh: num(/بطاري(?:ة|ات):?\s*(\d+(?:\.\d+)?)/),
  };
}

const r = (n: number, d = 0) => Math.round(n * 10 ** d) / 10 ** d;

export function simulate(s: SystemSpec) {
  const kwp = r((s.panels * PANEL_W) / 1000, 2);
  const scale = kwp / REF.kwp;
  const toUser = REF.produced / REF.eArray.reduce((a, b) => a + b, 0);
  const eArray = REF.eArray.map((e) => r(e * scale));
  const eGrid = eArray.map((e) => r(e * toUser));
  const produced = eGrid.reduce((a, b) => a + b, 0);
  // Customer load: what the battery covers each night plus daytime use, capped by production.
  const dailyNeed = Math.min(produced / 365, Math.max(s.batKwh * 0.9 + kwp * 1.5, kwp * 2));
  const eUser = DAYS.map((d) => r(dailyNeed * d));
  const used = eUser.reduce((a, b) => a + b, 0);
  const prMonth = REF.globInc.map((g, i) => r(eGrid[i]! / (g * kwp), 3));
  const acKw = s.kw * s.invCount;
  const batV = s.batKwh >= 30 ? 640 : 51.2;
  const series = s.panels >= 18 ? 18 : Math.max(1, s.panels);
  const strings = Math.ceil(s.panels / series);
  const sheds = Math.max(2, Math.ceil(s.panels / 18));
  return {
    kwp, acKw, produced, used,
    specific: r(produced / kwp),
    pr: r(PR * 100, 2),
    sf: 100,
    pnomRatio: r(kwp / acKw, 2),
    eArray, eGrid, eUser, prMonth,
    needsMwh: eUser.map((e) => r(e / 1000, 2)),
    battery: { v: batV, ah: s.batKwh ? r((s.batKwh * 1000) / batV) : 0, kwh: s.batKwh },
    series, strings,
    shedsSouth: Math.ceil(sheds / 2), shedsNorth: Math.floor(sheds / 2),
    area: r(s.panels * 3.11),
  };
}
export type Sim = ReturnType<typeof simulate>;
