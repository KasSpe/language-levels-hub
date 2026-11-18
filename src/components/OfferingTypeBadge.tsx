import { Badge } from "@/components/ui/badge";
import type { OfferingContextRow } from "@/hooks/useGrammarData";
import { getOfferingLabel } from "@/lib/offeringType";

export const OfferingTypeBadge = ({ offering }: { offering?: OfferingContextRow }) => {
  const label = getOfferingLabel(offering);

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
      <span className="text-muted-foreground">Aanbieding:</span>
      {label ? (
        <Badge variant="secondary" className="font-medium">{label}</Badge>
      ) : (
        <span className="italic text-muted-foreground">Nog niet aangeduid</span>
      )}
    </div>
  );
};
