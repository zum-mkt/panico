import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { BellRing, Check } from "lucide-react";
import { subscribeToObituaryNotifications } from "@/services/notificationSubscribersService";
import { Reveal } from "@/components/ui/reveal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().email("E-mail inválido"),
});

/** Inscrição para aviso por e-mail de novos obituários. */
export function ObituaryNotificationSignup({
  className,
  divided = true,
}: {
  className?: string;
  divided?: boolean;
}) {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof schema>) => subscribeToObituaryNotifications(values.email),
    onSuccess: () => setSubmitted(true),
    onError: (error: Error) =>
      toast.error(error.message || "Não foi possível concluir a inscrição."),
  });

  return (
    <Reveal className={className}>
      <div
        className={cn(
          "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
          divided && "border-t border-border/80 pt-8",
        )}
      >
        <div className="flex items-start gap-3 sm:max-w-md">
          <BellRing className="mt-0.5 size-5 shrink-0 text-accent" />
          <div className="space-y-1">
            <h2 className="font-heading text-lg text-primary">Receba um aviso por e-mail</h2>
            <p className="text-sm text-secondary">
              Informe seu e-mail e confirme no link que vamos enviar. Depois, avisamos a cada novo
              obituário publicado.
            </p>
          </div>
        </div>

        {submitted ? (
          <p className="flex items-center gap-2 text-sm text-primary sm:max-w-xs">
            <Check className="size-4 shrink-0 text-accent" />
            Quase lá! Enviamos um e-mail de confirmação — clique no link para ativar o aviso.
          </p>
        ) : (
          <form
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
            className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-start"
            noValidate
          >
            <div className="space-y-1 sm:w-72">
              <Input
                type="email"
                placeholder="seu@email.com"
                aria-label="Seu e-mail"
                autoComplete="email"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>
            <Button type="submit" disabled={mutation.isPending} className="shrink-0">
              {mutation.isPending ? "Enviando…" : "Quero receber"}
            </Button>
          </form>
        )}
      </div>
    </Reveal>
  );
}
