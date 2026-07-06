import { useState } from "react";
import { Plus, X } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { slugify } from "@/services/blogService";
import type { DynamicForm, FormFieldDef, FormFieldType } from "@/types/form";

const fieldTypes: { value: FormFieldType; label: string }[] = [
  { value: "text", label: "Texto curto" },
  { value: "textarea", label: "Texto longo" },
  { value: "email", label: "E-mail" },
  { value: "phone", label: "Telefone" },
  { value: "select", label: "Seleção" },
  { value: "checkbox", label: "Caixa de seleção" },
];

export function FormBuilder({
  open,
  onOpenChange,
  form,
  onSubmit,
  submitting,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form?: DynamicForm | null;
  onSubmit: (values: {
    title: string;
    slug: string;
    fields: FormFieldDef[];
    notify_email: string;
    is_active: boolean;
  }) => void;
  submitting?: boolean;
}) {
  const [title, setTitle] = useState(form?.title ?? "");
  const [slug, setSlug] = useState(form?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(!!form);
  const [notifyEmail, setNotifyEmail] = useState(form?.notify_email ?? "");
  const [isActive, setIsActive] = useState(form?.is_active ?? true);
  const [fields, setFields] = useState<FormFieldDef[]>(
    form?.fields ?? [{ name: "nome", label: "Nome", type: "text", required: true }],
  );

  function updateField(index: number, patch: Partial<FormFieldDef>) {
    setFields((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{form ? "Editar formulário" : "Novo formulário"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Título</Label>
            <Input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugEdited) setSlug(slugify(e.target.value));
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugEdited(true);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>E-mail para notificação</Label>
            <Input value={notifyEmail} onChange={(e) => setNotifyEmail(e.target.value)} />
            <p className="text-xs text-secondary">
              O envio automático de e-mail requer configurar uma Edge Function com um provedor
              (Resend/SendGrid); por enquanto as respostas ficam disponíveis aqui no admin.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={isActive} onCheckedChange={setIsActive} />
            <Label>Ativo no site</Label>
          </div>

          <div className="space-y-3">
            <Label>Campos</Label>
            {fields.map((field, i) => (
              <div key={i} className="space-y-2 rounded-md border border-border p-3">
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input
                    placeholder="Nome do campo (ex: telefone)"
                    value={field.name}
                    onChange={(e) => updateField(i, { name: e.target.value })}
                  />
                  <Input
                    placeholder="Rótulo (ex: Telefone)"
                    value={field.label}
                    onChange={(e) => updateField(i, { label: e.target.value })}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={field.type}
                    onChange={(e) => updateField(i, { type: e.target.value as FormFieldType })}
                    className="h-8 rounded-md border border-input bg-transparent px-2 text-sm"
                  >
                    {fieldTypes.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={field.required}
                      onCheckedChange={(v) => updateField(i, { required: v })}
                    />
                    <Label>Obrigatório</Label>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setFields((prev) => prev.filter((_, idx) => idx !== i))}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
                {field.type === "select" && (
                  <Input
                    placeholder="Opções separadas por vírgula"
                    value={field.options?.join(", ") ?? ""}
                    onChange={(e) =>
                      updateField(i, {
                        options: e.target.value.split(",").map((o) => o.trim()).filter(Boolean),
                      })
                    }
                  />
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setFields((prev) => [
                  ...prev,
                  { name: "", label: "", type: "text", required: false },
                ])
              }
            >
              <Plus className="size-4" /> Adicionar campo
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button
            disabled={submitting}
            onClick={() =>
              onSubmit({ title, slug, fields, notify_email: notifyEmail, is_active: isActive })
            }
          >
            {submitting ? "Salvando…" : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
