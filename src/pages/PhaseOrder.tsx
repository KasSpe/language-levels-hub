import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGrammarData, type LevelKey, type PhaseKey } from "@/hooks/useGrammarData";

const levels: LevelKey[] = ["A1", "A2", "B1"];
const phaseLabels: Record<PhaseKey, string> = {
  fase1: "Fase 1 - Basis leggen",
  fase2: "Fase 2 - Basis versterken",
  fase3: "Fase 3 - Verdiepen",
};

interface Item {
  id: string;
  goalId: string;
  goalName: string;
  phase: PhaseKey;
  phaseLabel: string;
  title: string | null;
  bullets: string[];
}

const storageKey = (level: LevelKey) => `phase-order:${level}`;

const phaseClasses: Record<PhaseKey, string> = {
  fase1: "bg-green-100 border-green-300",
  fase2: "bg-green-300 border-green-500",
  fase3: "bg-green-600 border-green-800 text-white",
};

const SortableRow = ({ item, invalid }: { item: Item; invalid: boolean }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  const base = invalid
    ? "bg-red-100 border-red-500 text-red-900"
    : phaseClasses[item.phase];
  const mutedText = item.phase === "fase3" && !invalid ? "text-white/80" : "text-muted-foreground";
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-start gap-3 p-3 border-2 rounded-md ${base}`}
    >
      <button
        {...attributes}
        {...listeners}
        className="mt-0.5 p-1 rounded hover:bg-black/10 cursor-grab active:cursor-grabbing"
        aria-label="Sleep"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="flex-1 text-sm">
        <div className="font-medium">
          {item.goalName} <span className={mutedText}>— {item.phaseLabel}</span>
          {invalid && (
            <span className="ml-2 text-xs font-semibold uppercase">Ongeldige volgorde</span>
          )}
        </div>
        {item.title && item.title !== "—" && (
          <div className={`italic ${mutedText}`}>{item.title}</div>
        )}
        {item.bullets.length > 0 && (
          <ul className={`list-disc pl-5 mt-1 ${mutedText}`}>
            {item.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const PhaseOrder = () => {
  const { data, isLoading, error } = useGrammarData();
  const [level, setLevel] = useState<LevelKey>("A1");
  const [order, setOrder] = useState<string[]>([]);

  const items = useMemo<Item[]>(() => {
    if (!data) return [];
    const goalsById = new Map(data.goals.map((g) => [g.id, g]));
    const result: Item[] = [];
    data.goals.forEach((g) => {
      (["fase1", "fase2", "fase3"] as PhaseKey[]).forEach((p) => {
        const row = data.phases.get(`${g.id}|${level}|${p}`);
        if (!row) return;
        const hasContent = (row.title && row.title !== "—") || row.bullets.length > 0;
        if (!hasContent) return;
        result.push({
          id: `${g.id}|${p}`,
          goalId: g.id,
          goalName: goalsById.get(g.id)?.name ?? g.id,
          phase: p,
          phaseLabel: phaseLabels[p],
          title: row.title,
          bullets: row.bullets,
        });
      });
    });
    return result;
  }, [data, level]);

  // Load saved order or default to natural order when level/items change.
  useEffect(() => {
    if (!items.length) {
      setOrder([]);
      return;
    }
    const saved = localStorage.getItem(storageKey(level));
    const ids = items.map((i) => i.id);
    if (saved) {
      try {
        const parsed: string[] = JSON.parse(saved);
        const filtered = parsed.filter((id) => ids.includes(id));
        const missing = ids.filter((id) => !filtered.includes(id));
        setOrder([...filtered, ...missing]);
        return;
      } catch {
        /* ignore */
      }
    }
    setOrder(ids);
  }, [items, level]);

  const orderedItems = useMemo(() => {
    const byId = new Map(items.map((i) => [i.id, i]));
    return order.map((id) => byId.get(id)).filter((x): x is Item => !!x);
  }, [order, items]);

  const invalidIds = useMemo(() => {
    const seen: Record<string, Set<PhaseKey>> = {};
    const bad = new Set<string>();
    orderedItems.forEach((it) => {
      const prior = seen[it.goalId] ?? new Set<PhaseKey>();
      if (it.phase === "fase2" && !prior.has("fase1")) bad.add(it.id);
      if (it.phase === "fase3" && (!prior.has("fase1") || !prior.has("fase2"))) bad.add(it.id);
      prior.add(it.phase);
      seen[it.goalId] = prior;
    });
    return bad;
  }, [orderedItems]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setOrder((prev) => {
      const oldIndex = prev.indexOf(active.id as string);
      const newIndex = prev.indexOf(over.id as string);
      if (oldIndex < 0 || newIndex < 0) return prev;
      const next = arrayMove(prev, oldIndex, newIndex);
      localStorage.setItem(storageKey(level), JSON.stringify(next));
      return next;
    });
  };

  const resetOrder = () => {
    localStorage.removeItem(storageKey(level));
    setOrder(items.map((i) => i.id));
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="text-3xl font-bold text-foreground">Fases ordenen</h1>
        <Button asChild variant="outline" size="sm">
          <Link to="/">Terug naar overzicht</Link>
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <span className="text-sm text-muted-foreground mr-2">Niveau:</span>
        {levels.map((l) => (
          <Button
            key={l}
            variant={level === l ? "default" : "outline"}
            size="sm"
            onClick={() => setLevel(l)}
          >
            {l}
          </Button>
        ))}
        <div className="ml-auto">
          <Button variant="ghost" size="sm" onClick={resetOrder}>
            Volgorde herstellen
          </Button>
        </div>
      </div>

      {isLoading && <div className="text-muted-foreground">Laden…</div>}
      {error && <div className="text-destructive">Fout bij laden van data.</div>}
      {!isLoading && orderedItems.length === 0 && (
        <div className="text-muted-foreground">Geen fases met inhoud voor {level}.</div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={orderedItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2 max-w-3xl">
            {orderedItems.map((item) => (
              <SortableRow key={item.id} item={item} invalid={invalidIds.has(item.id)} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default PhaseOrder;
