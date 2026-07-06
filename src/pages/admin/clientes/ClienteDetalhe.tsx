import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addClientHistory,
  clientsCrud,
  listOwnDependents,
  listOwnDocuments,
  listOwnHistory,
  uploadClientDocument,
} from "@/services/clientsService";
import { listAllPlansAdmin } from "@/services/plansService";
import type { Client } from "@/types/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ClienteDetalhe({
  client,
  open,
  onOpenChange,
}: {
  client: Client;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(client.name);
  const [phone, setPhone] = useState(client.phone ?? "");
  const [cpf, setCpf] = useState(client.cpf ?? "");
  const [planId, setPlanId] = useState(client.plan_id ?? "");
  const [historyText, setHistoryText] = useState("");
  const [docTitle, setDocTitle] = useState("");

  const { data: plans } = useQuery({ queryKey: ["admin", "plans"], queryFn: listAllPlansAdmin });
  const { data: dependents } = useQuery({
    queryKey: ["admin", "client", client.id, "dependents"],
    queryFn: () => listOwnDependents(client.id),
  });
  const { data: documents } = useQuery({
    queryKey: ["admin", "client", client.id, "documents"],
    queryFn: () => listOwnDocuments(client.id),
  });
  const { data: history } = useQuery({
    queryKey: ["admin", "client", client.id, "history"],
    queryFn: () => listOwnHistory(client.id),
  });

  const invalidateClients = () =>
    queryClient.invalidateQueries({ queryKey: ["admin", "clients"] });

  const saveMutation = useMutation({
    mutationFn: () =>
      clientsCrud.update(client.id, { name, phone, cpf, plan_id: planId || null }),
    onSuccess: () => {
      toast.success("Cliente atualizado.");
      invalidateClients();
    },
  });

  const historyMutation = useMutation({
    mutationFn: () => addClientHistory(client.id, historyText),
    onSuccess: () => {
      toast.success("Registro adicionado.");
      setHistoryText("");
      queryClient.invalidateQueries({ queryKey: ["admin", "client", client.id, "history"] });
    },
  });

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !docTitle) return;
    await uploadClientDocument(client.id, file, docTitle);
    toast.success("Documento enviado.");
    setDocTitle("");
    queryClient.invalidateQueries({ queryKey: ["admin", "client", client.id, "documents"] });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{client.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>CPF</Label>
              <Input value={cpf} onChange={(e) => setCpf(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Plano</Label>
              <select
                value={planId}
                onChange={(e) => setPlanId(e.target.value)}
                className="h-8 w-full rounded-md border border-input bg-transparent px-2 text-sm"
              >
                <option value="">Sem plano</option>
                {(plans ?? []).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            Salvar dados do cliente
          </Button>

          <div className="space-y-2">
            <Label>Dependentes</Label>
            <ul className="space-y-1 text-sm">
              {(dependents ?? []).map((d) => (
                <li key={d.id}>
                  {d.name} {d.relationship && `— ${d.relationship}`}
                </li>
              ))}
              {!dependents?.length && <p className="text-secondary">Nenhum dependente.</p>}
            </ul>
          </div>

          <div className="space-y-2">
            <Label>Documentos</Label>
            <ul className="space-y-1 text-sm">
              {(documents ?? []).map((d) => (
                <li key={d.id}>{d.title}</li>
              ))}
            </ul>
            <div className="flex gap-2">
              <Input
                placeholder="Título do documento"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
              />
              <Input type="file" onChange={handleUpload} disabled={!docTitle} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Histórico</Label>
            <ul className="space-y-1 text-sm">
              {(history ?? []).map((h) => (
                <li key={h.id}>{h.description}</li>
              ))}
            </ul>
            <div className="flex gap-2">
              <Input
                placeholder="Nova entrada de histórico"
                value={historyText}
                onChange={(e) => setHistoryText(e.target.value)}
              />
              <Button
                onClick={() => historyMutation.mutate()}
                disabled={!historyText || historyMutation.isPending}
              >
                Adicionar
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}
