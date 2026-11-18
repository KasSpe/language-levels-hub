import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useGrammarData, PhaseKey, LevelKey } from "@/hooks/useGrammarData";
import { getPhaseLabel, levels } from "@/data/phaseLabels";
import { OfferingTypeBadge } from "@/components/OfferingTypeBadge";

type Cat = "WW" | "WS" | "ZIN";
interface A1Goal { code: string; cat: Cat; name: string; goalId?: string }

const A1_GOALS: A1Goal[] = [
  { code: "A1Gram01WW", cat: "WW", name: "Hebben en zijn", goalId: "hebben-zijn-ott" },
  { code: "A1Gram02WW", cat: "WW", name: "Onvoltooid tegenwoordige tijd - OTT (infinitief en stam)", goalId: "ott" },
  { code: "A1Gram03WS", cat: "WS", name: "Persoonlijk voornaamwoord", goalId: "persoonlijk-vnw" },
  { code: "A1Gram04ZIN", cat: "ZIN", name: "Gewone zin (onderwerp-pv-rest)", goalId: "enkelvoudige-zinnen" },
  { code: "A1Gram05WS", cat: "WS", name: "Zelfstandig naamwoord meervoud (+en, +s, +'s)", goalId: "znw" },
  { code: "A1Gram06WS", cat: "WS", name: "Bepaald lidwoord", goalId: "lidwoord" },
  { code: "A1Gram07WS", cat: "WS", name: "Voorzetsel (tijd, middel, plaats, richting)", goalId: "voorzetsel" },
  { code: "A1Gram08ZIN", cat: "ZIN", name: "Ja/nee-vraag" },
  { code: "A1Gram09ZIN", cat: "ZIN", name: "Niet en geen" },
  { code: "A1Gram10ZIN", cat: "ZIN", name: "Vraagzin met vraagwoord", goalId: "vragend-vnw" },
  { code: "A1Gram11ZIN", cat: "ZIN", name: "Inversie" },
  { code: "A1Gram12WW", cat: "WW", name: "Modale werkwoorden", goalId: "modale-ww" },
  { code: "A1Gram13WW", cat: "WW", name: "Imperatief" },
  { code: "A1Gram14WS", cat: "WS", name: "Bijvoeglijk naamwoord", goalId: "bn" },
  { code: "A1Gram15WS", cat: "WS", name: "Bezittelijk voornaamwoord", goalId: "bezittelijk-vnw" },
  { code: "A1Gram16WS", cat: "WS", name: "Persoonlijk voornaamwoord als voorwerp", goalId: "persoonlijk-vnw" },
  { code: "A1Gram17WS", cat: "WS", name: "Aanwijzend voornaamwoord", goalId: "aanwijzend-vnw" },
  { code: "A1Gram18WS", cat: "WS", name: "Verkleinwoorden", goalId: "znw" },
  { code: "A1Gram19WS", cat: "WS", name: "Onbepaald lidwoord", goalId: "lidwoord" },
  { code: "A1Gram20WS", cat: "WS", name: "Trappen van vergelijking", goalId: "bn" },
];

const CATS: { key: Cat; label: string }[] = [
  { key: "WW", label: "Werkwoorden" },
  { key: "WS", label: "Woordsoorten" },
  { key: "ZIN", label: "Zinnen" },
];
const PHASES: PhaseKey[] = ["fase1", "fase2", "fase3"];
const GRID = "grid-cols-[1.5fr_1fr_1fr_1fr_1fr]";

const A1Goals = () => {
  const { data } = useGrammarData();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? A1_GOALS.filter((g) => `${g.code} ${g.name}`.toLowerCase().includes(s)) : A1_GOALS;
  }, [q]);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link to="/"><ArrowLeft className="h-4 w-4 mr-1" />Overzicht</Link>
          </Button>
          <h1 className="text-3xl font-bold text-foreground">A1 Doelen</h1>
        </div>
        <Input placeholder="Zoek op code of trefwoord…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
      </div>

      <div className="border border-border rounded-lg">
        <div>
          {/* Sticky header */}
          <div className={`grid ${GRID} sticky top-0 z-10 shadow-sm`}>
            <div className="bg-primary text-primary-foreground font-semibold p-4 border-r border-primary-foreground/20">
              Grammaticaal doel
            </div>
            {levels.map((lvl, i) => (
              <div
                key={lvl}
                className={`bg-primary text-primary-foreground font-semibold p-4 text-center ${
                  i < levels.length - 1 ? "border-r border-primary-foreground/20" : ""
                }`}
              >
                {lvl}
              </div>
            ))}
          </div>

          {CATS.map((cat) => {
            const items = filtered.filter((g) => g.cat === cat.key);
            if (!items.length) return null;
            return (
              <div key={cat.key}>
                {/* Categorie-rij */}
                <div className={`grid ${GRID} border-t border-border bg-muted/40`}>
                  <div className="p-3 font-semibold text-foreground col-span-5">
                    {cat.label} <span className="text-muted-foreground font-normal">({items.length})</span>
                  </div>
                </div>

                {/* Doelrijen */}
                {items.map((g) => (
                  <div key={g.code} className={`grid ${GRID} border-t border-border`}>
                    <div className="p-3 border-r border-border bg-muted/10">
                      <div className="flex items-start gap-2 flex-wrap">
                        <Badge variant="secondary" className="font-mono text-xs">{g.code}</Badge>
                        <span className="font-medium text-foreground text-sm">{g.name}</span>
                      </div>
                      {g.goalId && (
                        <Link
                          to={`/doel/${g.goalId}`}
                          className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          Meer uitleg <ExternalLink className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                    {levels.map((lvl: LevelKey, i) => (
                      <div key={lvl} className={`p-3 text-sm ${i < levels.length - 1 ? "border-r border-border" : ""}`}>
                        <OfferingTypeBadge offering={g.goalId ? data?.offerings.get(`${g.goalId}|${lvl}`) : undefined} />
                        {g.goalId ? (
                          <div className="flex flex-col gap-2">
                            {PHASES.map((p) => {
                              const c = data?.phases.get(`${g.goalId}|${lvl}|${p}`);
                              const has = c && (c.title || c.bullets.length > 0);
                              return (
                                <div key={p}>
                                  <div className="font-medium text-foreground text-xs">{getPhaseLabel(p, lvl)}</div>
                                  {has ? (
                                    <>
                                      {c.title && c.title !== "—" && (
                                        <div className="text-muted-foreground italic text-xs">{c.title}</div>
                                      )}
                                      {c.bullets.length > 0 && (
                                        <ul className="list-disc pl-4 text-muted-foreground text-xs mt-0.5 space-y-0.5">
                                          {c.bullets.map((b, bi) => <li key={bi}>{b}</li>)}
                                        </ul>
                                      )}
                                    </>
                                  ) : (
                                    <div className="text-muted-foreground/60">—</div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-muted-foreground/60">—</span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        {!filtered.length && <p className="p-4 text-muted-foreground">Geen doelen gevonden.</p>}
      </div>
    </div>
  );
};

export default A1Goals;
