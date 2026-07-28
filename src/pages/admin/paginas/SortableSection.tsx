import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Copy, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import type { PageSection } from "@/types/page";
import { blockTypeLabels } from "@/types/page";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { BlockFields } from "./BlockFields";

export function SortableSection({
  section,
  defaultExpanded,
  onUpdateContent,
  onToggleActive,
  onDuplicate,
  onRemove,
}: {
  section: PageSection;
  defaultExpanded?: boolean;
  onUpdateContent: (content: Record<string, unknown>) => void;
  onToggleActive: (active: boolean) => void;
  onDuplicate: () => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded ?? false);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: section.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="rounded-card border border-border bg-card"
    >
      <div className="flex items-center gap-2 p-3">
        <button {...attributes} {...listeners} className="cursor-grab text-secondary" aria-label="Reordenar">
          <GripVertical className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex flex-1 items-center gap-2 text-left"
        >
          <span className="font-medium">{blockTypeLabels[section.type]}</span>
          <span className="text-sm text-secondary">
            {expanded ? "clique para recolher" : "clique para editar o conteúdo"}
          </span>
        </button>
        <div className="flex items-center gap-2">
          <Switch checked={section.is_active} onCheckedChange={onToggleActive} />
          <Button size="icon-sm" variant="ghost" onClick={onDuplicate} aria-label="Duplicar">
            <Copy className="size-4" />
          </Button>
          <Button size="icon-sm" variant="ghost" onClick={onRemove} aria-label="Remover">
            <Trash2 className="size-4" />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? "Recolher" : "Editar conteúdo"}
          >
            {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </Button>
        </div>
      </div>
      {expanded && (
        <div className="border-t border-border p-4">
          <BlockFields type={section.type} content={section.content} onChange={onUpdateContent} />
        </div>
      )}
    </div>
  );
}
