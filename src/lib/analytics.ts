// Pure, dependency-free text analytics — safe to import in client components.

export function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export function readingTime(text: string): number {
  return Math.max(1, Math.round(wordCount(text) / 200));
}

function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  const groups = w.match(/[aeiouy]+/g);
  let n = groups ? groups.length : 1;
  if (w.endsWith("e") && n > 1) n--;
  return Math.max(1, n);
}

/** Flesch reading ease, clamped to 0–100. Higher = easier to read. */
export function readabilityScore(text: string): number {
  const sentences = Math.max(
    text.split(/[.!?]+/).filter((s) => s.trim()).length,
    1,
  );
  const words = text.split(/\s+/).filter(Boolean);
  const wc = Math.max(words.length, 1);
  const syllables = words.reduce((acc, w) => acc + countSyllables(w), 0);
  const score = 206.835 - 1.015 * (wc / sentences) - 84.6 * (syllables / wc);
  return Math.round(Math.min(100, Math.max(0, score)));
}

export function readabilityLabel(score: number): string {
  if (score >= 70) return "Very easy";
  if (score >= 60) return "Easy";
  if (score >= 50) return "Fairly readable";
  if (score >= 30) return "Challenging";
  return "Difficult";
}

const POSITIVE = ["win","grow","great","best","boost","love","easy","save","results","success","improve","smart","powerful","fast","clear"];
const NEGATIVE = ["problem","fail","hard","waste","cost","struggle","risk","pain","slow","burnout","stuck","confusing"];

export function sentimentLabel(text: string): string {
  const t = text.toLowerCase();
  let score = 0;
  POSITIVE.forEach((w) => { if (t.includes(w)) score++; });
  NEGATIVE.forEach((w) => { if (t.includes(w)) score--; });
  if (score > 2) return "Positive";
  if (score < -1) return "Cautious";
  return "Neutral";
}

/** Heuristic brand-aware suggestions for the editor side panel. */
export function buildSuggestions(
  text: string,
  wordsToAvoid?: string | null,
): string[] {
  const tips: string[] = [];
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim());
  const longOnes = sentences.filter((s) => wordCount(s) > 28).length;
  if (longOnes > 0)
    tips.push(
      `${longOnes} sentence${longOnes > 1 ? "s are" : " is"} over 28 words — consider splitting for readability.`,
    );

  const avoid = (wordsToAvoid || "")
    .split(/[,\n]/)
    .map((w) => w.trim().toLowerCase())
    .filter(Boolean);
  const hits = avoid.filter((w) => text.toLowerCase().includes(w));
  if (hits.length)
    tips.push(`Off-brand wording detected: "${hits.join('", "')}". Swap these out.`);

  if (!/\?(\s|$)/.test(text))
    tips.push("No questions found — a rhetorical question can lift engagement.");

  const cta = /(sign up|get started|learn more|try|download|book|subscribe|reply)/i;
  if (!cta.test(text))
    tips.push("Consider adding a clear call-to-action near the end.");

  const passive = /\b(was|were|been|is|are)\s+\w+ed\b/gi;
  const passiveCount = (text.match(passive) || []).length;
  if (passiveCount > 2)
    tips.push(`${passiveCount} possible passive-voice phrases — active voice reads stronger.`);

  if (tips.length === 0)
    tips.push("Looking sharp! This draft is on-brand and readable. ✨");
  return tips;
}
