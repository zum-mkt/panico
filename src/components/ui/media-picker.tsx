import { useQuery } from "@tanstack/react-query";
import { listAllMedia } from "@/services/mediaService";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

/**
 * Seletor de mídia reutilizável — permite escolher um arquivo já
 * enviado à Biblioteca de Mídia em qualquer módulo do admin, em vez de
 * enviar uma imagem nova toda vez. Ver 14-BIBLIOTECA_DE_MIDIA.md.
 */
export function MediaPicker({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
}) {
  const { data: media } = useQuery({ queryKey: ["admin", "media"], queryFn: listAllMedia, enabled: open });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Selecionar da biblioteca de mídia</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-3">
          {(media ?? []).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                onSelect(m.url);
                onOpenChange(false);
              }}
              className="overflow-hidden rounded-md border border-border hover:border-accent"
            >
              <img src={m.url} alt={m.alt_text ?? ""} className="aspect-square w-full object-cover" />
            </button>
          ))}
          {!media?.length && (
            <p className="col-span-full text-center text-secondary">
              Nenhum arquivo na biblioteca ainda.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
