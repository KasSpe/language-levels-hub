import { useState } from "react";
import { ChevronDown, ChevronRight, Pencil } from "lucide-react";
import { useGrammarData, type LevelKey, type PhaseKey, type PhaseContentRow } from "@/hooks/useGrammarData";
import PhaseEditDialog from "./PhaseEditDialog";

interface Props {
  editable?: boolean;
}

type ActiveColumn = LevelKey | null;
const columns: LevelKey[] = ["A1", "A2", "B1"];
const phases: { key: PhaseKey; label: string }[] = [
  { key: "fase1", label: "Fase 1 - Basis leggen" },
  { key: "fase2", label: "Fase 2 - Basis versterken" },
  { key: "fase3", label: "Fase 3 - Verdiepen" },
];

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
      {phases.map((p) => {
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
  const [openGoals, setOpenGoals] = useState<string[]>([]);
  const [activeColumn, setActiveColumn] = useState<ActiveColumn>(null);

  if (isLoading) return <div className="text-muted-foreground">Laden…</div>;
  if (error) return <div className="text-destructive">Fout bij laden van data.</div>;
  if (!data) return null;

  const { domains, goals, phases: phasesMap } = data;

  const toggleDomain = (id: string) => {
    setOpenDomains((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };
  const toggleGoal = (id: string) => {
    setOpenGoals((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleColumnClick = (col: ActiveColumn) => {
    setActiveColumn((prev) => (prev === col ? null : col));
  };

  const isZoomed = activeColumn !== null;
  const getGridCols = () => (isZoomed ? "grid-cols-[2fr_3fr]" : "grid-cols-[1.5fr_1fr_1fr_1fr]");

  return (
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
                i < 2 ? "border-r border-primary-foreground/20" : ""
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
                <div className="p-4">&nbsp;</div>
              ) : (
                <>
                  <div className="p-4 border-r border-border">&nbsp;</div>
                  <div className="p-4 border-r border-border">&nbsp;</div>
                  <div className="p-4">&nbsp;</div>
                </>
              )}
            </div>

            {/* Goal rows */}
            {domainOpen &&
              domainGoals.map((goal) => {
                const goalOpen = openGoals.includes(goal.id);
                return (
                  <div key={goal.id}>
                    {/* Goal header row (always visible when domain open) */}
                    <div
                      className={`grid ${getGridCols()} gap-0 border-t border-border cursor-pointer hover:bg-muted/30 ${
                        goalOpen ? "bg-accent/30" : ""
                      }`}
                      onClick={() => toggleGoal(goal.id)}
                    >
                      <div className="p-3 pl-10 border-r border-border text-foreground flex items-center gap-2">
                        {goalOpen ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                        {goal.name}
                      </div>
                      {isZoomed ? (
                        <div className="p-3">&nbsp;</div>
                      ) : (
                        <>
                          <div className="p-3 border-r border-border">&nbsp;</div>
                          <div className="p-3 border-r border-border">&nbsp;</div>
                          <div className="p-3">&nbsp;</div>
                        </>
                      )}
                    </div>

                    {/* Goal content row (only when open) */}
                    {goalOpen && (
                      <div className={`grid ${getGridCols()} gap-0 border-t border-border bg-accent/10`}>
                        <div className="p-4 pl-10 border-r border-border text-xs uppercase tracking-wide text-muted-foreground">
                          Inhoud
                        </div>
                        {isZoomed ? (
                          <div className="p-4">
                            <PhaseList goalId={goal.id} goalName={goal.name} level={activeColumn!} phasesMap={phasesMap} editable={editable} horizontal />
                          </div>
                        ) : (
                          <>
                            {columns.map((lvl, i) => (
                              <div key={lvl} className={`p-4 ${i < 2 ? "border-r border-border" : ""}`}>
                                <PhaseList goalId={goal.id} goalName={goal.name} level={lvl} phasesMap={phasesMap} editable={editable} />
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        );
      })}
    </div>
  );
};

export default GrammarTable;
