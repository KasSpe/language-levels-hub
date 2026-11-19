import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { LevelKey } from "@/hooks/useGrammarData";

export type GoalDetailRow = {
  goal_id: string;
  level: LevelKey;
  explanation: string;
  examples: string[];
  exercises: string[];
  explicit_contexts: string[];
  implicit_contexts: string[];
};

const asArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

export const emptyGoalDetail = (goalId: string, level: LevelKey): GoalDetailRow => ({
  goal_id: goalId,
  level,
  explanation: "",
  examples: [],
  exercises: [],
  explicit_contexts: [],
  implicit_contexts: [],
});

export async function fetchGoalDetails(
  supabase: SupabaseClient<Database>,
  goalId: string,
): Promise<Record<LevelKey, GoalDetailRow>> {
  const { data, error } = await supabase
    .from("goal_level_detail")
    .select("*")
    .eq("goal_id", goalId);

  if (error) throw error;

  const levels: LevelKey[] = ["ALFA", "A1", "A2", "B1"];
  const result = Object.fromEntries(
    levels.map((level) => [level, emptyGoalDetail(goalId, level)]),
  ) as Record<LevelKey, GoalDetailRow>;

  for (const row of data ?? []) {
    const level = row.level as LevelKey;
    if (!levels.includes(level)) continue;
    result[level] = {
      goal_id: goalId,
      level,
      explanation: row.explanation ?? "",
      examples: asArray(row.examples),
      exercises: asArray(row.exercises),
      explicit_contexts: asArray(row.explicit_contexts),
      implicit_contexts: asArray(row.implicit_contexts),
    };
  }

  return result;
}

export async function fetchGoalLevelDetail(
  supabase: SupabaseClient<Database>,
  goalId: string,
  level: LevelKey,
): Promise<GoalDetailRow> {
  const { data, error } = await supabase
    .from("goal_level_detail")
    .select("*")
    .eq("goal_id", goalId)
    .eq("level", level)
    .maybeSingle();

  if (error) throw error;

  return {
    goal_id: goalId,
    level,
    explanation: data?.explanation ?? "",
    examples: asArray(data?.examples),
    exercises: asArray(data?.exercises),
    explicit_contexts: asArray(data?.explicit_contexts),
    implicit_contexts: asArray(data?.implicit_contexts),
  };
}
