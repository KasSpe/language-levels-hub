import type { LevelKey, PhaseKey } from "@/hooks/useGrammarData";

const nextLevel: Record<LevelKey, string> = {
  ALFA: "A1",
  A1: "A2",
  A2: "B1",
  B1: "B2",
};

export const getPhaseLabel = (phase: PhaseKey, level: LevelKey): string => {
  if (phase === "fase1") return "Fase 1 - Basis leggen";
  if (phase === "fase2") return "Fase 2 - Basis versterken/uitbreiden";
  return `Fase 3 - Overgang naar ${nextLevel[level] ?? "volgend niveau"}`;
};

export const levels: LevelKey[] = ["ALFA", "A1", "A2", "B1"];
