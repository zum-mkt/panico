import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { listAllObituariesAdmin, obituariesCrud } from "@/services/obituariesService";
import type { Obituary } from "@/types/obituary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ObituarioForm, type ObituaryFormValues } from "./ObituarioForm";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" });

function toPayload(values: ObituaryFormValues & { photo_url?: string | null }) {
  return {
    ...values,
    age: values.age ? Number(values.age) : null,
    wake_at: values.wake_at || null,
    burial_at: values.burial_at || null,
    published_at: values.published_at || null,
  };
}

export function ObituariosAdmin() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published">("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Obituary | null>(null);

  const { data: obituaries } = useQuery({
    queryKey: ["admin", "obituaries"],
    queryFn: listAllObituariesAdmin,
  });

  const filtered = useMemo(() => {
    return (obituaries ?? [])
      .filter((o) => statusFilter === "all" || o.status === statusFilter)
      .filter((o) => o.name.toLowerCase().includes(search.toLowerCase()));
  }, [obituaries, search, statusFilter]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "obituaries"] });

  const createMutation = useMutation({
    mutationFn: (values: ObituaryFormValues & { photo_url?: string | null }) =>
      obituariesCrud.create(toPayload(values)),
    onSuccess: () => {
      toast.success("Obituário criado.");
      invalidate();
      setFormOpen(false);
    },
    onError: () => toast.error("Erro ao criar obituário."),
  });

  const updateMutation = useMutation({
    mutationFn: (values: ObituaryFormValues & { photo_url?: string | null }) =>
      obituariesCrud.update(editing!.id, toPayload(values)),
    onSuccess: () => {
      toast.success("Obituário atualizado.");
      invalidate();
      setFormOpen(false);
    },
    onError: () => toast.error("Erro ao atualizar obituário."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => obituariesCrud.remove(id),
    onSuccess: () => {
      toast.success("Obituário removido.");
      invalidate();
    },
    onError: () => toast.error("Erro ao remover obituário."),
  });

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(o: Obituary) {
    setEditing(o);
    setFormOpen(true);
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl text-primary">Obituários</h1>
          <p className="text-secondary">Gerencie os avisos de falecimento do site.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" /> Novo obituário
        </Button>
      </div>

      <div className="flex gap-3">
        <Input
          placeholder="Buscar por nome…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="h-8 rounded-md border border-input bg-transparent px-2 text-sm"
        >
          <option value="all">Todos os status</option>
          <option value="draft">Rascunho</option>
          <option value="published">Publicado</option>
        </select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Falecimento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((o) => (
            <TableRow key={o.id}>
              <TableCell>{o.name}</TableCell>
              <TableCell>{dateFormatter.format(new Date(o.deceased_at))}</TableCell>
              <TableCell>
                <Badge variant={o.status === "published" ? "default" : "secondary"}>
                  {o.status === "published" ? "Publicado" : "Rascunho"}
                </Badge>
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button size="icon-sm" variant="ghost" onClick={() => openEdit(o)}>
                  <Pencil className="size-4" />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => {
                    if (confirm(`Remover "${o.name}"?`)) deleteMutation.mutate(o.id);
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ObituarioForm
        open={formOpen}
        onOpenChange={setFormOpen}
        obituary={editing}
        submitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={(values) => (editing ? updateMutation.mutate(values) : createMutation.mutate(values))}
      />
    </div>
  );
}
