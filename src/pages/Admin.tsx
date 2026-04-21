import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import GrammarTable from "@/components/GrammarTable";
import { useAuth } from "@/hooks/useAuth";

const Admin = () => {
  const { signOut, user } = useAuth();
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin — Grammatica</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Beweeg over een fase en klik op het potlood om te bewerken. Ingelogd als {user?.email}.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/">Publieke weergave</Link>
          </Button>
          <Button variant="ghost" onClick={signOut}>Uitloggen</Button>
        </div>
      </div>
      <GrammarTable editable />
    </div>
  );
};

export default Admin;
