import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { Faq } from "@/types/faq";

export type FaqFormValues = {
  question: string;
  answer: string;
  context: string;
  is_active: boolean;
};

export function FaqForm({
  open,
  onOpenChange,
  faq,
  defaultContext,
  onSubmit,
  submitting,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faq?: Faq | null;
  defaultContext: string;
  onSubmit: (values: FaqFormValues) => void;
  submitting?: boolean;
}) {
  const [question, setQuestion] = useState(faq?.question ?? "");
  const [answer, setAnswer] = useState(faq?.answer ?? "");
  const [context] = useState(faq?.context ?? defaultContext);
  const [isActive, setIsActive] = useState(faq?.is_active ?? true);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{faq ? "Editar pergunta" : "Nova pergunta"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Pergunta</Label>
            <Input value={question} onChange={(e) => setQuestion(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Resposta</Label>
            <Textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={4} />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={isActive} onCheckedChange={setIsActive} />
            <Label>Ativo</Label>
          </div>
        </div>

        <DialogFooter>
          <Button
            disabled={submitting || !question || !answer}
            onClick={() => onSubmit({ question, answer, context, is_active: isActive })}
          >
            {submitting ? "Salvando…" : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
