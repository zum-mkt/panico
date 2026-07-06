import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { listSubmissions, submissionsToCsv } from "@/services/formsService";
import type { DynamicForm } from "@/types/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function SubmissionsDialog({
  form,
  open,
  onOpenChange,
}: {
  form: DynamicForm;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: submissions } = useQuery({
    queryKey: ["admin", "forms", form.id, "submissions"],
    queryFn: () => listSubmissions(form.id),
    enabled: open,
  });

  function handleExport() {
    if (!submissions) return;
    const csv = submissionsToCsv(form, submissions);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.slug}-respostas.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Respostas — {form.title}</DialogTitle>
        </DialogHeader>

        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handleExport} disabled={!submissions?.length}>
            <Download className="size-4" /> Exportar CSV
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              {form.fields.map((f) => (
                <TableHead key={f.name}>{f.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {(submissions ?? []).map((s) => (
              <TableRow key={s.id}>
                <TableCell>{new Date(s.created_at).toLocaleString("pt-BR")}</TableCell>
                {form.fields.map((f) => (
                  <TableCell key={f.name}>{String(s.data[f.name] ?? "")}</TableCell>
                ))}
              </TableRow>
            ))}
            {!submissions?.length && (
              <TableRow>
                <TableCell colSpan={form.fields.length + 1} className="text-center text-secondary">
                  Nenhuma resposta ainda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
