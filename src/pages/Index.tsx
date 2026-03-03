import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import PhaseCell from "@/components/PhaseCell";

interface GrammarItem {
  name: string;
  children?: string[];
}

const grammarGoals: GrammarItem[] = [
  {
    name: "Naamwoorden",
    children: ["Lidwoord", "Zelfstandig naamwoord", "Bijvoeglijk naamwoord", "Telwoord"],
  },
  {
    name: "Voornaamwoorden",
    children: ["Persoonlijk vnw", "Bezittelijk vnw", "Aanwijzend vnw", "Onbepaald vnw", "Vragend vnw"],
  },
  {
    name: "Taalstructurerende woorden",
    children: ["Voorzetsel", "Voegwoord"],
  },
  {
    name: "Werkwoordstijden",
    children: ["Onvoltooid tegenwoordige tijd"],
  },
  {
    name: "Specifieke werkwoordsvormen",
    children: ["Hebben en zijn in de ott", "Onpersoonlijke ww"],
  },
  {
    name: "Complexe werkwoordconstructies",
    children: ["Modale werkwoorden"],
  },
  {
    name: "Zinsstructuren",
    children: ["Enkelvoudige zinnen"],
  },
  {
    name: "Zinsdelen",
    children: ["Zinsdelen aanduiden"],
  },
  {
    name: "Woordsoorten",
  },
];

type ActiveColumn = "A1" | "A2" | "B1" | null;

const columns: ActiveColumn[] = ["A1", "A2", "B1"];

const Index = () => {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [activeColumn, setActiveColumn] = useState<ActiveColumn>(null);

  const toggleItem = (name: string) => {
    setOpenItems((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  const handleColumnClick = (col: ActiveColumn) => {
    setActiveColumn((prev) => (prev === col ? null : col));
    // Open all categories when zooming in
    if (activeColumn !== col) {
      setOpenItems(grammarGoals.filter((g) => g.children).map((g) => g.name));
    }
  };

  const isZoomed = activeColumn !== null;

  const getGridCols = () => {
    if (!isZoomed) return "grid-cols-[1fr_1fr_1fr_1fr]";
    return "grid-cols-[2fr_3fr]"; // goal + active column only
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Grammatica Overzicht</h1>
      <div className="border border-border rounded-lg overflow-hidden">
        {/* Header */}
        <div className={`grid ${getGridCols()} gap-0 transition-all`}>
          <div className="bg-primary text-primary-foreground font-semibold p-4 border-r border-primary-foreground/20">
            Grammaticaal doel
          </div>
          {isZoomed ? (
            <div
              className="bg-primary text-primary-foreground font-semibold p-4 text-center cursor-pointer hover:bg-primary/80 transition-colors"
              onClick={() => handleColumnClick(activeColumn)}
            >
              {activeColumn} <span className="text-xs opacity-70 ml-2">(klik om terug te gaan)</span>
            </div>
          ) : (
            columns.map((col, i) => (
              <div
                key={col}
                className={`bg-primary text-primary-foreground font-semibold p-4 text-center cursor-pointer hover:bg-primary/80 transition-colors ${
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
        {grammarGoals.map((goal) => (
          <div key={goal.name}>
            {/* Parent row */}
            <div
              className={`grid ${getGridCols()} gap-0 border-t border-border cursor-pointer hover:bg-muted/50 transition-colors`}
              onClick={() => toggleItem(goal.name)}
            >
              <div className="p-4 border-r border-border bg-muted/30 font-medium flex items-center gap-2">
                {goal.children ? (
                  openItems.includes(goal.name) ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )
                ) : null}
                {goal.name}
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

            {/* Children */}
            {openItems.includes(goal.name) &&
              goal.children?.map((child) => (
                <div
                  key={child}
                  className={`grid ${getGridCols()} gap-0 border-t border-border`}
                >
                  <div className="p-4 pl-10 border-r border-border bg-muted/10 text-muted-foreground">
                    {child}
                  </div>
                  {isZoomed ? (
                    <div className="p-4"><PhaseCell /></div>
                  ) : (
                    <>
                      <div className="p-4 border-r border-border"><PhaseCell /></div>
                      <div className="p-4 border-r border-border"><PhaseCell /></div>
                      <div className="p-4"><PhaseCell /></div>
                    </>
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;
