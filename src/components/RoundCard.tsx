import Link from "next/link";
import type { RoundResult } from "@/lib/championship";
import { formatPoints } from "@/lib/championship";
import { cx } from "@/lib/ui";

type RoundCardProps = {
  result: RoundResult;
};

export function RoundCard({ result }: RoundCardProps) {
  const round = result.round;
  const completed = round.status === "completed";

  return (
    <Link
      href={`/rounds/${round.id}`}
      className="group block rounded-lg border border-white/10 bg-[#0d0f15] p-4 transition hover:-translate-y-0.5 hover:border-red-400/40 hover:bg-white/[0.06]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.65rem] font-black uppercase tracking-[0.22em] text-red-400">
            Round {round.id}
          </p>
          <h2 className="mt-1 text-xl font-black uppercase text-white">
            {round.venue ?? "Venue TBC"}
          </h2>
          <p className="mt-1 text-sm font-bold text-zinc-500">{round.date ?? "Date TBC"}</p>
        </div>
        <span
          className={cx(
            "rounded-sm px-2.5 py-1 text-[0.62rem] font-black uppercase tracking-[0.14em]",
            completed
              ? "bg-emerald-400/10 text-emerald-300"
              : "bg-zinc-500/10 text-zinc-400",
          )}
        >
          {completed ? "Completed" : "Upcoming"}
        </span>
      </div>

      {completed && result.winner ? (
        <div className="mt-5 grid gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
              Winner
            </p>
            <p className="mt-1 text-3xl font-black text-white">{result.winner.driver.name}</p>
            <p className="text-sm font-bold text-zinc-400">
              {formatPoints(result.winner.points)} pts
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {result.topThree.map((standing, index) => (
              <div key={standing.driverId} className="rounded-md bg-white/[0.045] p-3">
                <p className="text-[0.6rem] font-black uppercase tracking-[0.16em] text-zinc-500">
                  P{index + 1}
                </p>
                <p className="mt-1 font-black text-white">{standing.driver.shortName}</p>
                <p className="text-xs font-bold text-zinc-500">
                  {formatPoints(standing.points)}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs font-bold text-zinc-500">
            Fastest lap:{" "}
            <span className="text-zinc-200">
              {result.fastestLap
                ? `${result.fastestLap.driver.name} ${result.fastestLap.lap}`
                : "No valid lap"}
            </span>
          </p>
        </div>
      ) : (
        <div className="mt-8 rounded-md border border-dashed border-white/10 p-4 text-sm font-bold text-zinc-500">
          Results will appear here after all three sessions are entered.
        </div>
      )}
    </Link>
  );
}
