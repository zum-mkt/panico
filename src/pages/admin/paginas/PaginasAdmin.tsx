import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Blocks, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { listAllPagesAdmin, pagesCrud } from "@/services/pagesService";
import type { Page } from "@/types/page";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageMetaForm, type PageMetaValues } from "./PageMetaForm";

export function PaginasAdmin() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);

  const { data: pages } = useQuery({ queryKey: ["admin", "pages"], queryFn: listAllPagesAdmin });
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "pages"] });

  const createMutation = useMutation({
    mutationFn: (values: PageMetaValues) => pagesCrud.create(values),
    onSuccess: () => {
      toast.success("Página criada. Agora adicione os blocos.");
      invalidate();
      setFormOpen(false);
    },
    onError: () => toast.error("Erro ao criar (verifique se o slug já existe)."),
  });

  const updateMutation = useMutation({
    mutationFn: (values: PageMetaValues) => pagesCrud.update(editingPage!.id, values),
    onSuccess: () => {
      toast.success("Página atualizada.");
      invalidate();
      setFormOpen(false);
      setEditingPage(null);
    },
    onError: () => toast.error("Erro ao salvar."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => pagesCrud.remove(id),
    onSuccess: () => {
      toast.success("Página removida.");
      invalidate();
    },
  });

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl text-primary">Páginas</h1>
          <p className="text-secondary">
            Construtor de páginas com blocos reordenáveis por drag-and-drop.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingPage(null);
            setFormOpen(true);
          }}
        >
          <Plus className="size-4" /> Nova página
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Menu</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(pages ?? []).map((p: Page) => (
            <TableRow key={p.id}>
              <TableCell>{p.title}</TableCell>
              <TableCell className="font-mono text-sm">/{p.slug}</TableCell>
              <TableCell>
                <Badge variant={p.status === "published" ? "default" : "secondary"}>
                  {p.status === "published" ? "Publicado" : "Rascunho"}
                </Badge>
              </TableCell>
              <TableCell>
                {p.show_in_menu ? (
                  <Badge variant="default">Visível</Badge>
                ) : (
                  <span className="text-sm text-secondary">—</span>
                )}
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => {
                    setEditingPage(p);
                    setFormOpen(true);
                  }}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link to={`/admin/paginas/${p.id}`}>
                    <Blocks className="size-4" /> Editar blocos
                  </Link>
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => {
                    if (confirm(`Remover "${p.title}"?`)) deleteMutation.mutate(p.id);
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {!pages?.length && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-secondary">
                Nenhuma página criada ainda.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <PageMetaForm
        key={editingPage?.id ?? "new"}
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingPage(null);
        }}
        page={editingPage}
        submitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={(values) =>
          editingPage ? updateMutation.mutate(values) : createMutation.mutate(values)
        }
      />
    </div>
  );
}
