import { ExpandableAvatar } from "@/components/ExpandableAvatar";
import type { StandingRow } from "@/lib/championship";
import { formatPoints } from "@/lib/championship";
import { cx } from "@/lib/ui";

type StandingsTableProps = {
  rows: StandingRow[];
  compact?: boolean;
};

export function StandingsTable({ rows, compact = false }: StandingsTableProps) {
  return (
    <div className="w-full max-w-full overflow-x-auto rounded-lg border border-white/10 bg-[#0d0f15]">
      <table className="min-w-[780px] w-full border-collapse text-left text-sm">
        <thead className="bg-white/[0.045] text-[0.62rem] font-black uppercase tracking-[0.18em] text-zinc-500">
          <tr>
            <th className="px-3 py-3">Pos</th>
            <th className="px-3 py-3">Driver</th>
            <th className="px-3 py-3 text-right">Total</th>
            <th className="px-3 py-3 text-right">Counted</th>
            {!compact ? <th className="px-3 py-3 text-right">Dropped</th> : null}
            <th className="px-3 py-3 text-right">Wins</th>
            <th className="px-3 py-3 text-right">Fastest</th>
            {!compact ? <th className="px-3 py-3 text-right">Penalties</th> : null}
            {!compact ? <th className="px-3 py-3">Dropped rounds</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.driver.id} className="border-t border-white/10">
              <td className="px-3 py-4">
                <span className="text-3xl font-black leading-none text-white">
                  {row.position}
                </span>
              </td>
              <td className="px-3 py-4">
                <div className="flex items-center gap-3">
                  {row.driver.avatar ? (
                    <ExpandableAvatar
                      src={row.driver.avatar}
                      alt={row.driver.name}
                      modalId={`standings-avatar-${row.driver.id}`}
                      size="md"
                    />
                  ) : (
                    <span
                      className="h-9 w-1.5 rounded-full"
                      style={{ backgroundColor: row.driver.color }}
                    />
                  )}
                  <div>
                    <p className="font-black uppercase text-white">{row.driver.name}</p>
                    <p className="text-xs font-bold text-zinc-500">
                      {row.jokerRoundId
                        ? `Joker R${row.jokerRoundId}`
                        : "Joker unused"}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-3 py-4 text-right font-black text-zinc-300">
                {formatPoints(row.totalPoints)}
              </td>
              <td className="px-3 py-4 text-right text-xl font-black text-white">
                {formatPoints(row.countedPoints)}
              </td>
              {!compact ? (
                <td className="px-3 py-4 text-right font-black text-zinc-400">
                  {formatPoints(row.droppedPoints)}
                </td>
              ) : null}
              <td className="px-3 py-4 text-right font-bold text-zinc-300">
                {row.roundWins}
              </td>
              <td className="px-3 py-4 text-right font-bold text-zinc-300">
                {row.fastestLaps}
              </td>
              {!compact ? (
                <td
                  className={cx(
                    "px-3 py-4 text-right font-bold",
                    row.penaltyPoints < 0 ? "text-red-300" : "text-emerald-300",
                  )}
                >
                  {formatPoints(row.penaltyPoints)}
                </td>
              ) : null}
              {!compact ? (
                <td className="px-3 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {row.droppedRoundIds.length > 0 ? (
                      row.droppedRoundIds.map((roundId) => (
                        <span
                          key={roundId}
                          className="rounded-sm border border-red-400/30 bg-red-500/10 px-2 py-1 text-[0.62rem] font-black uppercase tracking-[0.12em] text-red-200 line-through"
                        >
                          R{roundId}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs font-bold text-zinc-600">None yet</span>
                    )}
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
