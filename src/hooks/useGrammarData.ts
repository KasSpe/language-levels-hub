import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type LevelKey = "ALFA" | "A1" | "A2" | "B1";
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

export interface OfferingContextRow {
  goal_id: string;
  level: LevelKey;
  explicit_contexts: string[];
  implicit_contexts: string[];
}

export const useGrammarData = () => {
  return useQuery({
    queryKey: ["grammar-data"],
    queryFn: async () => {
      const [domainsRes, goalsRes, phasesRes, detailsRes] = await Promise.all([
        supabase.from("domains").select("*").order("sort_order"),
        supabase.from("goals").select("*").order("sort_order"),
        supabase.from("phase_content").select("*"),
        supabase.from("goal_level_detail").select("goal_id, level, explicit_contexts, implicit_contexts"),
      ]);
      if (domainsRes.error) throw domainsRes.error;
      if (goalsRes.error) throw goalsRes.error;
      if (phasesRes.error) throw phasesRes.error;
      if (detailsRes.error) throw detailsRes.error;

      const phasesByKey = new Map<string, PhaseContentRow>();
      (phasesRes.data ?? []).forEach((p: any) => {
        phasesByKey.set(`${p.goal_id}|${p.level}|${p.phase}`, {
          ...p,
          bullets: Array.isArray(p.bullets) ? p.bullets : [],
          examples: Array.isArray(p.examples) ? p.examples : [],
        });
      });

      const offeringsByKey = new Map<string, OfferingContextRow>();
      (detailsRes.data ?? []).forEach((d: any) => {
        offeringsByKey.set(`${d.goal_id}|${d.level}`, {
          goal_id: d.goal_id,
          level: d.level,
          explicit_contexts: Array.isArray(d.explicit_contexts) ? d.explicit_contexts : [],
          implicit_contexts: Array.isArray(d.implicit_contexts) ? d.implicit_contexts : [],
        });
      });

      return {
        domains: (domainsRes.data ?? []) as DomainRow[],
        goals: (goalsRes.data ?? []) as GoalRow[],
        phases: phasesByKey,
        offerings: offeringsByKey,
      };
    },
  });
};
