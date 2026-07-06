import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { bannersCrud, listAllBannersAdmin, swapBannerPosition } from "@/services/bannersService";
import type { Banner } from "@/types/banner";
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
import { BannerForm, type BannerFormValues } from "./BannerForm";

function toPayload(values: BannerFormValues) {
  return {
    ...values,
    starts_at: values.starts_at || null,
    ends_at: values.ends_at || null,
  };
}

export function BannersAdmin() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);

  const { data: banners } = useQuery({ queryKey: ["admin", "banners"], queryFn: listAllBannersAdmin });
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "banners"] });

  const createMutation = useMutation({
    mutationFn: (values: BannerFormValues) =>
      bannersCrud.create({ ...toPayload(values), position: (banners?.length ?? 0) + 1 }),
    onSuccess: () => {
      toast.success("Banner criado.");
      invalidate();
      setFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: BannerFormValues) => bannersCrud.update(editing!.id, toPayload(values)),
    onSuccess: () => {
      toast.success("Banner atualizado.");
      invalidate();
      setFormOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => bannersCrud.remove(id),
    onSuccess: () => {
      toast.success("Banner removido.");
      invalidate();
    },
  });

  const reorderMutation = useMutation({
    mutationFn: ({ a, b }: { a: Banner; b: Banner }) => swapBannerPosition(a, b),
    onSuccess: invalidate,
  });

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(b: Banner) {
    setEditing(b);
    setFormOpen(true);
  }

  const list = banners ?? [];

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl text-primary">Banners</h1>
          <p className="text-secondary">Banners promocionais exibidos na Home, com agendamento.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" /> Novo banner
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ordem</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Agendamento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.map((banner, i) => (
            <TableRow key={banner.id}>
              <TableCell className="flex gap-1">
                <Button
                  size="icon-xs"
                  variant="ghost"
                  disabled={i === 0}
                  onClick={() => reorderMutation.mutate({ a: banner, b: list[i - 1] })}
                >
                  <ArrowUp className="size-3.5" />
                </Button>
                <Button
                  size="icon-xs"
                  variant="ghost"
                  disabled={i === list.length - 1}
                  onClick={() => reorderMutation.mutate({ a: banner, b: list[i + 1] })}
                >
                  <ArrowDown className="size-3.5" />
                </Button>
              </TableCell>
              <TableCell>{banner.title || "—"}</TableCell>
              <TableCell className="text-sm text-secondary">
                {banner.starts_at || banner.ends_at
                  ? `${banner.starts_at ? new Date(banner.starts_at).toLocaleString("pt-BR") : "—"} até ${banner.ends_at ? new Date(banner.ends_at).toLocaleString("pt-BR") : "—"}`
                  : "Sem agendamento"}
              </TableCell>
              <TableCell>
                <Badge variant={banner.is_active ? "default" : "secondary"}>
                  {banner.is_active ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button size="icon-sm" variant="ghost" onClick={() => openEdit(banner)}>
                  <Pencil className="size-4" />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => {
                    if (confirm(`Remover "${banner.title}"?`)) deleteMutation.mutate(banner.id);
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <BannerForm
        open={formOpen}
        onOpenChange={setFormOpen}
        banner={editing}
        submitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={(values) => (editing ? updateMutation.mutate(values) : createMutation.mutate(values))}
      />
    </div>
  );
}
