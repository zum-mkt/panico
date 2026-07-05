import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

export function Testimonial({
  authorName,
  authorPhotoUrl,
  content,
  rating,
  className,
}: {
  authorName: string;
  authorPhotoUrl?: string | null;
  content: string;
  rating?: number | null;
  className?: string;
}) {
  const initials = authorName
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");

  return (
    <Reveal
      variant="fade"
      className={cn("space-y-4 rounded-card border border-border bg-card p-8", className)}
    >
      {rating && (
        <div className="flex gap-0.5 text-accent">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="size-4" fill={i < rating ? "currentColor" : "none"} />
          ))}
        </div>
      )}
      <p className="text-secondary">“{content}”</p>
      <div className="flex items-center gap-3">
        <Avatar>
          {authorPhotoUrl && <AvatarImage src={authorPhotoUrl} alt={authorName} />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <p className="text-sm font-medium text-foreground">{authorName}</p>
      </div>
    </Reveal>
  );
}
