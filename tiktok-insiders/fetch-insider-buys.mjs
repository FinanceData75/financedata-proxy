// Récupère les achats d'insiders (Form 4, code transaction "P") déposés à la SEC
// sur un jour ouvré donné, et écrit les plus gros dans out/<date>/buys.json.
//
// Usage : node fetch-insider-buys.mjs [YYYY-MM-DD] [--top 5]
//   Sans date : dernier jour ouvré US avant aujourd'hui (heure de New York).
//
// La SEC exige un User-Agent identifiable : SEC_USER_AGENT="Nom email@domaine".
import { XMLParser } from "fast-xml-parser";
import { mkdir, writeFile } from "node:fs/promises";

const UA = process.env.SEC_USER_AGENT || "FinanceData insiders-bot financedata3@gmail.com";
const MIN_VALUE_USD = 100_000; // ignore les petits achats symboliques
const MIN_PRICE_USD = 1; // ignore les penny stocks
const CONCURRENCY = 8; // la SEC tolère 10 requêtes/s

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

async function secFetch(url, attempt = 0) {
  const res = await fetch(url, { headers: { "User-Agent": UA, "Accept-Encoding": "gzip, deflate" } });
  if ((res.status === 429 || res.status >= 500) && attempt < 3) {
    await new Promise(r => setTimeout(r, 1500 * (attempt + 1)));
    return secFetch(url, attempt + 1);
  }
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

async function listForm4Filings(date) {
  const [y, m, d] = date.split("-");
  const qtr = Math.ceil(Number(m) / 3);
  const url = `https://www.sec.gov/Archives/edgar/daily-index/${y}/QTR${qtr}/form.${y}${m}${d}.idx`;
  const idx = await secFetch(url);
  const paths = new Set();
  for (const line of idx.split("\n")) {
    if (!/^4\s/.test(line)) continue; // "4" seul, pas "4/A"
    const path = line.trim().split(/\s+/).pop();
    if (path.endsWith(".txt")) paths.add(path);
  }
  return [...paths];
}

const parser = new XMLParser({ ignoreAttributes: true, parseTagValue: false });
const asArray = v => (v == null ? [] : Array.isArray(v) ? v : [v]);
const val = v => (v && typeof v === "object" ? v.value : v);
const num = v => Number(String(val(v) ?? "").replace(/,/g, "")) || 0;

function parseForm4(text, path) {
  const xml = text.match(/<XML>([\s\S]*?)<\/XML>/i)?.[1]?.trim();
  if (!xml) return null;
  const doc = parser.parse(xml).ownershipDocument;
  if (!doc) return null;

  const owners = asArray(doc.reportingOwner);
  const rel = owners[0]?.reportingOwnerRelationship ?? {};
  const isTrue = v => v === "1" || v === "true";
  // On ne garde que les vrais "insiders" : dirigeants et administrateurs.
  if (!isTrue(rel.isOfficer) && !isTrue(rel.isDirector)) return null;

  const buys = asArray(doc.nonDerivativeTable?.nonDerivativeTransaction).filter(
    t => t.transactionCoding?.transactionCode === "P" &&
      val(t.transactionAmounts?.transactionAcquiredDisposedCode) === "A"
  );
  if (!buys.length) return null;

  let shares = 0, value = 0, sharesAfter = 0;
  for (const t of buys) {
    const s = num(t.transactionAmounts?.transactionShares);
    shares += s;
    value += s * num(t.transactionAmounts?.transactionPricePerShare);
    sharesAfter = Math.max(sharesAfter, num(t.postTransactionAmounts?.sharesOwnedFollowingTransaction));
  }
  const avgPrice = shares ? value / shares : 0;
  if (value < MIN_VALUE_USD || avgPrice < MIN_PRICE_USD) return null;

  const accession = path.split("/").pop().replace(".txt", "");
  const cik = String(doc.issuer?.issuerCik ?? "").replace(/^0+/, "");
  const roles = [];
  if (isTrue(rel.isOfficer)) roles.push(rel.officerTitle || "Officer");
  if (isTrue(rel.isDirector)) roles.push("Director");

  return {
    ticker: String(doc.issuer?.issuerTradingSymbol ?? "").toUpperCase().trim(),
    company: String(doc.issuer?.issuerName ?? "").trim(),
    insider: String(owners[0]?.reportingOwnerId?.rptOwnerName ?? "").trim(),
    roles,
    transactionDate: val(buys[0].transactionDate),
    shares: Math.round(shares),
    avgPrice: Math.round(avgPrice * 100) / 100,
    valueUsd: Math.round(value),
    sharesOwnedAfter: Math.round(sharesAfter),
    // Hausse de la position en % (null si l'insider n'avait rien avant)
    positionIncreasePct: sharesAfter > shares ? Math.round((shares / (sharesAfter - shares)) * 100) : null,
    secUrl: `https://www.sec.gov/Archives/edgar/data/${cik}/${accession.replace(/-/g, "")}/${accession}-index.htm`,
  };
}

async function mapPool(items, n, fn) {
  const out = [];
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => {
    while (i < items.length) {
      const item = items[i++];
      try { out.push(await fn(item)); } catch (e) { console.error(`! ${e.message}`); }
      await new Promise(r => setTimeout(r, 120));
    }
  }));
  return out;
}

const date = dateArg || previousUsBusinessDay();
const filings = await listForm4Filings(date);
console.error(`${filings.length} Form 4 déposés le ${date}`);

const parsed = (await mapPool(filings, CONCURRENCY,
  async p => parseForm4(await secFetch(`https://www.sec.gov/Archives/${p}`), p))).filter(Boolean);

// Fusionne plusieurs dépôts d'un même insider sur la même société
const merged = new Map();
for (const b of parsed) {
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
  .map(b => ({ ...b, clusterSize: insidersPerTicker[b.ticker] }))
  .sort((a, b) => b.valueUsd - a.valueUsd)
  .slice(0, TOP);

const result = { filingDate: date, form4Count: filings.length, purchasesFound: merged.size, top };
await mkdir(`out/${date}`, { recursive: true });
await writeFile(`out/${date}/buys.json`, JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
