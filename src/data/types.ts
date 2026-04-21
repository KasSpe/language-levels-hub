export type LevelKey = "A1" | "A2" | "B1";
export type PhaseKey = "fase1" | "fase2" | "fase3";

export interface PhaseContent {
  title?: string;
  bullets: string[];
  examples?: string[];
  weight?: 1 | 2 | 3;
  progress?: number; // optioneel voor leerlingvolgsysteem
}

export interface LevelPhases {
  fase1?: PhaseContent;
  fase2?: PhaseContent;
  fase3?: PhaseContent;
}

export interface GoalPhaseMap {
  [goalId: string]: {
    [level: string]: LevelPhases;
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
