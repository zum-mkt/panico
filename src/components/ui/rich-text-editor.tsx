import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Heading2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Editor de texto rico (TipTap) — ver 03-ADMIN_CMS.md e 11-BLOG.md.
 * Componente reutilizável para qualquer conteúdo administrável em HTML.
 */
export function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-neutral max-w-none min-h-40 focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  const buttons = [
    {
      icon: Bold,
      label: "Negrito",
      isActive: editor.isActive("bold"),
      onClick: () => editor.chain().focus().toggleBold().run(),
    },
    {
      icon: Italic,
      label: "Itálico",
      isActive: editor.isActive("italic"),
      onClick: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      icon: Heading2,
      label: "Título",
      isActive: editor.isActive("heading", { level: 2 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      icon: List,
      label: "Lista",
      isActive: editor.isActive("bulletList"),
      onClick: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      icon: ListOrdered,
      label: "Lista numerada",
      isActive: editor.isActive("orderedList"),
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
    },
  ];

  return (
    <div className="rounded-md border border-input">
      <div className="flex gap-1 border-b border-input p-1">
        {buttons.map(({ icon: Icon, label, isActive, onClick }) => (
          <Button
            key={label}
            type="button"
            variant="ghost"
            size="icon-sm"
            className={cn(isActive && "bg-muted")}
            onClick={onClick}
            aria-label={label}
          >
            <Icon className="size-4" />
          </Button>
        ))}
      </div>
      <div className="px-3 py-2">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
