import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, Pencil, ExternalLink } from "lucide-react";
import { useGrammarData, type LevelKey, type PhaseKey, type PhaseContentRow } from "@/hooks/useGrammarData";
import { getPhaseLabel, levels as allLevels } from "@/data/phaseLabels";
import PhaseEditDialog from "./PhaseEditDialog";

interface Props {
  editable?: boolean;
}

type ActiveColumn = LevelKey | null;
const columns: LevelKey[] = allLevels;
const phaseKeys: PhaseKey[] = ["fase1", "fase2", "fase3"];

const PhaseList = ({
  goalId,
  goalName,
  level,
  phasesMap,
  editable,
  horizontal = false,
}: {
  goalId: string;
  goalName: string;
  level: LevelKey;
  phasesMap: Map<string, PhaseContentRow>;
  editable: boolean;
  horizontal?: boolean;
}) => {
  const [editing, setEditing] = useState<PhaseKey | null>(null);
  const current = editing ? phasesMap.get(`${goalId}|${level}|${editing}`) : undefined;

  return (
    <div className={horizontal ? "grid grid-cols-3 gap-3 text-sm" : "flex flex-col gap-2 text-sm"}>
      {phaseKeys.map((pk) => {
        const p = { key: pk, label: getPhaseLabel(pk, level) };
        const row = phasesMap.get(`${goalId}|${level}|${p.key}`);
        const hasContent = row && (row.title || row.bullets.length > 0);
        return (
          <div key={p.key} className="group">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <div className="font-medium text-foreground">{p.label}</div>
                {row?.title && row.title !== "—" && (
                  <div className="text-muted-foreground italic">{row.title}</div>
                )}
                {row && row.bullets.length > 0 && (
                  <ul className="list-disc pl-5 text-muted-foreground mt-1">
                    {row.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
                {!hasContent && !editable && (
                  <div className="text-muted-foreground/60">—</div>
                )}
              </div>
              {editable && (
                <button
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-muted transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditing(p.key);
                  }}
                  aria-label="Bewerken"
                >
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
        );
      })}
      {editable && editing && (
        <PhaseEditDialog
          open={!!editing}
          onOpenChange={(o) => !o && setEditing(null)}
          goalId={goalId}
          goalName={goalName}
          level={level}
          phase={editing}
          existing={current}
        />
      )}
    </div>
  );
};

const GrammarTable = ({ editable = false }: Props) => {
  const { data, isLoading, error } = useGrammarData();
  const [openDomains, setOpenDomains] = useState<string[]>([]);
  const [activeColumn, setActiveColumn] = useState<ActiveColumn>(null);

  if (isLoading) return <div className="text-muted-foreground">Laden…</div>;
  if (error) return <div className="text-destructive">Fout bij laden van data.</div>;
  if (!data) return null;

  const { domains, goals, phases: phasesMap } = data;
  const [highlightedGoal, setHighlightedGoal] = useState<string | null>(null);

  const toggleDomain = (id: string) => {
    setOpenDomains((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const openGoal = (domainId: string, goalId: string) => {
    setOpenDomains((prev) => (prev.includes(domainId) ? prev : [...prev, domainId]));
    setHighlightedGoal(goalId);
    // Wacht tot de rij gerenderd is, scroll er dan heen
    setTimeout(() => {
      document.getElementById(`goal-${goalId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
    setTimeout(() => setHighlightedGoal((prev) => (prev === goalId ? null : prev)), 2000);
  };

  const handleColumnClick = (col: ActiveColumn) => {
    setActiveColumn((prev) => (prev === col ? null : col));
  };

  const isZoomed = activeColumn !== null;
  const getGridCols = () => (isZoomed ? "grid-cols-[2fr_3fr]" : "grid-cols-[1.5fr_1fr_1fr_1fr_1fr]");

  const allOpen = openDomains.length === domains.length;

  const toggleAll = () => {
    if (allOpen) {
      setOpenDomains([]);
    } else {
      setOpenDomains(domains.map((d) => d.id));
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button
          onClick={toggleAll}
          className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border border-border hover:bg-muted transition-colors"
        >
          {allOpen ? (
            <>
              <ChevronDown className="h-4 w-4" /> Alles dichtklappen
            </>
          ) : (
            <>
              <ChevronRight className="h-4 w-4" /> Alles openklappen
            </>
          )}
        </button>
      </div>
      <div className="border border-border rounded-lg overflow-hidden">
        {/* Header */}
        <div className={`grid ${getGridCols()} gap-0 transition-all`}>
          <div className="bg-primary text-primary-foreground font-semibold p-4 border-r border-primary-foreground/20">
            Grammaticaal doel
          </div>
          {isZoomed ? (
            <div
              className="bg-primary text-primary-foreground font-semibold p-4 text-center cursor-pointer hover:bg-primary/80"
              onClick={() => handleColumnClick(activeColumn)}
            >
              {activeColumn} <span className="text-xs opacity-70 ml-2">(klik om terug te gaan)</span>
            </div>
          ) : (
            columns.map((col, i) => (
              <div
                key={col}
                className={`bg-primary text-primary-foreground font-semibold p-4 text-center cursor-pointer hover:bg-primary/80 ${
                  i < columns.length - 1 ? "border-r border-primary-foreground/20" : ""
                }`}
                onClick={() => handleColumnClick(col)}
              >
                {col}
              </div>
            ))
          )}
        </div>

        {/* Rows */}
        {domains.map((domain) => {
          const domainGoals = goals.filter((g) => g.domain_id === domain.id);
          const domainOpen = openDomains.includes(domain.id);
          return (
            <div key={domain.id}>
              {/* Domain row */}
              <div
                className={`grid ${getGridCols()} gap-0 border-t border-border cursor-pointer hover:bg-muted/50`}
                onClick={() => toggleDomain(domain.id)}
              >
                <div className="p-4 border-r border-border bg-muted/30 font-medium flex items-center gap-2">
                  {domainGoals.length > 0 ? (
                    domainOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  ) : null}
                  {domain.name}
                </div>
                {isZoomed ? (
                  <div className="p-4 text-sm text-muted-foreground">
                    {domainGoals.length > 0
                      ? domainGoals.map((g, i) => (
                          <span key={g.id}>
                            {i > 0 && " · "}
                            <button
                              className="hover:text-primary hover:underline underline-offset-2 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                openGoal(domain.id, g.id);
                              }}
                            >
                              {g.name}
                            </button>
                          </span>
                        ))
                      : "—"}
                  </div>
                ) : (
                  <div className="col-span-4 p-4 text-sm text-muted-foreground">
                    {domainGoals.length > 0
                      ? domainGoals.map((g, i) => (
                          <span key={g.id}>
                            {i > 0 && " · "}
                            <button
                              className="hover:text-primary hover:underline underline-offset-2 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                openGoal(domain.id, g.id);
                              }}
                            >
                              {g.name}
                            </button>
                          </span>
                        ))
                      : "—"}
                  </div>
                )}
              </div>

              {/* Goal rows: inhoud meteen zichtbaar, geen open/dichtklap */}
              {domainOpen &&
                domainGoals.map((goal) => (
                  <div
                    key={goal.id}
                    id={`goal-${goal.id}`}
                    className={`grid ${getGridCols()} gap-0 border-t border-border transition-colors ${
                      highlightedGoal === goal.id ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="p-3 pl-10 border-r border-border font-medium text-foreground bg-muted/10">
                      {goal.name}
                    </div>
                    {isZoomed ? (
                      <div className="p-3 space-y-3">
                        <PhaseList goalId={goal.id} goalName={goal.name} level={activeColumn!} phasesMap={phasesMap} editable={editable} horizontal />
                        <Link
                          to={`/doel/${goal.id}/${activeColumn}`}
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          Meer uitleg <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    ) : (
                      <>
                        {columns.map((lvl, i) => (
                          <div key={lvl} className={`p-3 space-y-3 ${i < columns.length - 1 ? "border-r border-border" : ""}`}>
                            <PhaseList goalId={goal.id} goalName={goal.name} level={lvl} phasesMap={phasesMap} editable={editable} />
                            <Link
                              to={`/doel/${goal.id}/${lvl}`}
                              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                            >
                              Meer uitleg <ExternalLink className="h-3 w-3" />
                            </Link>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GrammarTable;
