import {
  driverTimingProfiles,
  type DriverTimingProfile,
  type DriverTimingSession,
} from "@/data/driverProfiles";
import { formatLapTime, parseLapTime } from "@/lib/championship";

export type DriverProfileStats = {
  sessionCount: number;
  totalLaps: number;
  wins: number;
  podiums: number;
  personalBest: {
    session: DriverTimingSession;
    lapNumber: number;
    lapMs: number;
  };
  latestSession: DriverTimingSession;
  averageBestLap: string;
  averageSessionLap: string;
};

function lapMs(lap: string) {
  const ms = parseLapTime(lap);
  if (ms === null) {
    throw new Error(`Invalid lap time in driver profile data: ${lap}`);
  }
  return ms;
}

function averageMs(values: number[]) {
  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
}

export function getDriverTimingProfile(driverId: string) {
  return driverTimingProfiles[driverId];
}

export function getDriverTimingProfiles() {
  return Object.values(driverTimingProfiles);
}

export function getSessionsNewestFirst(profile: DriverTimingProfile) {
  return [...profile.sessions].sort((a, b) => b.dateTime.localeCompare(a.dateTime));
}

export function getDriverProfileStats(profile: DriverTimingProfile): DriverProfileStats {
  const allLaps = profile.sessions.flatMap((session) =>
    session.laps.map((lap, index) => ({
      session,
      lapNumber: index + 1,
      lapMs: lapMs(lap),
    })),
  );

  if (allLaps.length === 0) {
    throw new Error(`Driver profile has no laps: ${profile.driverId}`);
  }

  const personalBest = allLaps.reduce((best, candidate) =>
    candidate.lapMs < best.lapMs ? candidate : best,
  );

  const latestSession = getSessionsNewestFirst(profile)[0];

  return {
    sessionCount: profile.sessions.length,
    totalLaps: allLaps.length,
    wins: profile.sessions.filter((session) => session.rank === 1).length,
    podiums: profile.sessions.filter((session) => session.rank <= 3).length,
    personalBest,
    latestSession,
    averageBestLap: formatLapTime(
      averageMs(profile.sessions.map((session) => lapMs(session.bestLap))),
    ),
    averageSessionLap: formatLapTime(
      averageMs(profile.sessions.map((session) => lapMs(session.averageLap))),
    ),
  };
}

export function formatProfileDate(dateTime: string) {
  const [date, time] = dateTime.split(" ");
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year} ${time}`;
}

export function formatProfileShortDate(dateTime: string) {
  const [date] = dateTime.split(" ");
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}
