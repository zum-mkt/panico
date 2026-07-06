import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Seo } from "@/components/seo/Seo";
import { Search } from "lucide-react";
import { listPublishedPosts } from "@/services/blogService";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { Reveal } from "@/components/ui/reveal";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" });

export function Blog() {
  const { data: posts } = useQuery({ queryKey: ["blog", "public"], queryFn: listPublishedPosts });
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("todas");

  const categories = useMemo(() => {
    const set = new Set<string>();
    posts?.forEach((p) => p.category && set.add(p.category));
    return Array.from(set);
  }, [posts]);

  const filtered = useMemo(() => {
    if (!posts) return [];
    return posts
      .filter((p) => category === "todas" || p.category === category)
      .filter((p) => p.title.toLowerCase().includes(query.toLowerCase()));
  }, [posts, query, category]);

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-6 py-24">
      <Seo
        title="Blog"
        description="Conteúdos sobre luto, planejamento funerário e acolhimento da Funerária Paníco."
      />

      <SectionTitle eyebrow="Blog" title="Conteúdos para acolher e informar" align="left" className="mx-0" />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-secondary" />
          <Input
            placeholder="Buscar artigos…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        {categories.length > 0 && (
          <Tabs value={category} onValueChange={setCategory}>
            <TabsList>
              <TabsTrigger value="todas">Todas</TabsTrigger>
              {categories.map((cat) => (
                <TabsTrigger key={cat} value={cat}>
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="text-secondary">Nenhum artigo encontrado.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {filtered.map((post, i) => (
            <Reveal
              key={post.id}
              delay={i * 0.05}
              hover
              className="overflow-hidden rounded-card border border-border bg-card"
            >
              <Link to={`/blog/${post.slug}`} className="block">
                {post.cover_image_url && (
                  <img
                    src={post.cover_image_url}
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    className="aspect-video w-full object-cover"
                  />
                )}
                <div className="space-y-2 p-6">
                  {post.category && (
                    <p className="text-xs font-medium tracking-wide text-accent uppercase">
                      {post.category}
                    </p>
                  )}
                  <h2 className="font-heading text-lg text-primary">{post.title}</h2>
                  {post.excerpt && <p className="text-sm text-secondary">{post.excerpt}</p>}
                  {post.published_at && (
                    <p className="text-xs text-secondary">
                      {dateFormatter.format(new Date(post.published_at))}
                    </p>
                  )}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </main>
  );
}
