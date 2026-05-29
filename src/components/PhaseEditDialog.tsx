import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { PhaseContentRow, LevelKey, PhaseKey } from "@/hooks/useGrammarData";
import { getPhaseLabel } from "@/data/phaseLabels";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  goalId: string;
  goalName: string;
  level: LevelKey;
  phase: PhaseKey;
  existing?: PhaseContentRow;
}

const PhaseEditDialog = ({ open, onOpenChange, goalId, goalName, level, phase, existing }: Props) => {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [bullets, setBullets] = useState("");
  const [examples, setExamples] = useState("");
  const [weight, setWeight] = useState<string>("");

  useEffect(() => {
    if (open) {
      setTitle(existing?.title ?? "");
      setBullets((existing?.bullets ?? []).join("\n"));
      setExamples((existing?.examples ?? []).join("\n"));
      setWeight(existing?.weight?.toString() ?? "");
    }
  }, [open, existing]);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        goal_id: goalId,
        level,
        phase,
        title: title || null,
        bullets: bullets.split("\n").map((s) => s.trim()).filter(Boolean),
        examples: examples.split("\n").map((s) => s.trim()).filter(Boolean),
        weight: weight ? parseInt(weight, 10) : null,
      };
      const { error } = await supabase
        .from("phase_content")
        .upsert(payload, { onConflict: "goal_id,level,phase" });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["grammar-data"] });
      toast.success("Opgeslagen");
      onOpenChange(false);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const phaseLabel = getPhaseLabel(phase, level);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{goalName} — {level} — {phaseLabel}</DialogTitle>
          <DialogDescription>Bewerk titel, bullets, voorbeelden en gewicht.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titel</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bullets">Bullets (één per regel)</Label>
            <Textarea id="bullets" rows={6} value={bullets} onChange={(e) => setBullets(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="examples">Voorbeelden (één per regel)</Label>
            <Textarea id="examples" rows={3} value={examples} onChange={(e) => setExamples(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Gewicht (1-3, optioneel)</Label>
            <Input id="weight" type="number" min={1} max={3} value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuleren</Button>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>Opslaan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PhaseEditDialog;
