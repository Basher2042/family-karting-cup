import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { SessionTable } from "@/components/SessionTable";
import { championshipData } from "@/data/championship";
import { calculateRoundResult, formatPoints } from "@/lib/championship";

type RoundDetailPageProps = {
  params: Promise<{
    roundId: string;
  }>;
};

export function generateStaticParams() {
  return championshipData.rounds.map((round) => ({
    roundId: String(round.id),
  }));
}

export default async function RoundDetailPage({ params }: RoundDetailPageProps) {
  const { roundId } = await params;
  const round = championshipData.rounds.find(
    (candidate) => candidate.id === Number(roundId),
  );

  if (!round) notFound();

  const result = calculateRoundResult(round, championshipData);

  return (
    <div>
      <PageHeader
        title={`Round ${round.id}`}
        meta={round.status}
        copy={`${round.venue ?? "Venue TBC"}${round.date ? ` - ${round.date}` : ""}`}
      />

      {round.status === "upcoming" ? (
        <section className="rounded-lg border border-dashed border-white/10 bg-white/[0.035] p-6">
          <h2 className="text-2xl font-black uppercase text-white">Awaiting results</h2>
          <p className="mt-2 text-sm font-medium leading-6 text-zinc-400">
            Add three sessions for this round in the local championship data file and
            the points, fastest laps, Joker multiplier, and standings will update.
          </p>
        </section>
      ) : (
        <div className="grid min-w-0 gap-6">
          <section className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {result.standings.map((standing, index) => (
              <div
                key={standing.driverId}
                className="min-w-0 rounded-lg border border-white/10 bg-[#0d0f15] p-4"
              >
                <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-zinc-500">
                  P{index + 1}
                </p>
                <h2 className="mt-2 text-2xl font-black uppercase text-white">
                  {standing.driver.name}
                </h2>
                <p className="mt-1 text-lg font-black text-red-300">
                  {formatPoints(standing.points)} pts
                </p>
              </div>
            ))}
          </section>

          <section className="min-w-0 rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">
              Event total
            </h2>
            <div className="mt-4 w-full max-w-full overflow-x-auto">
              <table className="min-w-[520px] w-full border-collapse text-sm">
                <thead className="text-left text-[0.62rem] font-black uppercase tracking-[0.18em] text-zinc-500">
                  <tr>
                    <th className="py-2 pr-3">Driver</th>
                    <th className="py-2 pr-3 text-right">Points</th>
                    <th className="py-2 pr-3 text-right">Fastest laps</th>
                    <th className="py-2 text-right">Penalties</th>
                  </tr>
                </thead>
                <tbody>
                  {result.standings.map((standing) => (
                    <tr key={standing.driverId} className="border-t border-white/10">
                      <td className="py-3 pr-3 font-black uppercase text-white">
                        {standing.driver.name}
                      </td>
                      <td className="py-3 pr-3 text-right font-black text-white">
                        {formatPoints(standing.points)}
                      </td>
                      <td className="py-3 pr-3 text-right font-bold text-zinc-300">
                        {standing.fastestLaps}
                      </td>
                      <td className="py-3 text-right font-bold text-red-300">
                        {formatPoints(standing.penaltyPoints)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {result.sessions.map(({ session, results }) => (
            <section key={session.id} className="min-w-0">
              <div className="mb-3 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-zinc-500">
                    Ranked by fastest lap
                  </p>
                  <h2 className="text-2xl font-black uppercase text-white">
                    {session.name}
                  </h2>
                </div>
              </div>
              <SessionTable results={results} />
            </section>
          ))}
        </div>
      )}

      <Link
        href="/rounds"
        className="mt-6 inline-flex rounded-md border border-white/10 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-zinc-200 transition hover:border-white/25 hover:bg-white/5"
      >
        Back to rounds
      </Link>
    </div>
  );
}
