import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { listAllClientsAdmin } from "@/services/clientsService";
import type { Client } from "@/types/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClienteDetalhe } from "./ClienteDetalhe";

export function ClientesAdmin() {
  const { data: clients } = useQuery({ queryKey: ["admin", "clients"], queryFn: listAllClientsAdmin });
  const [editing, setEditing] = useState<Client | null>(null);

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="font-heading text-2xl text-primary">Clientes</h1>
        <p className="text-secondary">
          Contas são criadas pelo próprio cliente em /area-do-cliente. Aqui você vincula planos,
          documentos e histórico.
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Carteirinha</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(clients ?? []).map((c) => (
            <TableRow key={c.id}>
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.email}</TableCell>
              <TableCell className="font-mono text-sm">{c.card_number}</TableCell>
              <TableCell className="text-right">
                <Button size="icon-sm" variant="ghost" onClick={() => setEditing(c)}>
                  <Pencil className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {!clients?.length && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-secondary">
                Nenhum cliente cadastrado ainda.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {editing && (
        <ClienteDetalhe client={editing} open={!!editing} onOpenChange={() => setEditing(null)} />
      )}
    </div>
  );
}
