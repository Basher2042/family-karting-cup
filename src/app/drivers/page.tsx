import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { championshipData } from "@/data/championship";
import {
  formatProfileShortDate,
  getDriverProfileStats,
  getDriverTimingProfile,
} from "@/lib/driverProfiles";

export const metadata = {
  title: "Drivers | LC Karting Cup",
};

export default function DriversPage() {
  return (
    <div>
      <PageHeader
        title="Driver profiles"
        meta={`${championshipData.drivers.length} championship drivers`}
        copy="Each profile tracks championship context and any loaded historical timing data."
      />

      <section className="grid min-w-0 gap-3 sm:grid-cols-2">
        {championshipData.drivers.map((driver) => {
          const profile = getDriverTimingProfile(driver.id);
          const stats = profile ? getDriverProfileStats(profile) : undefined;

          return (
            <Link
              key={driver.id}
              href={`/drivers/${driver.id}`}
              className="group grid min-w-0 gap-4 rounded-lg border border-white/10 bg-[#0d0f15] p-4 transition hover:border-red-400/40 hover:bg-white/[0.055] sm:grid-cols-[auto_1fr]"
            >
              {driver.avatar ? (
                <Image
                  src={driver.avatar}
                  alt={driver.name}
                  width={88}
                  height={88}
                  className="size-20 rounded-lg border border-white/10 object-cover"
                />
              ) : (
                <div
                  className="size-20 rounded-lg border border-white/10"
                  style={{ backgroundColor: driver.color }}
                />
              )}
              <div className="min-w-0">
                <p className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-red-300">
                  {profile?.racingAlias ?? driver.shortName}
                </p>
                <h2 className="mt-1 text-2xl font-black uppercase text-white group-hover:text-red-100">
                  {driver.name}
                </h2>
                <p className="mt-2 text-sm font-medium leading-6 text-zinc-400">
                  {stats
                    ? `${stats.sessionCount} sessions, ${stats.totalLaps} laps, PB ${stats.personalBest.session.bestLap} on ${formatProfileShortDate(stats.personalBest.session.dateTime)}.`
                    : "Profile shell ready. No historical timing emails loaded yet."}
                </p>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
