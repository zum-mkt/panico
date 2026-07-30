import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { crownsCrud, listAllCrownsAdmin } from "@/services/crownsService";
import type { Crown } from "@/types/crown";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeroTab } from "@/pages/admin/shared/PageHeroTab";
import { CoroaForm, type CrownFormValues } from "./CoroaForm";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function toPayload(values: CrownFormValues & { photos: string[] }) {
  return { ...values, price: values.price ? Number(values.price) : null };
}

export function CoroasAdmin() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Crown | null>(null);

  const { data: crowns } = useQuery({ queryKey: ["admin", "crowns"], queryFn: listAllCrownsAdmin });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "crowns"] });

  const createMutation = useMutation({
    mutationFn: (values: CrownFormValues & { photos: string[] }) => crownsCrud.create(toPayload(values)),
    onSuccess: () => {
      toast.success("Coroa criada.");
      invalidate();
      setFormOpen(false);
    },
    onError: () => toast.error("Erro ao criar coroa."),
  });

  const updateMutation = useMutation({
    mutationFn: (values: CrownFormValues & { photos: string[] }) =>
      crownsCrud.update(editing!.id, toPayload(values)),
    onSuccess: () => {
      toast.success("Coroa atualizada.");
      invalidate();
      setFormOpen(false);
    },
    onError: () => toast.error("Erro ao atualizar coroa."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => crownsCrud.remove(id),
    onSuccess: () => {
      toast.success("Coroa removida.");
      invalidate();
    },
  });

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(c: Crown) {
    setEditing(c);
    setFormOpen(true);
  }

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="font-heading text-2xl text-primary">Coroas</h1>
        <p className="text-secondary">Gerencie o catálogo de coroas de flores.</p>
      </div>

      <Tabs defaultValue="lista">
        <TabsList>
          <TabsTrigger value="lista">Coroas</TabsTrigger>
          <TabsTrigger value="hero">Hero da página</TabsTrigger>
        </TabsList>
        <TabsContent value="hero">
          <PageHeroTab
            settingsKey="coroas_hero"
            defaults={{
              eyebrow: "Catálogo",
              title: "Coroas de Flores",
              description: "",
              image_url: "",
              primary_label: "",
              primary_href: "",
            }}
          />
        </TabsContent>
        <TabsContent value="lista" className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={openCreate}>
              <Plus className="size-4" /> Nova coroa
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(crowns ?? []).map((crown) => (
                <TableRow key={crown.id}>
                  <TableCell>{crown.title}</TableCell>
                  <TableCell>{crown.category || "—"}</TableCell>
                  <TableCell>{crown.price != null ? currency.format(crown.price) : "—"}</TableCell>
                  <TableCell className="flex gap-2">
                    <Badge variant={crown.is_active ? "default" : "secondary"}>
                      {crown.is_active ? "Ativo" : "Inativo"}
                    </Badge>
                    {!crown.is_available && <Badge variant="secondary">Indisponível</Badge>}
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button size="icon-sm" variant="ghost" onClick={() => openEdit(crown)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => {
                        if (confirm(`Remover "${crown.title}"?`)) deleteMutation.mutate(crown.id);
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <CoroaForm
            key={editing?.id ?? "new"}
            open={formOpen}
            onOpenChange={setFormOpen}
            crown={editing}
            submitting={createMutation.isPending || updateMutation.isPending}
            onSubmit={(values) => (editing ? updateMutation.mutate(values) : createMutation.mutate(values))}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
