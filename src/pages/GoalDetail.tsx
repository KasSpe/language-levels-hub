import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowLeft, Pencil, Save, X, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useGrammarData, type LevelKey, type PhaseKey } from "@/hooks/useGrammarData";
import { fetchGoalDetails, type GoalDetailRow } from "@/lib/goalQueries";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getPhaseLabel, levels } from "@/data/phaseLabels";
import { GoalNavSidebar } from "@/components/GoalNavSidebar";
import { HighlightText, matchesTokens, useSearchTokens } from "@/components/SearchHighlight";
import { SearchSuggestInput } from "@/components/SearchSuggestInput";

const phaseKeys: PhaseKey[] = ["fase1", "fase2", "fase3"];

const GoalDetail = () => {
  const { goalId } = useParams<{ goalId: string }>();
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const grammarQuery = useGrammarData();
  const grammar = grammarQuery.data;

  const goal = grammar?.goals.find((item) => item.id === goalId);
  const domain = goal && grammar?.domains.find((item) => item.id === goal.domain_id);

  const detailQuery = useQuery({
    queryKey: ["goal-details", goalId],
    enabled: !!goalId,
    queryFn: () => fetchGoalDetails(supabase, goalId!),
  });

  const [editingLevel, setEditingLevel] = useState<LevelKey | null>(null);
  const [draft, setDraft] = useState<GoalDetailRow | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const searchTokens = useSearchTokens(searchQuery);

  const searchCorpus = useMemo(() => {
    const texts: string[] = [];
    if (detailQuery.data) {
      Object.values(detailQuery.data).forEach((detail) => {
        texts.push(detail.explanation, ...detail.examples, ...detail.exercises, ...detail.explicit_contexts, ...detail.implicit_contexts);
      });
    }
    if (grammar && goalId) {
      levels.forEach((level) => phaseKeys.forEach((phase) => {
        const row = grammar.phases.get(`${goalId}|${level}|${phase}`);
        if (row) texts.push(row.title ?? "", ...row.bullets);
      }));
    }
    return texts;
  }, [detailQuery.data, grammar, goalId]);

  const save = useMutation({
    mutationFn: async (detail: GoalDetailRow) => {
      const { error } = await supabase
        .from("goal_level_detail")
        .upsert(detail, { onConflict: "goal_id,level" });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Opgeslagen");
      queryClient.invalidateQueries({ queryKey: ["goal-details", goalId] });
      setEditingLevel(null);
      setDraft(null);
    },
    onError: (error: unknown) => toast.error(error instanceof Error ? error.message : "Fout bij opslaan"),
  });

  if (grammarQuery.isLoading || detailQuery.isLoading) {
    return <div className="p-8 text-muted-foreground" role="status">Gegevens laden…</div>;
  }

  if (grammarQuery.error) {
    return <div className="p-8 text-destructive" role="alert">De grammaticale gegevens konden niet worden geladen.</div>;
  }

  if (detailQuery.error) {
    return <div className="p-8 text-destructive" role="alert">De uitleg voor dit doel kon niet worden geladen.</div>;
  }

  if (!goal) {
    return (
      <div className="p-8">
        Doel niet gevonden. <Link to="/" className="text-primary underline">Terug</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6 lg:gap-8">
        <GoalNavSidebar className="order-2 lg:order-1" />
        <div className="order-1 lg:order-2">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" /> Terug naar overzicht
          </Link>
          <div className="mb-6">
            <div className="text-sm text-muted-foreground">{domain?.name}</div>
            <h1 className="text-3xl font-bold text-foreground">{goal.name}</h1>
            <p className="text-muted-foreground mt-1">Uitleg, contexten, voorbeelden en oefeningen per niveau.</p>
          </div>
          <SearchSuggestInput value={searchQuery} onChange={setSearchQuery} corpus={searchCorpus} />

          <nav className="sticky top-0 z-10 bg-background flex flex-wrap gap-2 mb-8 py-2 border-b border-border">
            {levels.map((level) => (
              <a key={level} href={`#niveau-${level}`} className="px-3 py-1 rounded-md border border-border text-sm hover:bg-muted transition-colors">
                {level}
              </a>
            ))}
          </nav>

          {levels.map((level) => {
            const detail = detailQuery.data?.[level]!;
            const isEditing = editingLevel === level;
            const current = isEditing ? draft! : detail;
            const phasesForLevel = phaseKeys
              .map((phase) => ({
                phase,
                label: getPhaseLabel(phase, level),
                row: grammar.phases.get(`${goalId}|${level}|${phase}`),
              }))
              .filter((item) => item.row && (item.row.title || item.row.bullets.length > 0));

            return (
              <section key={level} id={`niveau-${level}`} className="mb-12 scroll-mt-24">
                <div className="flex items-center justify-between border-b border-border pb-2 mb-5">
                  <h2 className="text-xl font-bold">
                    <span className="inline-block px-2 py-0.5 rounded bg-primary text-primary-foreground text-sm font-medium mr-2">{level}</span>
                  </h2>
                  {isAdmin && !isEditing && (
                    <Button variant="outline" size="sm" onClick={() => { setDraft(detail); setEditingLevel(level); }}>
                      <Pencil className="h-4 w-4 mr-1" /> Bewerken
                    </Button>
                  )}
                  {isAdmin && isEditing && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => save.mutate(draft!)} disabled={save.isPending}><Save className="h-4 w-4 mr-1" /> Opslaan</Button>
                      <Button variant="ghost" size="sm" onClick={() => { setEditingLevel(null); setDraft(null); }}><X className="h-4 w-4 mr-1" /> Annuleren</Button>
                    </div>
                  )}
                </div>

                {phasesForLevel.length > 0 && (
                  <div className="mb-6 border border-border rounded-lg p-5 bg-muted/20">
                    <h3 className="font-semibold mb-3">Fases voor {level}</h3>
                    <div className="space-y-4">
                      {phasesForLevel.map((item) => (
                        <div key={item.phase}>
                          <div className="font-medium"><HighlightText text={item.label} tokens={searchTokens} /></div>
                          {item.row?.title && item.row.title !== "—" && <div className="italic text-muted-foreground"><HighlightText text={item.row.title} tokens={searchTokens} /></div>}
                          {item.row && item.row.bullets.length > 0 && (
                            <ul className="list-disc pl-5 text-sm text-muted-foreground mt-1">
                              {item.row.bullets.map((bullet, index) => <li key={index}><HighlightText text={bullet} tokens={searchTokens} /></li>)}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <ListSection title="Uitgebreide uitleg" items={current.explanation ? [current.explanation] : []} editing={isEditing} tokens={searchTokens}
                  onChange={(items) => setDraft({ ...draft!, explanation: items[0] ?? "" })} isText />
                <ListSection title="Contexten – expliciete grammaticalessen" items={current.explicit_contexts} editing={isEditing} tokens={searchTokens} onChange={(items) => setDraft({ ...draft!, explicit_contexts: items })} />
                <ListSection title="Contexten – impliciet in andere lessen" items={current.implicit_contexts} editing={isEditing} tokens={searchTokens} onChange={(items) => setDraft({ ...draft!, implicit_contexts: items })} />
                <ListSection title="Voorbeelden" items={current.examples} editing={isEditing} tokens={searchTokens} onChange={(items) => setDraft({ ...draft!, examples: items })} />
                <ListSection title="Oefeningen" items={current.exercises} editing={isEditing} tokens={searchTokens} onChange={(items) => setDraft({ ...draft!, exercises: items })} />
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ListSection = ({ title, items, editing, tokens, onChange, isText = false }: {
  title: string; items: string[]; editing: boolean; tokens: string[]; onChange: (items: string[]) => void; isText?: boolean;
}) => {
  const visibleItems = tokens.length > 0 && !editing ? items.filter((item) => matchesTokens(item, tokens)) : items;
  return (
    <div className="mb-6">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      {editing ? (
        isText ? <Textarea rows={8} value={items[0] ?? ""} onChange={(event) => onChange([event.target.value])} /> : (
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input value={item} onChange={(event) => { const next = [...items]; next[index] = event.target.value; onChange(next); }} />
                <Button variant="ghost" size="icon" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => onChange([...items, ""])}><Plus className="h-4 w-4 mr-1" /> Toevoegen</Button>
          </div>
        )
      ) : visibleItems.length > 0 ? (
        isText ? <div className="whitespace-pre-wrap text-foreground leading-relaxed">{visibleItems.map((item, index) => <HighlightText key={index} text={item} tokens={tokens} />)}</div> : (
          <ul className="list-disc pl-5 text-foreground space-y-1">
            {visibleItems.map((item, index) => <li key={index}><HighlightText text={item} tokens={tokens} /></li>)}
          </ul>
        )
      ) : <div className="text-muted-foreground italic">Nog geen {title.toLowerCase()} toegevoegd.</div>}
    </div>
  );
};

export default GoalDetail;
