import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type LevelKey = "A1" | "A2" | "B1";
export type PhaseKey = "fase1" | "fase2" | "fase3";

export interface DomainRow {
  id: string;
  name: string;
  sort_order: number;
}

export interface GoalRow {
  id: string;
  domain_id: string;
  name: string;
  sort_order: number;
}

export interface PhaseContentRow {
  id: string;
  goal_id: string;
  level: LevelKey;
  phase: PhaseKey;
  title: string | null;
  bullets: string[];
  examples: string[];
  weight: number | null;
}

export const useGrammarData = () => {
  return useQuery({
    queryKey: ["grammar-data"],
    queryFn: async () => {
      const [domainsRes, goalsRes, phasesRes] = await Promise.all([
        supabase.from("domains").select("*").order("sort_order"),
        supabase.from("goals").select("*").order("sort_order"),
        supabase.from("phase_content").select("*"),
      ]);
      if (domainsRes.error) throw domainsRes.error;
      if (goalsRes.error) throw goalsRes.error;
      if (phasesRes.error) throw phasesRes.error;

      const phasesByKey = new Map<string, PhaseContentRow>();
      (phasesRes.data ?? []).forEach((p: any) => {
        phasesByKey.set(`${p.goal_id}|${p.level}|${p.phase}`, {
          ...p,
          bullets: Array.isArray(p.bullets) ? p.bullets : [],
          examples: Array.isArray(p.examples) ? p.examples : [],
        });
      });

      return {
        domains: (domainsRes.data ?? []) as DomainRow[],
        goals: (goalsRes.data ?? []) as GoalRow[],
        phases: phasesByKey,
      };
    },
  });
};
