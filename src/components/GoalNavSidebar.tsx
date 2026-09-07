import { Link, useParams } from "react-router-dom";
import { useGrammarData } from "@/hooks/useGrammarData";
import { cn } from "@/lib/utils";

interface GoalNavSidebarProps {
  className?: string;
}

export const GoalNavSidebar = ({ className }: GoalNavSidebarProps) => {
  const { goalId } = useParams<{ goalId: string }>();
  const { data: grammar, isLoading } = useGrammarData();

  if (isLoading || !grammar) {
    return (
      <aside className={cn("p-4 text-sm text-muted-foreground", className)}>
        Laden…
      </aside>
    );
  }

  return (
    <aside className={cn("h-fit sticky top-4", className)}>
      <div className="rounded-lg border border-border bg-muted/20 overflow-hidden">
        <div className="px-4 py-3 bg-primary text-primary-foreground font-semibold text-sm">
          Grammaticale doelen
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
