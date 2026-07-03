import Link from "next/link";
import { ExpandableAvatar } from "@/components/ExpandableAvatar";
import type { RankedSessionResult } from "@/lib/championship";
import { formatPoints } from "@/lib/championship";
import { cx } from "@/lib/ui";

type SessionTableProps = {
  results: RankedSessionResult[];
};

export function SessionTable({ results }: SessionTableProps) {
  return (
    <div className="w-full max-w-full overflow-x-auto rounded-lg border border-white/10 bg-[#0d0f15]">
      <table className="min-w-[760px] w-full border-collapse text-left text-sm">
        <thead className="bg-white/[0.045] text-[0.62rem] font-black uppercase tracking-[0.18em] text-zinc-500">
          <tr>
            <th className="px-3 py-3">Pos</th>
            <th className="px-3 py-3">Driver</th>
            <th className="px-3 py-3">Fastest lap</th>
            <th className="px-3 py-3 text-right">Session</th>
            <th className="px-3 py-3 text-right">Bonus</th>
            <th className="px-3 py-3 text-right">Penalties</th>
            <th className="px-3 py-3 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={result.driverId} className="border-t border-white/10">
              <td className="px-3 py-4 text-2xl font-black text-white">{result.position}</td>
              <td className="px-3 py-4">
                <div className="flex items-center gap-3">
                  {result.driver.avatar ? (
                    <ExpandableAvatar
                      src={result.driver.avatar}
                      alt={result.driver.name}
                      modalId={`session-avatar-${result.driverId}-${result.position}-${result.fastestLap ?? "no-lap"}`}
                      size="sm"
                    />
                  ) : (
                    <span
                      className="h-8 w-1.5 rounded-full"
                      style={{ backgroundColor: result.driver.color }}
                    />
                  )}
                  <div>
                    <Link
                      href={`/drivers/${result.driver.id}`}
                      className="font-black uppercase text-white transition hover:text-red-200"
                    >
                      {result.driver.name}
                    </Link>
                    <p className="text-xs font-bold text-zinc-500">
                      {result.jokerMultiplier === 2 ? "Joker x2" : "Standard"}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-3 py-4 font-mono text-zinc-200">
                <span
                  className={cx(
                    result.fastestLapDeleted && "text-red-300 line-through",
                    result.disqualified && "text-red-300 line-through",
                  )}
                >
                  {result.fastestLap ?? "No lap"}
                </span>
                {result.isSessionFastest ? (
                  <span className="ml-2 rounded-sm bg-red-500 px-1.5 py-0.5 text-[0.58rem] font-black uppercase tracking-[0.12em] text-white">
                    FL
                  </span>
                ) : null}
                {result.note ? (
                  <p className="mt-1 font-sans text-xs font-bold text-zinc-500">
                    {result.note}
                  </p>
                ) : null}
              </td>
              <td className="px-3 py-4 text-right font-bold text-zinc-300">
                {formatPoints(result.sessionPoints)}
              </td>
              <td className="px-3 py-4 text-right font-bold text-emerald-300">
                {formatPoints(result.bonusPoints)}
              </td>
              <td className="px-3 py-4 text-right">
                <span
                  className={cx(
                    "font-bold",
                    result.penaltyPoints < 0 ? "text-red-300" : "text-zinc-500",
                  )}
                >
                  {formatPoints(result.penaltyPoints)}
                </span>
                {result.penaltyLabels.length > 0 ? (
                  <p className="mt-1 text-xs font-bold text-zinc-500">
                    {result.penaltyLabels.join(", ")}
                  </p>
                ) : null}
              </td>
              <td className="px-3 py-4 text-right text-xl font-black text-white">
                {formatPoints(result.totalPoints)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
