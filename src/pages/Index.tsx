import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import GrammarTable from "@/components/GrammarTable";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-8">
        <h1 className="text-3xl font-bold text-foreground">Grammatica Overzicht</h1>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link to="/a1-doelen">A1 Doelen</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/volgorde">Fases ordenen</Link>
          </Button>
          {isAdmin && (
            <Button asChild variant="outline">
              <Link to="/admin">Admin</Link>
            </Button>
          )}
          {!user && (
            <Button asChild variant="ghost" size="sm">
              <Link to="/auth">Inloggen</Link>
            </Button>
          )}
        </div>
      </div>
      <GrammarTable />
    </div>
  );
};

export default Index;
