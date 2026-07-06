import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import { X } from "lucide-react";
import { toast } from "sonner";
import {
  listAllCemeterySectionsAdmin,
  upsertCemeterySection,
  uploadCemeteryPhoto,
} from "@/services/cemeteryService";
import type {
  GalleryContent,
  HoursContent,
  LocationContent,
  TextBlockContent,
  VideoContent,
} from "@/types/cemetery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

function TextBlockTab({
  section,
  label,
  value,
}: {
  section: "history" | "structure";
  label: string;
  value?: TextBlockContent;
}) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(value?.title ?? "");
  const [text, setText] = useState(value?.text ?? "");
  const [imageUrl, setImageUrl] = useState(value?.image_url ?? "");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setTitle(value?.title ?? "");
    setText(value?.text ?? "");
    setImageUrl(value?.image_url ?? "");
  }, [value]);

  const mutation = useMutation({
    mutationFn: () => upsertCemeterySection(section, { title, text, image_url: imageUrl }),
    onSuccess: () => {
      toast.success("Salvo.");
      queryClient.invalidateQueries({ queryKey: ["admin", "cemetery"] });
    },
    onError: () => toast.error("Erro ao salvar."),
  });

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      setImageUrl(await uploadCemeteryPhoto(file));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Título</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Texto</Label>
        <Textarea rows={5} value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Imagem</Label>
        <Input type="file" accept="image/*" onChange={handleImage} />
        {uploading && <p className="text-sm text-secondary">Enviando…</p>}
        {imageUrl && <img src={imageUrl} alt="" className="h-32 rounded-md object-cover" />}
      </div>
      <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
        Salvar {label}
      </Button>
    </div>
  );
}

function GalleryTab({ value }: { value?: GalleryContent }) {
  const queryClient = useQueryClient();
  const [images, setImages] = useState<string[]>(value?.images ?? []);
  const [uploading, setUploading] = useState(false);

  useEffect(() => setImages(value?.images ?? []), [value]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop: async (files) => {
      setUploading(true);
      try {
        const urls = await Promise.all(files.map(uploadCemeteryPhoto));
        setImages((prev) => [...prev, ...urls]);
      } finally {
        setUploading(false);
      }
    },
  });

  const mutation = useMutation({
    mutationFn: () => upsertCemeterySection("gallery", { images }),
    onSuccess: () => {
      toast.success("Galeria salva.");
      queryClient.invalidateQueries({ queryKey: ["admin", "cemetery"] });
    },
    onError: () => toast.error("Erro ao salvar."),
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className="cursor-pointer rounded-md border border-dashed border-input p-6 text-center text-sm text-secondary"
      >
        <input {...getInputProps()} />
        {isDragActive ? "Solte as imagens aqui…" : "Clique ou arraste imagens (galeria ilimitada)"}
      </div>
      {uploading && <p className="text-sm text-secondary">Enviando…</p>}
      <div className="flex flex-wrap gap-2">
        {images.map((url) => (
          <div key={url} className="relative">
            <img src={url} alt="" className="size-20 rounded-md object-cover" />
            <button
              type="button"
              onClick={() => setImages((prev) => prev.filter((p) => p !== url))}
              className="absolute -top-1 -right-1 rounded-full bg-destructive p-0.5 text-destructive-foreground"
            >
              <X className="size-3" />
            </button>
          </div>
        ))}
      </div>
      <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
        Salvar galeria
      </Button>
    </div>
  );
}

function VideoTab({
  section,
  label,
  value,
}: {
  section: "video" | "drone";
  label: string;
  value?: VideoContent;
}) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(value?.title ?? "");
  const [youtubeUrl, setYoutubeUrl] = useState(value?.youtube_url ?? "");

  useEffect(() => {
    setTitle(value?.title ?? "");
    setYoutubeUrl(value?.youtube_url ?? "");
  }, [value]);

  const mutation = useMutation({
    mutationFn: () => upsertCemeterySection(section, { title, youtube_url: youtubeUrl }),
    onSuccess: () => {
      toast.success("Salvo.");
      queryClient.invalidateQueries({ queryKey: ["admin", "cemetery"] });
    },
    onError: () => toast.error("Erro ao salvar."),
  });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Título</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Link do YouTube</Label>
        <Input value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
      </div>
      <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
        Salvar {label}
      </Button>
    </div>
  );
}

function LocationTab({ value }: { value?: LocationContent }) {
  const [address, setAddress] = useState(value?.address ?? "");
  useEffect(() => setAddress(value?.address ?? ""), [value]);

  const mutation = useMutation({
    mutationFn: () => upsertCemeterySection("location", { address }),
    onSuccess: () => toast.success("Salvo."),
    onError: () => toast.error("Erro ao salvar."),
  });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Endereço</Label>
        <Input value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>
      <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
        Salvar localização
      </Button>
    </div>
  );
}

function HoursTab({ value }: { value?: HoursContent }) {
  const [schedule, setSchedule] = useState(value?.schedule ?? []);
  useEffect(() => setSchedule(value?.schedule ?? []), [value]);

  const mutation = useMutation({
    mutationFn: () => upsertCemeterySection("hours", { schedule }),
    onSuccess: () => toast.success("Salvo."),
    onError: () => toast.error("Erro ao salvar."),
  });

  function update(index: number, field: "day" | "hours", val: string) {
    setSchedule((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: val } : s)));
  }

  return (
    <div className="space-y-4">
      {schedule.map((s, i) => (
        <div key={i} className="flex gap-2">
          <Input
            placeholder="Dia (ex: Seg a Sex)"
            value={s.day}
            onChange={(e) => update(i, "day", e.target.value)}
          />
          <Input
            placeholder="Horário (ex: 8h às 18h)"
            value={s.hours}
            onChange={(e) => update(i, "hours", e.target.value)}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSchedule((prev) => prev.filter((_, idx) => idx !== i))}
          >
            <X className="size-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setSchedule((prev) => [...prev, { day: "", hours: "" }])}
      >
        Adicionar linha
      </Button>
      <div>
        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          Salvar horários
        </Button>
      </div>
    </div>
  );
}

export function CemiterioAdmin() {
  const { data: sections } = useQuery({
    queryKey: ["admin", "cemetery"],
    queryFn: listAllCemeterySectionsAdmin,
  });

  const byKey = Object.fromEntries((sections ?? []).map((s) => [s.section, s.content])) as Record<
    string,
    unknown
  >;

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="font-heading text-2xl text-primary">Cemitério Parque</h1>
        <p className="text-secondary">Todos os blocos da página são editáveis abaixo.</p>
      </div>

      <Tabs defaultValue="history">
        <TabsList>
          <TabsTrigger value="history">História</TabsTrigger>
          <TabsTrigger value="structure">Estrutura</TabsTrigger>
          <TabsTrigger value="gallery">Galeria</TabsTrigger>
          <TabsTrigger value="video">Vídeo</TabsTrigger>
          <TabsTrigger value="drone">Drone</TabsTrigger>
          <TabsTrigger value="location">Localização</TabsTrigger>
          <TabsTrigger value="hours">Horários</TabsTrigger>
        </TabsList>
        <TabsContent value="history">
          <TextBlockTab section="history" label="história" value={byKey.history as TextBlockContent} />
        </TabsContent>
        <TabsContent value="structure">
          <TextBlockTab
            section="structure"
            label="estrutura"
            value={byKey.structure as TextBlockContent}
          />
        </TabsContent>
        <TabsContent value="gallery">
          <GalleryTab value={byKey.gallery as GalleryContent} />
        </TabsContent>
        <TabsContent value="video">
          <VideoTab section="video" label="vídeo" value={byKey.video as VideoContent} />
        </TabsContent>
        <TabsContent value="drone">
          <VideoTab section="drone" label="drone" value={byKey.drone as VideoContent} />
        </TabsContent>
        <TabsContent value="location">
          <LocationTab value={byKey.location as LocationContent} />
        </TabsContent>
        <TabsContent value="hours">
          <HoursTab value={byKey.hours as HoursContent} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
