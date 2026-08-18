import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import {
  listSubscribersAdmin,
  removeSubscriberAdmin,
  subscribersToCsv,
} from "@/services/notificationSubscribersService";
import type { NotificationSubscriber } from "@/types/notificationSubscriber";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusLabel: Record<NotificationSubscriber["status"], { label: string; variant: "default" | "secondary" | "outline" }> = {
  confirmed: { label: "Confirmado", variant: "default" },
  pending: { label: "Aguardando confirmação", variant: "secondary" },
  unsubscribed: { label: "Descadastrado", variant: "outline" },
};

export function InscritosAdmin() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");

  const queryKey = ["admin", "notification-subscribers"];
  const { data: subscribers } = useQuery({ queryKey, queryFn: listSubscribersAdmin });

  const deleteMutation = useMutation({
    mutationFn: removeSubscriberAdmin,
    onSuccess: () => {
      toast.success("Inscrito removido.");
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const filtered = useMemo(() => {
    const list = subscribers ?? [];
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter(
      (s) => s.email.toLowerCase().includes(q) || (s.name ?? "").toLowerCase().includes(q),
    );
  }, [subscribers, query]);

  const confirmedCount = subscribers?.filter((s) => s.status === "confirmed").length ?? 0;

  function handleExport() {
    if (!subscribers?.length) return;
    const csv = subscribersToCsv(subscribers);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inscritos-obituarios.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl text-primary">Inscritos em avisos de óbito</h1>
          <p className="text-secondary">
            {confirmedCount} confirmado{confirmedCount === 1 ? "" : "s"} de {subscribers?.length ?? 0} cadastro
            {subscribers?.length === 1 ? "" : "s"}.
          </p>
        </div>
        <Button variant="outline" onClick={handleExport} disabled={!subscribers?.length}>
          <Download className="size-4" /> Exportar CSV
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-secondary" />
        <Input
          placeholder="Buscar por nome ou e-mail…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Inscrito em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((subscriber) => (
            <TableRow key={subscriber.id}>
              <TableCell>{subscriber.name || "—"}</TableCell>
              <TableCell>{subscriber.email}</TableCell>
              <TableCell>
                <Badge variant={statusLabel[subscriber.status].variant}>
                  {statusLabel[subscriber.status].label}
                </Badge>
              </TableCell>
              <TableCell>{new Date(subscriber.created_at).toLocaleDateString("pt-BR")}</TableCell>
              <TableCell className="text-right">
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => {
                    if (confirm(`Remover "${subscriber.email}" da lista?`)) {
                      deleteMutation.mutate(subscriber.id);
                    }
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {!filtered.length && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-secondary">
                Nenhum inscrito encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
