import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import { Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteMedia, listAllMedia, listFolders, mediaCrud, uploadMedia } from "@/services/mediaService";
import type { Media } from "@/types/media";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function MidiaAdmin() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [folder, setFolder] = useState("todas");
  const [uploading, setUploading] = useState(false);

  const { data: media } = useQuery({ queryKey: ["admin", "media"], queryFn: listAllMedia });
  const { data: folders } = useQuery({ queryKey: ["admin", "media", "folders"], queryFn: listFolders });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "media"] });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop: async (files) => {
      setUploading(true);
      try {
        await Promise.all(
          files.map((f) => uploadMedia(f, folder === "todas" ? null : folder)),
        );
        toast.success(`${files.length} arquivo(s) enviado(s).`);
        invalidate();
        queryClient.invalidateQueries({ queryKey: ["admin", "media", "folders"] });
      } catch {
        toast.error("Erro ao enviar arquivos.");
      } finally {
        setUploading(false);
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Media> }) =>
      mediaCrud.update(id, patch),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (m: Media) => deleteMedia(m),
    onSuccess: () => {
      toast.success("Arquivo removido.");
      invalidate();
    },
  });

  const filtered = useMemo(() => {
    return (media ?? [])
      .filter((m) => folder === "todas" || m.folder === folder)
      .filter((m) => {
        const q = query.toLowerCase();
        if (!q) return true;
        return (
          m.path.toLowerCase().includes(q) ||
          m.alt_text?.toLowerCase().includes(q) ||
          m.tags.some((t) => t.toLowerCase().includes(q))
        );
      });
  }, [media, folder, query]);

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="font-heading text-2xl text-primary">Biblioteca de mídia</h1>
        <p className="text-secondary">
          Upload múltiplo com compressão e conversão automática para WebP.
        </p>
      </div>

      <div
        {...getRootProps()}
        className="cursor-pointer rounded-md border border-dashed border-input p-8 text-center text-sm text-secondary"
      >
        <input {...getInputProps()} />
        {isDragActive
          ? "Solte as imagens aqui…"
          : uploading
            ? "Enviando…"
            : "Clique ou arraste imagens para enviar (upload múltiplo)"}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-secondary" />
          <Input
            placeholder="Buscar por nome, alt text ou tag…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        {!!folders?.length && (
          <Tabs value={folder} onValueChange={setFolder}>
            <TabsList>
              <TabsTrigger value="todas">Todas as pastas</TabsTrigger>
              {folders.map((f) => (
                <TabsTrigger key={f} value={f}>
                  {f}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {filtered.map((m) => (
          <div key={m.id} className="space-y-2 rounded-card border border-border bg-card p-3">
            <img src={m.url} alt={m.alt_text ?? ""} className="aspect-square w-full rounded-md object-cover" />
            <Input
              placeholder="Alt text"
              defaultValue={m.alt_text ?? ""}
              onBlur={(e) => updateMutation.mutate({ id: m.id, patch: { alt_text: e.target.value } })}
            />
            <Input
              placeholder="Tags (vírgula)"
              defaultValue={m.tags.join(", ")}
              onBlur={(e) =>
                updateMutation.mutate({
                  id: m.id,
                  patch: { tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) },
                })
              }
            />
            <Input
              placeholder="Pasta"
              defaultValue={m.folder ?? ""}
              onBlur={(e) => updateMutation.mutate({ id: m.id, patch: { folder: e.target.value || null } })}
            />
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => {
                if (confirm("Remover este arquivo?")) deleteMutation.mutate(m);
              }}
            >
              <Trash2 className="size-4" /> Remover
            </Button>
          </div>
        ))}
        {!filtered.length && (
          <p className="col-span-full text-center text-secondary">Nenhum arquivo encontrado.</p>
        )}
      </div>
    </div>
  );
}
