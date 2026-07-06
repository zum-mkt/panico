import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { blogPostsCrud, listAllPostsAdmin } from "@/services/blogService";
import type { BlogPost } from "@/types/blogPost";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PostForm, type PostFormValues } from "./PostForm";

function toPayload(
  values: PostFormValues & { content: string; cover_image_url: string | null },
  authorId?: string,
  authorName?: string,
) {
  return {
    ...values,
    tags: values.tags
      ? values.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
    published_at: values.published_at || null,
    author_id: authorId ?? null,
    author_name: authorName ?? null,
  };
}

export function BlogAdmin() {
  const queryClient = useQueryClient();
  const { profile } = useAuth();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);

  const { data: posts } = useQuery({ queryKey: ["admin", "posts"], queryFn: listAllPostsAdmin });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "posts"] });

  const createMutation = useMutation({
    mutationFn: (values: PostFormValues & { content: string; cover_image_url: string | null }) =>
      blogPostsCrud.create(toPayload(values, profile?.id, profile?.name)),
    onSuccess: () => {
      toast.success("Artigo criado.");
      invalidate();
      setFormOpen(false);
    },
    onError: () => toast.error("Erro ao criar artigo (verifique se o slug já existe)."),
  });

  const updateMutation = useMutation({
    mutationFn: (values: PostFormValues & { content: string; cover_image_url: string | null }) =>
      blogPostsCrud.update(editing!.id, toPayload(values, editing?.author_id ?? profile?.id, editing?.author_name ?? profile?.name)),
    onSuccess: () => {
      toast.success("Artigo atualizado.");
      invalidate();
      setFormOpen(false);
    },
    onError: () => toast.error("Erro ao atualizar artigo."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => blogPostsCrud.remove(id),
    onSuccess: () => {
      toast.success("Artigo removido.");
      invalidate();
    },
  });

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(p: BlogPost) {
    setEditing(p);
    setFormOpen(true);
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl text-primary">Blog</h1>
          <p className="text-secondary">Gerencie os artigos publicados no site.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" /> Novo artigo
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(posts ?? []).map((post) => (
            <TableRow key={post.id}>
              <TableCell>{post.title}</TableCell>
              <TableCell>{post.category || "—"}</TableCell>
              <TableCell>
                <Badge variant={post.status === "published" ? "default" : "secondary"}>
                  {post.status === "published" ? "Publicado" : "Rascunho"}
                </Badge>
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button size="icon-sm" variant="ghost" onClick={() => openEdit(post)}>
                  <Pencil className="size-4" />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => {
                    if (confirm(`Remover "${post.title}"?`)) deleteMutation.mutate(post.id);
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PostForm
        open={formOpen}
        onOpenChange={setFormOpen}
        post={editing}
        submitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={(values) => (editing ? updateMutation.mutate(values) : createMutation.mutate(values))}
      />
    </div>
  );
}
