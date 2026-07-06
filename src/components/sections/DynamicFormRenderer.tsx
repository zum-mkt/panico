import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getFormBySlug, submitForm } from "@/services/formsService";
import type { FormFieldDef } from "@/types/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

/**
 * Renderiza qualquer formulário criado no admin (/admin/formularios) a
 * partir do slug — ver 13-FORMULARIOS.md. Todo formulário é dinâmico:
 * os campos e a validação vêm do banco, nada é hardcoded por formulário.
 */
export function DynamicFormRenderer({ slug }: { slug: string }) {
  const { data: form } = useQuery({
    queryKey: ["forms", slug],
    queryFn: () => getFormBySlug(slug),
  });

  const schema = useMemo(() => {
    if (!form) return z.object({});
    const shape: Record<string, z.ZodTypeAny> = {};
    for (const field of form.fields) {
      let fieldSchema: z.ZodTypeAny =
        field.type === "checkbox" ? z.boolean() : z.string();
      if (field.type === "email") fieldSchema = z.string().email("E-mail inválido");
      if (field.required && field.type !== "checkbox") {
        fieldSchema = (fieldSchema as z.ZodString).min(1, "Campo obrigatório");
      } else if (field.type !== "checkbox") {
        fieldSchema = fieldSchema.optional().or(z.literal(""));
      }
      shape[field.name] = fieldSchema;
    }
    return z.object(shape);
  }, [form]);

  // O schema é montado dinamicamente a partir dos campos do formulário
  // (vindos do banco), então o shape não pode ser conhecido em tempo
  // de compilação — daí o cast do resolver.
  const rhf = useForm<Record<string, string | boolean>>({
    resolver: zodResolver(schema) as never,
  });

  const mutation = useMutation({
    mutationFn: (values: Record<string, string | boolean>) => submitForm(form!.id, values),
    onSuccess: () => {
      toast.success("Enviado com sucesso! Entraremos em contato em breve.");
      rhf.reset();
    },
    onError: () => toast.error("Não foi possível enviar. Tente novamente."),
  });

  if (!form) return null;

  function renderField(field: FormFieldDef) {
    const error = rhf.formState.errors[field.name]?.message as string | undefined;

    if (field.type === "textarea") {
      return (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>{field.label}</Label>
          <Textarea id={field.name} {...rhf.register(field.name)} />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      );
    }

    if (field.type === "select") {
      return (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>{field.label}</Label>
          <select
            id={field.name}
            {...rhf.register(field.name)}
            className="h-8 w-full rounded-md border border-input bg-transparent px-2 text-sm"
          >
            <option value="">Selecione…</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      );
    }

    if (field.type === "checkbox") {
      return (
        <div key={field.name} className="flex items-center gap-2">
          <Switch
            id={field.name}
            checked={!!rhf.watch(field.name)}
            onCheckedChange={(v) => rhf.setValue(field.name, v)}
          />
          <Label htmlFor={field.name}>{field.label}</Label>
        </div>
      );
    }

    return (
      <div key={field.name} className="space-y-2">
        <Label htmlFor={field.name}>{field.label}</Label>
        <Input
          id={field.name}
          type={field.type === "email" ? "email" : field.type === "phone" ? "tel" : "text"}
          {...rhf.register(field.name)}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <form
      onSubmit={rhf.handleSubmit((values) => mutation.mutate(values))}
      className="space-y-4 rounded-card border border-border bg-card p-8"
    >
      {form.fields.map(renderField)}
      <Button type="submit" disabled={mutation.isPending} className="w-full">
        {mutation.isPending ? "Enviando…" : "Enviar"}
      </Button>
    </form>
  );
}
