import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { championshipData } from "@/data/championship";
import {
  formatProfileDate,
  formatProfileShortDate,
  getDriverProfileStats,
  getDriverTimingProfile,
  getSessionsNewestFirst,
} from "@/lib/driverProfiles";
import { formatLapTime } from "@/lib/championship";
import { cx } from "@/lib/ui";

type DriverProfilePageProps = {
  params: Promise<{
    driverId: string;
  }>;
};

export function generateStaticParams() {
  return championshipData.drivers.map((driver) => ({
    driverId: driver.id,
  }));
}

export async function generateMetadata({ params }: DriverProfilePageProps) {
  const { driverId } = await params;
  const driver = championshipData.drivers.find((candidate) => candidate.id === driverId);

  return {
    title: driver ? `${driver.name} profile | LC Karting Cup` : "Driver profile",
  };
}

function statCard(label: string, value: string, detail: string) {
  return (
    <div className="min-w-0 rounded-lg border border-white/10 bg-white/[0.045] p-4">
      <p className="text-[0.6rem] font-black uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </p>
      <p className="mt-2 truncate text-3xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs font-bold text-zinc-500">{detail}</p>
    </div>
  );
}

export default async function DriverProfilePage({ params }: DriverProfilePageProps) {
  const { driverId } = await params;
  const driver = championshipData.drivers.find((candidate) => candidate.id === driverId);

  if (!driver) notFound();

  const profile = getDriverTimingProfile(driver.id);
  const stats = profile ? getDriverProfileStats(profile) : undefined;
  const sessions = profile ? getSessionsNewestFirst(profile) : [];

  return (
    <div className="grid min-w-0 gap-6">
      <section className="grid min-w-0 gap-5 rounded-lg border border-white/10 bg-[#0d0f15] p-5 sm:p-7 lg:grid-cols-[auto_1fr] lg:items-center">
        <div className="flex items-center gap-4">
          {driver.avatar ? (
            <Image
              src={driver.avatar}
              alt={driver.name}
              width={132}
              height={132}
              priority
              className="size-24 rounded-lg border border-white/10 object-cover sm:size-32"
            />
          ) : (
            <div
              className="size-24 rounded-lg border border-white/10 sm:size-32"
              style={{ backgroundColor: driver.color }}
            />
          )}
          <div className="min-w-0 lg:hidden">
            <p className="text-[0.65rem] font-black uppercase tracking-[0.28em] text-red-400">
              Driver profile
            </p>
            <h1 className="mt-2 text-4xl font-black uppercase leading-none text-white">
              {driver.name}
            </h1>
          </div>
        </div>

        <div className="min-w-0">
          <div className="hidden lg:block">
            <p className="text-[0.65rem] font-black uppercase tracking-[0.28em] text-red-400">
              Driver profile
            </p>
            <h1 className="mt-2 text-6xl font-black uppercase leading-none text-white">
              {driver.name}
            </h1>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-sm border border-red-400/30 bg-red-500/10 px-2.5 py-1 text-[0.62rem] font-black uppercase tracking-[0.14em] text-red-200">
              {profile?.racingAlias ?? driver.shortName}
            </span>
            <span className="rounded-sm border border-white/10 px-2.5 py-1 text-[0.62rem] font-black uppercase tracking-[0.14em] text-zinc-400">
              {profile ? `${profile.source.emailCount} timing emails` : "No timing emails"}
            </span>
          </div>
          <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-zinc-400">
            {profile
              ? "Historical timing profile built from indoor karting race-time emails."
              : "Profile shell is ready; historical timing data has not been loaded for this driver yet."}
          </p>
        </div>
      </section>

      {profile && stats ? (
        <>
          <section className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {statCard(
              "Personal best",
              formatLapTime(stats.personalBest.lapMs),
              `${formatProfileShortDate(stats.personalBest.session.dateTime)} · lap ${stats.personalBest.lapNumber}`,
            )}
            {statCard(
              "Sessions",
              String(stats.sessionCount),
              `${stats.totalLaps} historical laps`,
            )}
            {statCard("Wins", String(stats.wins), `${stats.podiums} podium results`)}
            {statCard(
              "Average pace",
              stats.averageSessionLap,
              `${stats.averageBestLap} average best lap`,
            )}
          </section>

          <section className="min-w-0">
            <div className="rounded-lg border border-red-400/20 bg-gradient-to-br from-red-500/16 to-white/[0.04] p-5">
              <p className="text-[0.65rem] font-black uppercase tracking-[0.22em] text-red-200">
                Best historical lap
              </p>
              <p className="mt-4 text-7xl font-black leading-none text-white">
                {formatLapTime(stats.personalBest.lapMs)}
              </p>
              <p className="mt-3 text-sm font-bold text-zinc-300">
                {formatProfileDate(stats.personalBest.session.dateTime)} · Race{" "}
                {stats.personalBest.session.raceNumber} · lap {stats.personalBest.lapNumber}
              </p>
            </div>
          </section>

          <section className="min-w-0">
            <div className="mb-3 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-zinc-500">
                  Historical pace
                </p>
                <h2 className="text-2xl font-black uppercase text-white">Timing history</h2>
              </div>
              <Link
                href="/standings"
                className="text-xs font-black uppercase tracking-[0.18em] text-red-300 hover:text-red-200"
              >
                Standings
              </Link>
            </div>

            <div className="w-full max-w-full overflow-x-auto rounded-lg border border-white/10 bg-[#0d0f15]">
              <table className="min-w-[620px] w-full border-collapse text-left text-sm">
                <thead className="bg-white/[0.045] text-[0.62rem] font-black uppercase tracking-[0.18em] text-zinc-500">
                  <tr>
                    <th className="px-3 py-3">Date</th>
                    <th className="px-3 py-3">Race</th>
                    <th className="px-3 py-3 text-right">Rank</th>
                    <th className="px-3 py-3 text-right">Fastest lap</th>
                    <th className="px-3 py-3 text-right">Avg</th>
                    <th className="px-3 py-3 text-right">Laps</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session) => {
                    const isPersonalBest =
                      session.sourceId === stats.personalBest.session.sourceId;

                    return (
                      <tr key={session.sourceId} className="border-t border-white/10">
                        <td className="px-3 py-3 font-bold text-zinc-300">
                          {formatProfileDate(session.dateTime)}
                        </td>
                        <td className="px-3 py-3 font-black uppercase text-white">
                          Race {session.raceNumber}
                        </td>
                        <td className="px-3 py-3 text-right font-black text-zinc-300">
                          P{session.rank}
                        </td>
                        <td className="px-3 py-3 text-right">
                          <span
                            className={cx(
                              "rounded-sm px-2 py-1 font-black tabular-nums",
                              isPersonalBest
                                ? "bg-red-500 text-white shadow-[0_0_18px_rgba(239,68,68,0.3)]"
                                : "bg-red-500/10 text-red-100",
                            )}
                          >
                            {session.bestLap}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right font-bold tabular-nums text-zinc-400">
                          {session.averageLap}
                        </td>
                        <td className="px-3 py-3 text-right font-bold text-zinc-500">
                          {session.laps.length}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : (
        <section className="rounded-lg border border-dashed border-white/10 bg-white/[0.035] p-5">
          <p className="text-sm font-medium leading-6 text-zinc-400">
            No historical timing data has been loaded for {driver.name}. Once matching Spark
            timing emails are added for this driver, their sessions will appear here.
          </p>
        </section>
      )}
    </div>
  );
}
