import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  addSection,
  duplicateSection,
  listSectionsAdmin,
  pagesCrud,
  reorderSections,
  sectionsCrud,
} from "@/services/pagesService";
import type { BlockType, PageSection } from "@/types/page";
import { blockTypeLabels } from "@/types/page";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SortableSection } from "./SortableSection";

export function PageBuilder() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [newBlockType, setNewBlockType] = useState<BlockType>("text");
  const [sections, setSections] = useState<PageSection[]>([]);

  const { data: page } = useQuery({
    queryKey: ["admin", "pages", id],
    queryFn: async () => (await pagesCrud.getById(id!)),
    enabled: !!id,
  });
  const { data: fetchedSections } = useQuery({
    queryKey: ["admin", "pages", id, "sections"],
    queryFn: () => listSectionsAdmin(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (fetchedSections) setSections(fetchedSections);
  }, [fetchedSections]);

  const invalidateSections = () =>
    queryClient.invalidateQueries({ queryKey: ["admin", "pages", id, "sections"] });

  const addMutation = useMutation({
    mutationFn: () => addSection(id!, newBlockType, sections.length ? Math.max(...sections.map((s) => s.position)) : -1),
    onSuccess: invalidateSections,
  });

  const updateContentMutation = useMutation({
    mutationFn: ({ sectionId, content }: { sectionId: string; content: Record<string, unknown> }) =>
      sectionsCrud.update(sectionId, { content }),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ sectionId, active }: { sectionId: string; active: boolean }) =>
      sectionsCrud.update(sectionId, { is_active: active }),
    onSuccess: invalidateSections,
  });

  const duplicateMutation = useMutation({
    mutationFn: (section: PageSection) => duplicateSection(section),
    onSuccess: () => {
      toast.success("Bloco duplicado.");
      invalidateSections();
    },
  });

  const removeMutation = useMutation({
    mutationFn: (sectionId: string) => sectionsCrud.remove(sectionId),
    onSuccess: () => {
      toast.success("Bloco removido.");
      invalidateSections();
    },
  });

  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    const next = arrayMove(sections, oldIndex, newIndex);
    setSections(next);
    reorderSections(next).then(invalidateSections);
  }

  if (!page) return null;

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon-sm">
          <Link to="/admin/paginas">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="font-heading text-2xl text-primary">{page.title}</h1>
          <p className="text-secondary">/{page.slug} — arraste os blocos para reordenar.</p>
        </div>
      </div>

      <div className="flex items-end gap-2">
        <div className="space-y-2">
          <Label>Adicionar bloco</Label>
          <select
            value={newBlockType}
            onChange={(e) => setNewBlockType(e.target.value as BlockType)}
            className="h-8 rounded-md border border-input bg-transparent px-2 text-sm"
          >
            {Object.entries(blockTypeLabels).map(([type, label]) => (
              <option key={type} value={type}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <Button onClick={() => addMutation.mutate()} disabled={addMutation.isPending}>
          <Plus className="size-4" /> Adicionar bloco
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {sections.map((section) => (
              <SortableSection
                key={section.id}
                section={section}
                onUpdateContent={(content) => {
                  setSections((prev) =>
                    prev.map((s) => (s.id === section.id ? { ...s, content } : s)),
                  );
                  updateContentMutation.mutate({ sectionId: section.id, content });
                }}
                onToggleActive={(active) =>
                  toggleActiveMutation.mutate({ sectionId: section.id, active })
                }
                onDuplicate={() => duplicateMutation.mutate(section)}
                onRemove={() => {
                  if (confirm("Remover este bloco?")) removeMutation.mutate(section.id);
                }}
              />
            ))}
            {!sections.length && (
              <p className="text-center text-secondary">
                Nenhum bloco ainda. Adicione o primeiro acima.
              </p>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
