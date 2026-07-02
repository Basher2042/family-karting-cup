import Link from "next/link";
import { MetricCard } from "@/components/MetricCard";
import { StandingsTable } from "@/components/StandingsTable";
import { championshipData } from "@/data/championship";
import {
  calculateRoundResult,
  calculateStandings,
  calculateStats,
  formatPoints,
} from "@/lib/championship";

export default function Home() {
  const standings = calculateStandings(championshipData);
  const stats = calculateStats(championshipData);
  const hasCompletedRounds = stats.completedRounds > 0;
  const leader = hasCompletedRounds ? standings[0] : undefined;
  const latestRound = stats.latestRound
    ? calculateRoundResult(stats.latestRound, championshipData)
    : undefined;

  return (
    <div className="grid min-w-0 gap-6">
      <section className="grid min-w-0 gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
        <div className="min-w-0 rounded-lg border border-white/10 bg-[#0d0f15] p-5 sm:p-7">
          <p className="text-[0.65rem] font-black uppercase tracking-[0.28em] text-red-400">
            {championshipData.season} season
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-black uppercase leading-[0.92] tracking-normal text-white sm:text-7xl">
            <span className="block">LC</span>
            <span className="block">Karting Cup</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm font-medium leading-6 text-zinc-400 sm:text-base">
            {stats.completedRounds} of {championshipData.totalRounds} rounds completed.
            Best {championshipData.countedRounds} scores count, worst rounds drop.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/standings"
              className="rounded-md bg-red-500 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-white shadow-[0_0_24px_rgba(239,68,68,0.25)] transition hover:bg-red-400"
            >
              Standings
            </Link>
            <Link
              href="/rounds"
              className="rounded-md border border-white/10 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-zinc-200 transition hover:border-white/25 hover:bg-white/5"
            >
              Rounds
            </Link>
          </div>
        </div>

        <section className="min-w-0 rounded-lg border border-red-400/20 bg-gradient-to-br from-red-500/16 to-white/[0.04] p-5 sm:p-7">
          <p className="text-[0.65rem] font-black uppercase tracking-[0.28em] text-red-200">
            Championship leader
          </p>
          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-8xl font-black leading-none text-white">
                {leader ? leader.position : "-"}
              </p>
              {leader ? (
                <h2 className="mt-2 text-3xl font-black uppercase text-white">
                  {leader.driver.name}
                </h2>
              ) : null}
            </div>
            <div className="text-right">
              <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-zinc-400">
                Counted
              </p>
              <p className="text-5xl font-black text-white">
                {leader ? formatPoints(leader.countedPoints) : "0"}
              </p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-2">
            {[
              ["Wins", leader ? String(leader.roundWins) : "0"],
              ["Fastest", leader ? String(leader.fastestLaps) : "0"],
              ["Joker", leader ? (leader.jokerRoundId ? `R${leader.jokerRoundId}` : "Unused") : "-"],
            ].map(([label, value]) => (
              <div key={label} className="min-w-0 rounded-md bg-white/[0.06] p-3">
                <p className="truncate text-[0.55rem] font-black uppercase tracking-[0.12em] text-zinc-500">
                  {label}
                </p>
                <p className="mt-2 truncate text-2xl font-black text-white">{value}</p>
              </div>
            ))}
          </div>
        </section>
      </section>

      <section className="grid min-w-0 gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="min-w-0">
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-zinc-500">
                Current order
              </p>
              <h2 className="text-2xl font-black uppercase text-white">Standings</h2>
            </div>
            <Link
              href="/standings"
              className="text-xs font-black uppercase tracking-[0.18em] text-red-300 hover:text-red-200"
            >
              Full table
            </Link>
          </div>
          <StandingsTable rows={standings} compact />
        </section>

        <div className="grid min-w-0 gap-4">
          <section className="min-w-0 rounded-lg border border-white/10 bg-[#0d0f15] p-5">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-zinc-500">
              Latest round
            </p>
          {latestRound?.winner ? (
              <>
                <h2 className="mt-2 text-3xl font-black uppercase text-white">
                  R{latestRound.round.id} {latestRound.round.venue}
                </h2>
                <p className="mt-2 text-sm font-bold text-zinc-400">
                  Winner:{" "}
                  <span className="text-white">{latestRound.winner.driver.name}</span>,{" "}
                  {formatPoints(latestRound.winner.points)} pts
                </p>
                <p className="mt-1 text-sm font-bold text-zinc-400">
                  Fastest lap:{" "}
                  <span className="text-white">
                    {latestRound.fastestLap
                      ? `${latestRound.fastestLap.driver.name} ${latestRound.fastestLap.lap}`
                      : "No valid lap"}
                  </span>
                </p>
              </>
            ) : (
              <p className="mt-3 text-sm font-medium leading-6 text-zinc-400">
                No completed rounds yet. Results will appear after Round 1 is entered.
              </p>
            )}
          </section>

          <section className="min-w-0 rounded-lg border border-dashed border-white/10 bg-white/[0.035] p-5">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-zinc-500">
              Next round
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase text-white">
              {stats.nextRound?.venue ?? "TBC"}
            </h2>
            <p className="mt-2 text-sm font-bold text-zinc-400">
              {stats.nextRound?.date ?? "Date TBC"}
            </p>
          </section>
        </div>
      </section>

      <section className="min-w-0">
        <div className="mb-3">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-zinc-500">
            Quick stats
          </p>
          <h2 className="text-2xl font-black uppercase text-white">Season awards watch</h2>
        </div>
        <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Most wins"
            value={hasCompletedRounds ? (stats.mostRoundWins?.driver.name ?? "TBC") : "TBD"}
            detail={hasCompletedRounds ? `${stats.mostRoundWins?.roundWins ?? 0} round wins` : "No rounds completed"}
          />
          <MetricCard
            label="Most fastest laps"
            value={hasCompletedRounds ? (stats.mostFastestLaps?.driver.name ?? "TBC") : "TBD"}
            detail={hasCompletedRounds ? `${stats.mostFastestLaps?.fastestLaps ?? 0} session fastest laps` : "No laps recorded"}
          />
          <MetricCard
            label="Best average"
            value={hasCompletedRounds ? (stats.bestAverageScore?.row.driver.name ?? "TBC") : "TBD"}
            detail={hasCompletedRounds ? `${formatPoints(stats.bestAverageScore?.average ?? 0)} pts per round` : "Awaiting Round 1"}
          />
          <MetricCard
            label="Clean driver"
            value={hasCompletedRounds ? (stats.cleanDriver?.driver.name ?? "TBC") : "TBD"}
            detail={hasCompletedRounds ? `${formatPoints(stats.cleanDriver?.penaltyPoints ?? 0)} penalty pts` : "No penalties yet"}
          />
        </div>
      </section>
    </div>
  );
}
