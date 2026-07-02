type PageHeaderProps = {
  title: string;
  copy?: string;
  meta?: string;
};

export function PageHeader({ title, copy, meta }: PageHeaderProps) {
  return (
    <section className="mb-6 border-b border-white/10 pb-5">
      {meta ? (
        <p className="mb-2 text-[0.65rem] font-black uppercase tracking-[0.28em] text-red-400">
          {meta}
        </p>
      ) : null}
      <h1 className="max-w-3xl text-4xl font-black uppercase leading-[0.95] tracking-normal text-white sm:text-6xl">
        {title}
      </h1>
      {copy ? (
        <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-zinc-400 sm:text-base">
          {copy}
        </p>
      ) : null}
    </section>
  );
}
