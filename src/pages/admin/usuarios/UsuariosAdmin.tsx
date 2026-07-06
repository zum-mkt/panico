import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth, type StaffProfile } from "@/contexts/AuthContext";
import { listStaff, updateStaffRole } from "@/services/usersService";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const roleLabels: Record<StaffProfile["role"], string> = {
  super_admin: "Super Admin",
  administrador: "Administrador",
  editor: "Editor",
  marketing: "Marketing",
  atendimento: "Atendimento",
};

export function UsuariosAdmin() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const canManage = profile?.role === "super_admin";

  const { data: staff } = useQuery({ queryKey: ["admin", "users"], queryFn: listStaff });

  const mutation = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Parameters<typeof updateStaffRole>[1] }) =>
      updateStaffRole(id, patch),
    onSuccess: () => {
      toast.success("Atualizado.");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: () => toast.error("Só o Super Admin pode alterar papel ou status."),
  });

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="font-heading text-2xl text-primary">Usuários</h1>
        <p className="text-secondary">
          Perfis: Super Admin, Administrador, Editor, Marketing, Atendimento. Novas contas são
          criadas em Authentication → Users no painel do Supabase e depois vinculadas aqui.
        </p>
        {!canManage && (
          <p className="mt-2 text-sm text-warning">
            Só o Super Admin pode alterar papel ou status de usuários.
          </p>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Papel</TableHead>
            <TableHead>Ativo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(staff ?? []).map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.name}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>
                {canManage ? (
                  <select
                    value={u.role}
                    onChange={(e) =>
                      mutation.mutate({
                        id: u.id,
                        patch: { role: e.target.value as StaffProfile["role"] },
                      })
                    }
                    className="h-8 rounded-md border border-input bg-transparent px-2 text-sm"
                  >
                    {Object.entries(roleLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Badge variant="secondary">{roleLabels[u.role]}</Badge>
                )}
              </TableCell>
              <TableCell>
                <Switch
                  checked={u.is_active}
                  disabled={!canManage}
                  onCheckedChange={(active) =>
                    mutation.mutate({ id: u.id, patch: { is_active: active } })
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
