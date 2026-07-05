export function ComingSoon({ title, doc }: { title: string; doc: string }) {
  return (
    <div className="p-8">
      <h1 className="font-heading text-2xl text-primary">{title}</h1>
      <p className="text-secondary">Módulo em construção — ver {doc}.</p>
    </div>
  );
}
