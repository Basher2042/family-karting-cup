type MetricCardProps = {
  label: string;
  value: string;
  detail?: string;
};

export function MetricCard({ label, value, detail }: MetricCardProps) {
  return (
    <section className="min-w-0 rounded-lg border border-white/10 bg-white/[0.045] p-4 shadow-[0_12px_36px_rgba(0,0,0,0.22)]">
      <p className="truncate text-[0.64rem] font-black uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black tracking-normal text-white">{value}</p>
      {detail ? <p className="mt-1 text-sm font-medium text-zinc-400">{detail}</p> : null}
    </section>
  );
}
