import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Blocks, Trash2 } from "lucide-react";
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
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="size-4" /> Nova página
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Status</TableHead>
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
              <TableCell className="flex justify-end gap-2">
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
              <TableCell colSpan={4} className="text-center text-secondary">
                Nenhuma página criada ainda.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <PageMetaForm
        open={formOpen}
        onOpenChange={setFormOpen}
        submitting={createMutation.isPending}
        onSubmit={(values) => createMutation.mutate(values)}
      />
    </div>
  );
}
