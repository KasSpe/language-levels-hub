import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

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

const Index = () => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (name: string) => {
    setOpenItems((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Grammatica Overzicht</h1>
      <div className="border border-border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-4 gap-0">
          <div className="bg-primary text-primary-foreground font-semibold p-4 border-r border-primary-foreground/20">
            Grammaticaal doel
          </div>
          <div className="bg-primary text-primary-foreground font-semibold p-4 border-r border-primary-foreground/20 text-center">
            A1
          </div>
          <div className="bg-primary text-primary-foreground font-semibold p-4 border-r border-primary-foreground/20 text-center">
            A2
          </div>
          <div className="bg-primary text-primary-foreground font-semibold p-4 text-center">
            B1
          </div>
        </div>

        {/* Rows */}
        {grammarGoals.map((goal) => (
          <div key={goal.name}>
            {/* Parent row */}
            <div
              className="grid grid-cols-4 gap-0 border-t border-border cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => toggleItem(goal.name)}
            >
              <div className="p-4 border-r border-border bg-muted/30 font-medium flex items-center gap-2">
                {openItems.includes(goal.name) ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                {goal.name}
              </div>
              <div className="p-4 border-r border-border">&nbsp;</div>
              <div className="p-4 border-r border-border">&nbsp;</div>
              <div className="p-4">&nbsp;</div>
            </div>

            {/* Children */}
            {openItems.includes(goal.name) &&
              goal.children?.map((child) => (
                <div
                  key={child}
                  className="grid grid-cols-4 gap-0 border-t border-border"
                >
                  <div className="p-4 pl-10 border-r border-border bg-muted/10 text-muted-foreground">
                    {child}
                  </div>
                  <div className="p-4 border-r border-border">&nbsp;</div>
                  <div className="p-4 border-r border-border">&nbsp;</div>
                  <div className="p-4">&nbsp;</div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;
