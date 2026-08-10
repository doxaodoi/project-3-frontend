export interface MatchFactor {
  label: string;
  /** 0-100 strength of this signal. */
  value: number;
  tone: "good" | "warn";
}

export interface MatchCandidate {
  /** Found-item id this match points to (for linking). */
  foundItemId: string;
  title: string;
  meta: string;
  gradient: [string, string];
  /** Overall match score, 0-100. */
  score: number;
  /** Smart Match Explainer text (cached AI output). */
  explanation: string;
  factors: MatchFactor[];
}

/** Score → text colour token for the big percentage. */
export function scoreTone(score: number): string {
  if (score >= 80) return "text-found";
  if (score >= 50) return "text-[#a08a3a]";
  return "text-faint";
}
