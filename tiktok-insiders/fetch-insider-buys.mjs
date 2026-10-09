// Récupère sur OpenInsider les achats d'insiders (dirigeants et administrateurs,
// type "P - Purchase", ≥ 100 k$) déposés à la SEC le dernier jour ouvré US, et
// écrit les plus gros dans out/<date>/buys.json.
//
// Usage : node fetch-insider-buys.mjs [YYYY-MM-DD] [--top 5]
//   Sans date : dernier jour ouvré US avant aujourd'hui (heure de New York).
import { mkdir, writeFile } from "node:fs/promises";

const MIN_VALUE_K = 100; // filtre OpenInsider "vl" en milliers de $
const MIN_PRICE_USD = 1; // ignore les penny stocks

const args = process.argv.slice(2);
const topIdx = args.indexOf("--top");
const TOP = topIdx >= 0 ? Number(args[topIdx + 1]) : 5;
const dateArg = args.find(a => /^\d{4}-\d{2}-\d{2}$/.test(a));

function previousUsBusinessDay() {
  const ny = new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
  do ny.setDate(ny.getDate() - 1);
  while (ny.getDay() === 0 || ny.getDay() === 6);
  return ny.toISOString().slice(0, 10);
}

// Screener : achats (xp=1), déposés sur les 7 derniers jours (fd=7), valeur ≥ vl,
// dirigeants (isofficer, isceo, …) et administrateurs (isdirector).
function screenerUrl() {
  const q = new URLSearchParams({
    s: "", o: "", pl: String(MIN_PRICE_USD), ph: "", ll: "", lh: "", fd: "7", fdr: "", td: "0", tdr: "",
    fdlyl: "", fdlyh: "", daysago: "", xp: "1", vl: String(MIN_VALUE_K), vh: "", ocl: "", och: "",
    sic1: "-1", sicl: "100", sich: "9999", isofficer: "1", iscob: "1", isceo: "1", ispres: "1",
    iscoo: "1", iscfo: "1", isgc: "1", isvp: "1", isdirector: "1", grp: "0", nfl: "", nfh: "",
    nil: "", nih: "", nol: "", noh: "", v2l: "", v2h: "", oc2l: "", oc2h: "", sortcol: "0",
    cnt: "500", page: "1",
  });
  return `http://openinsider.com/screener?${q}`;
}

async function fetchHtml(url, attempt = 0) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (insiders-carousel)" } });
  if ((res.status === 429 || res.status >= 500) && attempt < 3) {
    await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
    return fetchHtml(url, attempt + 1);
  }
  if (!res.ok) throw new Error(`OpenInsider ${res.status}`);
  return res.text();
}

const decode = s => s
  .replace(/<[^>]*>/g, " ")
  .replace(/&nbsp;|&#160;/g, " ").replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'")
  .replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n))
  .replace(/\s+/g, " ").trim();
const cellsOf = (rowHtml, tag) =>
  [...rowHtml.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, "gi"))].map(m => decode(m[1]));
// "+$1,234,567" → 1234567 ; "-12%" → -12 ; "New" → NaN
const num = s => Number(String(s).replace(/[^0-9.\-]/g, ""));

// Les colonnes sont retrouvées par leur en-tête (et non leur position) pour
// survivre à un ajout/retrait de colonne côté OpenInsider.
const COLUMNS = {
  filingDate: /^filing ?date$/, tradeDate: /^trade ?date$/, ticker: /^ticker$/,
  company: /^company/, insider: /^insider/, title: /^title$/, tradeType: /^trade ?type$/,
  price: /^price$/, qty: /^qty$/, owned: /^owned$/, deltaOwn: /own$/, value: /^value$/,
};

function parseTable(html) {
  const table = html.match(/<table[^>]*class="[^"]*tinytable[^"]*"[^>]*>([\s\S]*?)<\/table>/i)?.[1];
  if (!table) throw new Error("Tableau OpenInsider introuvable (mise en page modifiée ?)");
  const headers = cellsOf(table, "th").map(h => h.toLowerCase().replace(/[^a-z ]/g, "").trim());
  const col = {};
  for (const [key, re] of Object.entries(COLUMNS)) {
    const i = headers.findIndex(h => re.test(h) && !(key === "deltaOwn" && h === "owned"));
    if (i < 0) throw new Error(`Colonne "${key}" absente. En-têtes : ${headers.join(" | ")}`);
    col[key] = i;
  }
  const rows = [];
  for (const m of table.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const c = cellsOf(m[1], "td");
    if (c.length < headers.length) continue; // ligne d'en-tête
    rows.push(Object.fromEntries(Object.entries(col).map(([k, i]) => [k, c[i]])));
  }
  return rows;
}

const ROLE_FR = [
  [/\bCEO\b/i, "PDG"], [/\bCFO\b/i, "directeur financier"], [/\bCOO\b/i, "directeur des opérations"],
  [/\bPres\b/i, "président"], [/\bCOB\b|Chairman/i, "président du conseil"], [/\bGC\b/i, "directeur juridique"],
  [/\bVP\b/i, "vice-président"], [/\bDir\b/i, "administrateur"], [/10%/, "actionnaire à +10 %"],
];

const date = dateArg || previousUsBusinessDay();
const rows = parseTable(await fetchHtml(screenerUrl()));
console.error(`${rows.length} achats sur 7 jours sur OpenInsider`);

const buys = rows
  .filter(r => r.filingDate.startsWith(date) && /^P\b/.test(r.tradeType))
  .map(r => {
    const shares = num(r.qty), value = num(r.value), delta = num(r.deltaOwn);
    return {
      ticker: r.ticker.toUpperCase(),
      company: r.company,
      insider: r.insider,
      title: r.title,
      rolesFr: ROLE_FR.filter(([re]) => re.test(r.title)).map(([, fr]) => fr),
      filingDate: r.filingDate,
      tradeDate: r.tradeDate,
      shares: Math.round(shares),
      avgPrice: num(r.price),
      valueUsd: Math.round(value),
      sharesOwnedAfter: Math.round(num(r.owned)),
      // Hausse de la position en % (null si "New" = première position)
      positionIncreasePct: Number.isFinite(delta) && /\d/.test(r.deltaOwn) ? delta : null,
      newPosition: /new/i.test(r.deltaOwn),
    };
  })
  .filter(b => b.valueUsd > 0 && b.avgPrice >= MIN_PRICE_USD);

// Fusionne plusieurs lignes d'un même insider sur la même société
const merged = new Map();
for (const b of buys) {
  const key = `${b.ticker}|${b.insider}`;
  const prev = merged.get(key);
  if (!prev) { merged.set(key, b); continue; }
  prev.shares += b.shares;
  prev.valueUsd += b.valueUsd;
  prev.avgPrice = Math.round((prev.valueUsd / prev.shares) * 100) / 100;
  prev.sharesOwnedAfter = Math.max(prev.sharesOwnedAfter, b.sharesOwnedAfter);
}

// Nombre d'insiders distincts qui achètent la même société ("cluster buy")
const insidersPerTicker = {};
for (const b of merged.values()) insidersPerTicker[b.ticker] = (insidersPerTicker[b.ticker] || 0) + 1;

const top = [...merged.values()]
  .map(b => ({ ...b, clusterSize: insidersPerTicker[b.ticker], openInsiderUrl: `http://openinsider.com/${b.ticker}` }))
  .sort((a, b) => b.valueUsd - a.valueUsd)
  .slice(0, TOP);

const result = { filingDate: date, source: "OpenInsider (déclarations SEC Form 4)", purchasesFound: merged.size, top };
await mkdir(`out/${date}`, { recursive: true });
await writeFile(`out/${date}/buys.json`, JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
