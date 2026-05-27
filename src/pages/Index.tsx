import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import GrammarTable from "@/components/GrammarTable";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Grammatica Overzicht</h1>
        <div className="flex gap-2">
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
