export type LevelKey = "A1" | "A2" | "B1";
export type PhaseKey = "fase1" | "fase2" | "fase3";

export interface PhaseContent {
  title?: string;
  bullets: string[];
  examples?: string[];
  weight?: 1 | 2 | 3;
  progress?: number; // optioneel voor leerlingvolgsysteem
}

export interface GoalPhaseMap {
  [level: string]: {
    [phase: string]: PhaseContent;
  };
}

export interface Goal {
  id: string;
  domain: string; // verwijst naar bv. "naamwoorden"
  name: string;   // bv. "Lidwoord"
}

export interface Domain {
  id: string;
  name: string;
  icon?: string;
}
