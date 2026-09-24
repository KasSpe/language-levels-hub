import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useGrammarData, PhaseKey } from "@/hooks/useGrammarData";
import { getPhaseLabel } from "@/data/phaseLabels";

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

const A1Goals = () => {
  const { data } = useGrammarData();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? A1_GOALS.filter((g) => `${g.code} ${g.name}`.toLowerCase().includes(s)) : A1_GOALS;
  }, [q]);

  const toggle = (c: string) =>
    setOpen((p) => { const n = new Set(p); n.has(c) ? n.delete(c) : n.add(c); return n; });

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

      <div className="space-y-8">
        {CATS.map((cat) => {
          const items = filtered.filter((g) => g.cat === cat.key);
          if (!items.length) return null;
          return (
            <section key={cat.key}>
              <h2 className="text-xl font-semibold mb-3 text-foreground">{cat.label} <span className="text-muted-foreground text-base">({items.length})</span></h2>
              <div className="rounded-lg border border-border divide-y divide-border">
                {items.map((g) => {
                  const isOpen = open.has(g.code);
                  return (
                    <div key={g.code}>
                      <button onClick={() => toggle(g.code)} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50">
                        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        <Badge variant="secondary" className="font-mono">{g.code}</Badge>
                        <span className="font-medium text-foreground">{g.name}</span>
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pl-11">
                          {g.goalId ? (
                            <>
                              <div className="grid gap-3 md:grid-cols-3">
                                {PHASES.map((p) => {
                                  const c = data?.phases.get(`${g.goalId}|A1|${p}`);
                                  return (
                                    <div key={p} className="rounded-md border border-border bg-muted/20 p-3">
                                      <div className="text-xs font-semibold text-primary mb-1">{getPhaseLabel(p, "A1")}</div>
                                      {c?.title && c.title !== "—" && <div className="text-sm font-medium mb-1">{c.title}</div>}
                                      {c?.bullets?.length ? (
                                        <ul className="list-disc pl-4 text-sm space-y-0.5">{c.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
                                      ) : <span className="text-sm text-muted-foreground">—</span>}
                                    </div>
                                  );
                                })}
                              </div>
                              <Link to={`/doel/${g.goalId}/A1`} className="inline-block mt-3 text-sm text-primary underline">Meer uitleg →</Link>
                            </>
                          ) : (
                            <p className="text-sm text-muted-foreground">Nog geen inhoud gekoppeld aan dit doel.</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
        {!filtered.length && <p className="text-muted-foreground">Geen doelen gevonden.</p>}
      </div>
    </div>
  );
};

export default A1Goals;
