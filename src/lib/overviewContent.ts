type PhaseText = {
  title?: string | null;
  bullets?: string[] | null;
};

/**
 * Haalt plannings- en aanbiedingslabels uit de overzichtstabellen.
 * De oorspronkelijke gegevens blijven behouden voor beheer en detailpagina's.
 */
export const cleanOverviewText = (text: string): string => {
  const cleaned = text
    .replace(/komt\s+impliciet\s+voor/gi, "komt voor")
    .replace(/[\u{1F300}-\u{1FAFF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}\uFE0F]/gu, " ")
    .replace(
      /\b(?:start|verdieping|inoefening|expliciet|impliciet)\b(?:\s*·\s*\b(?:start|verdieping|inoefening|expliciet|impliciet)\b)*/gi,
      " · ",
    )
    .replace(/\s*:\s*·\s*[–—-]\s*/g, " – ")
    .replace(/\s*:\s*·\s*/g, " · ")
    .replace(/\s*·\s*[–—-]\s*/g, " – ")
    .replace(/\s*[–—-]\s*·\s*/g, " · ")
    .replace(/(?:\s*·\s*){2,}/g, " · ")
    .replace(/\s+([,:;])/g, "$1")
    .replace(/[ \t]+/g, " ")
    .replace(/^[·:;,\s–—-]+|[·:;,\s–—-]+$/g, "")
    .trim();

  return cleaned === "—" ? "" : cleaned;
};

export const getOverviewPhaseContent = (phase?: PhaseText) => {
  const title = phase?.title ? cleanOverviewText(phase.title) : "";
  const bullets = (phase?.bullets ?? [])
    .map(cleanOverviewText)
    .filter(Boolean);

  return {
    title,
    bullets,
    hasContent: Boolean(title || bullets.length),
  };
};
