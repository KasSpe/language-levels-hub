import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useGrammarData } from "@/hooks/useGrammarData";
import { cn } from "@/lib/utils";

interface GoalNavSidebarProps {
  className?: string;
}

const STORAGE_KEY = "goal-nav-collapsed";

export const GoalNavSidebar = ({ className }: GoalNavSidebarProps) => {
  const { goalId } = useParams<{ goalId: string }>();
  const { data: grammar, isLoading } = useGrammarData();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setCollapsed(saved === "true");
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  };

  if (isLoading || !grammar) {
    return (
      <aside className={cn("p-4 text-sm text-muted-foreground", className)}>
        Laden…
      </aside>
    );
  }

  if (collapsed) {
    return (
      <aside className={cn("h-fit sticky top-4", className)}>
        <div className="rounded-lg border border-border bg-muted/20 overflow-hidden w-14">
          <button
            onClick={toggleCollapsed}
            className="w-full flex items-center justify-center px-2 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            aria-label="Navigatie openklappen"
            title="Navigatie openklappen"
          >
            <PanelLeftOpen className="h-5 w-5" />
          </button>
          <div className="py-3 flex justify-center">
            <div
              className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
            >
              Grammaticale doelen
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className={cn("h-fit sticky top-4", className)}>
      <div className="rounded-lg border border-border bg-muted/20 overflow-hidden min-w-[16rem]">
        <div className="px-4 py-3 bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-between gap-2">
          <span>Grammaticale doelen</span>
          <button
            onClick={toggleCollapsed}
            className="p-1 rounded hover:bg-primary-foreground/20 transition-colors"
            aria-label="Navigatie dichtklappen"
            title="Navigatie dichtklappen"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>
        <nav className="p-2 max-h-[calc(100vh-8rem)] overflow-y-auto">
          {grammar.domains.map((domain) => {
            const domainGoals = grammar.goals.filter((g) => g.domain_id === domain.id);
            return (
              <div key={domain.id} className="mb-3">
                <div className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {domain.name}
                </div>
                <ul className="space-y-0.5">
                  {domainGoals.map((goal) => {
                    const active = goal.id === goalId;
                    return (
                      <li key={goal.id}>
                        <Link
                          to={`/doel/${goal.id}`}
                          className={cn(
                            "block px-2 py-1.5 text-sm rounded-md transition-colors",
                            active
                              ? "bg-primary text-primary-foreground font-medium"
                              : "text-foreground hover:bg-muted"
                          )}
                        >
                          {goal.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
