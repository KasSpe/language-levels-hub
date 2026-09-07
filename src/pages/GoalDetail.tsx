import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Pencil, Save, X, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useGrammarData, type LevelKey, type PhaseKey } from "@/hooks/useGrammarData";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getPhaseLabel, levels } from "@/data/phaseLabels";
import { GoalNavSidebar } from "@/components/GoalNavSidebar";

type Detail = {
  goal_id: string;
  level: LevelKey;
  explanation: string;
  examples: string[];
  exercises: string[];
  explicit_contexts: string[];
  implicit_contexts: string[];
};

const phaseKeys: PhaseKey[] = ["fase1", "fase2", "fase3"];

const asArr = (v: unknown): string[] => (Array.isArray(v) ? (v as string[]) : []);

const emptyDetail = (goalId: string, level: LevelKey): Detail => ({
  goal_id: goalId,
  level,
  explanation: "",
  examples: [],
  exercises: [],
  explicit_contexts: [],
  implicit_contexts: [],
});

const GoalDetail = () => {
  const { goalId } = useParams<{ goalId: string }>();
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const { data: grammar } = useGrammarData();

  const goal = grammar?.goals.find((g) => g.id === goalId);
  const domain = goal && grammar?.domains.find((d) => d.id === goal.domain_id);

  const { data: details, isLoading } = useQuery({
    queryKey: ["goal-details", goalId],
    enabled: !!goalId,
    queryFn: async (): Promise<Record<string, Detail>> => {
      const { data, error } = await supabase
        .from("goal_level_detail")
        .select("*")
        .eq("goal_id", goalId!);
      if (error) throw error;
      const map: Record<string, Detail> = {};
      levels.forEach((lvl) => (map[lvl] = emptyDetail(goalId!, lvl)));
      (data ?? []).forEach((row: any) => {
        map[row.level] = {
          goal_id: goalId!,
          level: row.level,
          explanation: row.explanation ?? "",
          examples: asArr(row.examples),
          exercises: asArr(row.exercises),
          explicit_contexts: asArr(row.explicit_contexts),
          implicit_contexts: asArr(row.implicit_contexts),
        };
      });
      return map;
    },
  });

  const [editingLevel, setEditingLevel] = useState<LevelKey | null>(null);
  const [draft, setDraft] = useState<Detail | null>(null);

  const save = useMutation({
    mutationFn: async (d: Detail) => {
      const { error } = await supabase
        .from("goal_level_detail")
        .upsert(d, { onConflict: "goal_id,level" });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Opgeslagen");
      queryClient.invalidateQueries({ queryKey: ["goal-details", goalId] });
      setEditingLevel(null);
      setDraft(null);
    },
    onError: (e: any) => toast.error(e.message ?? "Fout bij opslaan"),
  });

  if (isLoading || !grammar) return <div className="p-8 text-muted-foreground">Laden…</div>;
  if (!goal)
    return (
      <div className="p-8">
        Doel niet gevonden. <Link to="/" className="text-primary underline">Terug</Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
        <GoalNavSidebar className="order-2 lg:order-1" />

        <div className="order-1 lg:order-2">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" /> Terug naar overzicht
          </Link>

          <div className="mb-8">
            <div className="text-sm text-muted-foreground">{domain?.name}</div>
            <h1 className="text-3xl font-bold text-foreground">{goal.name}</h1>
            <p className="text-muted-foreground mt-1">Uitleg, contexten, voorbeelden en oefeningen per niveau.</p>
          </div>

        <nav className="sticky top-0 z-10 bg-background flex flex-wrap gap-2 mb-8 py-2 border-b border-border">
          {levels.map((lvl) => (
            <a
              key={lvl}
              href={`#niveau-${lvl}`}
              className="px-3 py-1 rounded-md border border-border text-sm hover:bg-muted transition-colors"
            >
              {lvl}
            </a>
          ))}
        </nav>

        {levels.map((lvl) => {
          const detail = details?.[lvl] ?? emptyDetail(goalId!, lvl);
          const isEditing = editingLevel === lvl;
          const d = isEditing ? draft! : detail;
          const phasesForLevel = phaseKeys
            .map((key) => ({ key, label: getPhaseLabel(key, lvl), row: grammar.phases.get(`${goalId}|${lvl}|${key}`) }))
            .filter((p) => p.row && (p.row.title || p.row.bullets.length > 0));

          return (
            <section key={lvl} id={`niveau-${lvl}`} className="mb-12 scroll-mt-24">
              <div className="flex items-center justify-between border-b border-border pb-2 mb-5">
                <h2 className="text-xl font-bold">
                  <span className="inline-block px-2 py-0.5 rounded bg-primary text-primary-foreground text-sm font-medium mr-2">
                    {lvl}
                  </span>
                </h2>
                {isAdmin && !isEditing && (
                  <Button variant="outline" size="sm" onClick={() => { setDraft(detail); setEditingLevel(lvl); }}>
                    <Pencil className="h-4 w-4 mr-1" /> Bewerken
                  </Button>
                )}
                {isAdmin && isEditing && (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => save.mutate(draft!)} disabled={save.isPending}>
                      <Save className="h-4 w-4 mr-1" /> Opslaan
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => { setEditingLevel(null); setDraft(null); }}>
                      <X className="h-4 w-4 mr-1" /> Annuleren
                    </Button>
                  </div>
                )}
              </div>

              {phasesForLevel.length > 0 && (
                <div className="mb-6 border border-border rounded-lg p-5 bg-muted/20">
                  <h3 className="font-semibold mb-3">Fases voor {lvl}</h3>
                  <div className="space-y-4">
                    {phasesForLevel.map((p) => (
                      <div key={p.key}>
                        <div className="font-medium">{p.label}</div>
                        {p.row?.title && p.row.title !== "—" && (
                          <div className="italic text-muted-foreground">{p.row.title}</div>
                        )}
                        {p.row && p.row.bullets.length > 0 && (
                          <ul className="list-disc pl-5 text-sm text-muted-foreground mt-1">
                            {p.row.bullets.map((b, i) => <li key={i}>{b}</li>)}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">Uitgebreide uitleg</h3>
                {isEditing ? (
                  <Textarea
                    rows={8}
                    value={d.explanation}
                    onChange={(e) => setDraft({ ...draft!, explanation: e.target.value })}
                    placeholder="Schrijf hier de uitgebreide uitleg…"
                  />
                ) : d.explanation ? (
                  <div className="whitespace-pre-wrap text-foreground leading-relaxed">{d.explanation}</div>
                ) : (
                  <div className="text-muted-foreground italic">Nog geen uitleg toegevoegd.</div>
                )}
              </div>

              <ListSection
                title="Contexten – expliciete grammaticalessen"
                items={d.explicit_contexts}
                editing={isEditing}
                onChange={(items) => setDraft({ ...draft!, explicit_contexts: items })}
              />
              <ListSection
                title="Contexten – impliciet in andere lessen"
                items={d.implicit_contexts}
                editing={isEditing}
                onChange={(items) => setDraft({ ...draft!, implicit_contexts: items })}
              />
              <ListSection
                title="Voorbeelden"
                items={d.examples}
                editing={isEditing}
                onChange={(items) => setDraft({ ...draft!, examples: items })}
              />
              <ListSection
                title="Oefeningen"
                items={d.exercises}
                editing={isEditing}
                onChange={(items) => setDraft({ ...draft!, exercises: items })}
              />
            </section>
          );
        })}
        </div>
      </div>
    </div>
  );
};

const ListSection = ({
  title,
  items,
  editing,
  onChange,
}: {
  title: string;
  items: string[];
  editing: boolean;
  onChange: (items: string[]) => void;
}) => (
  <div className="mb-6">
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    {editing ? (
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={it}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                onChange(next);
              }}
            />
            <Button variant="ghost" size="icon" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => onChange([...items, ""])}>
          <Plus className="h-4 w-4 mr-1" /> Toevoegen
        </Button>
      </div>
    ) : items.length > 0 ? (
      <ul className="list-disc pl-5 text-foreground space-y-1">
        {items.map((it, i) => <li key={i}>{it}</li>)}
      </ul>
    ) : (
      <div className="text-muted-foreground italic">Nog geen {title.toLowerCase()} toegevoegd.</div>
    )}
  </div>
);

export default GoalDetail;
