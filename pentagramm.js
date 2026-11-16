// pentagramm.js — bestOfAll: wählt aus einer Liste den Besten und sagt, WARUM.
// Regelkette, die erste Regel, die Platz 1 von Platz 2 trennt, ist der Grund:
//   1. höherer Score                    -> HIGHEST_SCORE
//   2. PRISMATIKUM vor allen anderen    -> PRISMATIKUM_TIEBREAK
//   3. Mirror näher an der Mitte 41     -> MIRROR_DISTANCE   (fehlender Mirror = unendlich weit weg)
//   4. Name alphabetisch                -> ALPHABETIC
// Sind auch Name und Mirror gleich, gewinnt der Erste der Eingabe (stabil) -> IDENTICAL.
const MITTE = 41;
const istPrisma = e => String(e.name).trim().toUpperCase() === "PRISMATIKUM";
const abstand = e => Number.isFinite(e.mirror) ? Math.abs(e.mirror - MITTE) : Infinity;
const REGELN = [
  ["HIGHEST_SCORE", (a, b) => b.score - a.score],
  ["PRISMATIKUM_TIEBREAK", (a, b) => Number(istPrisma(b)) - Number(istPrisma(a))],
  ["MIRROR_DISTANCE", (a, b) => (abstand(a) === abstand(b) ? 0 : abstand(a) < abstand(b) ? -1 : 1)],
  ["ALPHABETIC", (a, b) => String(a.name).localeCompare(String(b.name), "de")],
];
function bestOfAll(il) {
  const liste = Array.isArray(il) ? il : [];
  const gueltig = liste.filter(e => e && Number.isFinite(e.score) && e.name !== undefined && e.name !== null);
  const verworfen = liste.length - gueltig.length;
  if (!gueltig.length) return { beste: null, grund: "NO_CANDIDATES", verworfen };
  const rang = gueltig.map((e, i) => ({ e, i })).sort((x, y) => {
    for (const [, vergleich] of REGELN) { const c = vergleich(x.e, y.e); if (c) return c; }
    return x.i - y.i;
  }).map(x => x.e);
  let grund = gueltig.length === 1 ? "ONLY_CANDIDATE" : "IDENTICAL";
  if (rang.length > 1) for (const [name, vergleich] of REGELN) { if (vergleich(rang[0], rang[1])) { grund = name; break; } }
  return { beste: rang[0], grund, rang, verworfen };
}
if (typeof module !== "undefined") module.exports = { bestOfAll, MITTE };
