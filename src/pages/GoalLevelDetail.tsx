import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { ArrowLeft, Pencil, Save, X, Plus, Trash2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useGrammarData, type LevelKey, type PhaseKey } from "@/hooks/useGrammarData";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getPhaseLabel } from "@/data/phaseLabels";
import { GoalNavSidebar } from "@/components/GoalNavSidebar";
import { HighlightText, matchesTokens, useSearchTokens } from "@/components/SearchHighlight";

type Detail = {
  id?: string;
  goal_id: string;
  level: LevelKey;
  explanation: string | null;
  examples: string[];
  exercises: string[];
  explicit_contexts: string[];
  implicit_contexts: string[];
};

const phaseKeys: PhaseKey[] = ["fase1", "fase2", "fase3"];

const GoalLevelDetail = () => {
  const { goalId, level } = useParams<{ goalId: string; level: LevelKey }>();
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const { data: grammar } = useGrammarData();

  const goal = grammar?.goals.find((g) => g.id === goalId);
  const domain = goal && grammar?.domains.find((d) => d.id === goal.domain_id);

  const { data: detail, isLoading } = useQuery({
    queryKey: ["goal-level-detail", goalId, level],
    enabled: !!goalId && !!level,
    queryFn: async (): Promise<Detail> => {
      const { data, error } = await supabase
        .from("goal_level_detail")
        .select("*")
        .eq("goal_id", goalId!)
        .eq("level", level!)
        .maybeSingle();
      if (error) throw error;
      return {
        id: data?.id,
        goal_id: goalId!,
        level: level as LevelKey,
        explanation: data?.explanation ?? "",
        examples: Array.isArray(data?.examples) ? (data!.examples as string[]) : [],
        exercises: Array.isArray(data?.exercises) ? (data!.exercises as string[]) : [],
        explicit_contexts: Array.isArray((data as any)?.explicit_contexts) ? ((data as any).explicit_contexts as string[]) : [],
        implicit_contexts: Array.isArray((data as any)?.implicit_contexts) ? ((data as any).implicit_contexts as string[]) : [],
      };
    },
  });

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Detail | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const searchTokens = useSearchTokens(searchQuery);
  useEffect(() => {
    if (detail && !editing) setDraft(detail);
  }, [detail, editing]);

  const save = useMutation({
    mutationFn: async (d: Detail) => {
      const payload = {
        goal_id: d.goal_id,
        level: d.level,
        explanation: d.explanation,
        examples: d.examples,
        exercises: d.exercises,
        explicit_contexts: d.explicit_contexts,
        implicit_contexts: d.implicit_contexts,
      };
      const { error } = await supabase
        .from("goal_level_detail")
        .upsert(payload, { onConflict: "goal_id,level" });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Opgeslagen");
      queryClient.invalidateQueries({ queryKey: ["goal-level-detail", goalId, level] });
      setEditing(false);
    },
    onError: (e: any) => toast.error(e.message ?? "Fout bij opslaan"),
  });

  if (isLoading || !grammar) return <div className="p-8 text-muted-foreground">Laden…</div>;
  if (!goal) return <div className="p-8">Doel niet gevonden. <Link to="/" className="text-primary underline">Terug</Link></div>;

  const phasesForLevel = phaseKeys
    .map((key) => ({ key, label: getPhaseLabel(key, level as LevelKey), row: grammar.phases.get(`${goalId}|${level}|${key}`) }))
    .filter((p) => p.row && (p.row.title || p.row.bullets.length > 0));

  const d = editing ? draft! : detail!;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6 lg:gap-8">
        <GoalNavSidebar className="order-2 lg:order-1" />

        <div className="order-1 lg:order-2">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" /> Terug naar overzicht
          </Link>

          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-sm text-muted-foreground">{domain?.name}</div>
              <h1 className="text-3xl font-bold text-foreground">{goal.name}</h1>
              <div className="mt-1 inline-block px-2 py-0.5 rounded bg-primary text-primary-foreground text-sm font-medium">{level}</div>
            </div>
          {isAdmin && !editing && (
            <Button variant="outline" size="sm" onClick={() => { setDraft(detail!); setEditing(true); }}>
              <Pencil className="h-4 w-4 mr-1" /> Bewerken
            </Button>
          )}
          {isAdmin && editing && (
            <div className="flex gap-2">
              <Button size="sm" onClick={() => save.mutate(draft!)} disabled={save.isPending}>
                <Save className="h-4 w-4 mr-1" /> Opslaan
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setEditing(false); setDraft(detail!); }}>
                <X className="h-4 w-4 mr-1" /> Annuleren
              </Button>
            </div>
          )}
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Zoek in uitleg, contexten, voorbeelden en oefeningen…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Fases overzicht */}
        {phasesForLevel.length > 0 && (
          <section className="mb-8 border border-border rounded-lg p-5 bg-muted/20">
            <h2 className="font-semibold mb-3">Fases voor {level}</h2>
            <div className="space-y-4">
              {phasesForLevel.map((p) => (
                <div key={p.key}>
                  <div className="font-medium">
                    <HighlightText text={p.label} tokens={searchTokens} />
                  </div>
                  {p.row?.title && p.row.title !== "—" && (
                    <div className="italic text-muted-foreground">
                      <HighlightText text={p.row.title} tokens={searchTokens} />
                    </div>
                  )}
                  {p.row && p.row.bullets.length > 0 && (
                    <ul className="list-disc pl-5 text-sm text-muted-foreground mt-1">
                      {p.row.bullets.map((b, i) => (
                        <li key={i}>
                          <HighlightText text={b} tokens={searchTokens} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Uitleg */}
        <section className="mb-8">
          <h2 className="font-semibold text-lg mb-2">Uitgebreide uitleg</h2>
          {editing ? (
            <Textarea
              rows={8}
              value={d?.explanation ?? ""}
              onChange={(e) => setDraft({ ...draft!, explanation: e.target.value })}
              placeholder="Schrijf hier de uitgebreide uitleg…"
            />
          ) : d?.explanation ? (
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">
              <HighlightText text={d.explanation} tokens={searchTokens} />
            </div>
          ) : (
            <div className="text-muted-foreground italic">Nog geen uitleg toegevoegd.</div>
          )}
        </section>

        {/* Relevante contexten */}
        <ListSection
          title="Contexten – expliciete grammaticalessen"
          items={d?.explicit_contexts ?? []}
          editing={editing}
          onChange={(items) => setDraft({ ...draft!, explicit_contexts: items })}
        />
        <ListSection
          title="Contexten – impliciet in andere lessen"
          items={d?.implicit_contexts ?? []}
          editing={editing}
          onChange={(items) => setDraft({ ...draft!, implicit_contexts: items })}
        />

        {/* Voorbeelden */}
        <ListSection
          title="Voorbeelden"
          items={d?.examples ?? []}
          editing={editing}
          onChange={(items) => setDraft({ ...draft!, examples: items })}
        />

        {/* Oefeningen */}
        <ListSection
          title="Oefeningen"
          items={d?.exercises ?? []}
          editing={editing}
          onChange={(items) => setDraft({ ...draft!, exercises: items })}
        />
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
  <section className="mb-8">
    <h2 className="font-semibold text-lg mb-2">{title}</h2>
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
  </section>
);

export default GoalLevelDetail;
