import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Share2 } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { getPostBySlug, listPublishedPosts } from "@/services/blogService";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" });

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [shareCopied, setShareCopied] = useState(false);

  const { data: post } = useQuery({
    queryKey: ["blog", slug],
    queryFn: () => getPostBySlug(slug!),
    enabled: !!slug,
  });
  const { data: allPosts } = useQuery({
    queryKey: ["blog", "public"],
    queryFn: listPublishedPosts,
  });

  const related = useMemo(() => {
    if (!post || !allPosts) return [];
    return allPosts
      .filter((p) => p.id !== post.id && p.category === post.category)
      .slice(0, 3);
  }, [post, allPosts]);

  if (!post) return null;

  const pageUrl = window.location.href;
  const seoTitle = post.seo_title || post.title;
  const seoDescription = post.seo_description || post.excerpt || undefined;

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({ title: post!.title, url: pageUrl });
      return;
    }
    await navigator.clipboard.writeText(pageUrl);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  }

  return (
    <main className="mx-auto max-w-3xl space-y-10 px-6 py-24">
      <Seo
        title={seoTitle}
        description={seoDescription}
        image={post.cover_image_url ?? undefined}
        type="article"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            image: post.cover_image_url ? [post.cover_image_url] : undefined,
            datePublished: post.published_at,
            dateModified: post.updated_at,
            author: post.author_name ? [{ "@type": "Person", name: post.author_name }] : undefined,
          })}
        </script>
      </Helmet>

      <Reveal className="space-y-3 text-center">
        {post.category && (
          <p className="text-xs font-medium tracking-wide text-accent uppercase">
            {post.category}
          </p>
        )}
        <h1 className="font-heading text-3xl text-primary md:text-4xl">{post.title}</h1>
        <p className="text-sm text-secondary">
          {post.author_name && `${post.author_name} · `}
          {post.published_at && dateFormatter.format(new Date(post.published_at))}
        </p>
        <Button variant="outline" onClick={handleShare}>
          <Share2 className="size-4" />
          {shareCopied ? "Link copiado!" : "Compartilhar"}
        </Button>
      </Reveal>

      {post.cover_image_url && (
        <Reveal variant="scale" className="overflow-hidden rounded-card">
          <img src={post.cover_image_url} alt={post.title} className="w-full object-cover" />
        </Reveal>
      )}

      {post.content && (
        <Reveal>
          {/* Conteúdo gerado pelo editor TipTap no admin — ver 11-BLOG.md. */}
          <div
            className="prose prose-neutral max-w-none prose-headings:font-heading prose-headings:text-primary"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </Reveal>
      )}

      {!!post.tags.length && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs text-secondary">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {!!related.length && (
        <section className="space-y-6 border-t border-border pt-10">
          <h2 className="font-heading text-xl text-primary">Artigos relacionados</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {related.map((r) => (
              <Link key={r.id} to={`/blog/${r.slug}`} className="space-y-2">
                {r.cover_image_url && (
                  <img
                    src={r.cover_image_url}
                    alt={r.title}
                    className="aspect-video w-full rounded-card object-cover"
                  />
                )}
                <p className="font-heading text-sm text-primary">{r.title}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
