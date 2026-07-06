import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Printer, Download, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useClientAuth } from "@/contexts/ClientAuthContext";
import {
  createOwnClientProfile,
  dependentsCrud,
  getSignedDocumentUrl,
  listOwnDependents,
  listOwnDocuments,
  listOwnHistory,
} from "@/services/clientsService";
import { supabase } from "@/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" });

export function ClienteDashboard() {
  const { client, signOut, refresh } = useClientAuth();
  const queryClient = useQueryClient();

  const { data: dependents } = useQuery({
    queryKey: ["client", client?.id, "dependents"],
    queryFn: () => listOwnDependents(client!.id),
    enabled: !!client,
  });
  const { data: documents } = useQuery({
    queryKey: ["client", client?.id, "documents"],
    queryFn: () => listOwnDocuments(client!.id),
    enabled: !!client,
  });
  const { data: history } = useQuery({
    queryKey: ["client", client?.id, "history"],
    queryFn: () => listOwnHistory(client!.id),
    enabled: !!client,
  });

  const [depName, setDepName] = useState("");
  const [depRelationship, setDepRelationship] = useState("");

  const addDependent = useMutation({
    mutationFn: () =>
      dependentsCrud.create({ client_id: client!.id, name: depName, relationship: depRelationship }),
    onSuccess: () => {
      toast.success("Dependente adicionado.");
      setDepName("");
      setDepRelationship("");
      queryClient.invalidateQueries({ queryKey: ["client", client?.id, "dependents"] });
    },
  });

  const removeDependent = useMutation({
    mutationFn: (id: string) => dependentsCrud.remove(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["client", client?.id, "dependents"] }),
  });

  const [name, setName] = useState(client?.name ?? "");
  const [phone, setPhone] = useState(client?.phone ?? "");
  const updateProfile = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("clients")
        .update({ name, phone })
        .eq("id", client!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Cadastro atualizado.");
      refresh();
    },
  });

  async function handleDownload(path: string) {
    const url = await getSignedDocumentUrl(path);
    window.open(url, "_blank");
  }

  if (!client) {
    return <CompleteProfile />;
  }

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl text-primary">Olá, {client.name}</h1>
          <p className="text-secondary">Bem-vindo à sua área do cliente.</p>
        </div>
        <Button variant="outline" onClick={() => signOut()}>
          Sair
        </Button>
      </div>

      <Tabs defaultValue="carteirinha">
        <TabsList>
          <TabsTrigger value="carteirinha">Carteirinha</TabsTrigger>
          <TabsTrigger value="dependentes">Dependentes</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
          <TabsTrigger value="cadastro">Meus dados</TabsTrigger>
        </TabsList>

        <TabsContent value="carteirinha">
          <div id="carteirinha" className="max-w-sm space-y-4 rounded-card border border-accent bg-primary p-8 text-primary-foreground print:text-black">
            <p className="font-heading text-lg">Funerária Paníco</p>
            <div>
              <p className="text-xs text-primary-foreground/70">Titular</p>
              <p className="text-lg">{client.name}</p>
            </div>
            <div>
              <p className="text-xs text-primary-foreground/70">Nº da carteirinha</p>
              <p className="font-mono text-lg">{client.card_number}</p>
            </div>
            <div>
              <p className="text-xs text-primary-foreground/70">Cliente desde</p>
              <p>{dateFormatter.format(new Date(client.member_since))}</p>
            </div>
          </div>
          <Button className="mt-4" variant="outline" onClick={() => window.print()}>
            <Printer className="size-4" /> Imprimir / 2ª via
          </Button>
        </TabsContent>

        <TabsContent value="dependentes">
          <div className="space-y-4">
            <ul className="space-y-2">
              {(dependents ?? []).map((d) => (
                <li
                  key={d.id}
                  className="flex items-center justify-between rounded-card border border-border bg-card p-4"
                >
                  <div>
                    <p>{d.name}</p>
                    {d.relationship && <p className="text-sm text-secondary">{d.relationship}</p>}
                  </div>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => removeDependent.mutate(d.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </li>
              ))}
              {!dependents?.length && (
                <p className="text-sm text-secondary">Nenhum dependente cadastrado.</p>
              )}
            </ul>
            <div className="flex gap-2">
              <Input
                placeholder="Nome"
                value={depName}
                onChange={(e) => setDepName(e.target.value)}
              />
              <Input
                placeholder="Parentesco"
                value={depRelationship}
                onChange={(e) => setDepRelationship(e.target.value)}
              />
              <Button
                onClick={() => addDependent.mutate()}
                disabled={!depName || addDependent.isPending}
              >
                <Plus className="size-4" /> Adicionar
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="historico">
          <ul className="space-y-2">
            {(history ?? []).map((h) => (
              <li key={h.id} className="rounded-card border border-border bg-card p-4">
                <p>{h.description}</p>
                <p className="text-sm text-secondary">
                  {dateFormatter.format(new Date(h.occurred_at))}
                </p>
              </li>
            ))}
            {!history?.length && (
              <p className="text-sm text-secondary">Nenhum registro por enquanto.</p>
            )}
          </ul>
        </TabsContent>

        <TabsContent value="downloads">
          <ul className="space-y-2">
            {(documents ?? []).map((doc) => (
              <li
                key={doc.id}
                className="flex items-center justify-between rounded-card border border-border bg-card p-4"
              >
                <p>{doc.title}</p>
                <Button size="sm" variant="outline" onClick={() => handleDownload(doc.file_url)}>
                  <Download className="size-4" /> Baixar
                </Button>
              </li>
            ))}
            {!documents?.length && (
              <p className="text-sm text-secondary">Nenhum documento disponível.</p>
            )}
          </ul>
        </TabsContent>

        <TabsContent value="cadastro">
          <form
            className="max-w-sm space-y-4"
            onSubmit={(e: FormEvent) => {
              e.preventDefault();
              updateProfile.mutate();
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" value={phone ?? ""} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <Button type="submit" disabled={updateProfile.isPending}>
              Salvar alterações
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </main>
  );
}

function CompleteProfile() {
  const { session, refresh, signOut } = useClientAuth();
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!session?.user) return;
    setSubmitting(true);
    try {
      await createOwnClientProfile(session.user.id, session.user.email ?? "", name);
      toast.success("Cadastro concluído!");
      await refresh();
    } catch {
      toast.error("Não foi possível concluir o cadastro.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-svh max-w-sm flex-col justify-center gap-6 px-6 py-24">
      <div className="text-center">
        <h1 className="font-heading text-xl text-primary">Falta pouco!</h1>
        <p className="text-secondary">Complete seu cadastro para acessar a área do cliente.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-card border border-border bg-card p-8">
        <div className="space-y-2">
          <Label htmlFor="complete-name">Nome completo</Label>
          <Input id="complete-name" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Salvando…" : "Concluir cadastro"}
        </Button>
      </form>
      <button
        type="button"
        onClick={() => signOut()}
        className="text-center text-sm text-secondary hover:text-primary"
      >
        Sair
      </button>
    </main>
  );
}
