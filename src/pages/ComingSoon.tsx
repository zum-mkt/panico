export function ComingSoon({ title, doc }: { title: string; doc: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 p-8 text-center">
      <h1 className="font-heading text-2xl text-primary">{title}</h1>
      <p className="text-secondary">Página em construção — ver {doc}.</p>
    </div>
  );
}
