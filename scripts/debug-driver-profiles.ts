import { driverTimingProfiles } from "../src/data/driverProfiles";
import {
  getDriverProfileStats,
  getSessionsNewestFirst,
} from "../src/lib/driverProfiles";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const bashProfile = driverTimingProfiles.bash;
assert(bashProfile, "Bash timing profile missing");

const stats = getDriverProfileStats(bashProfile);
const sessions = getSessionsNewestFirst(bashProfile);

assert(stats.sessionCount === 22, "Bash profile should include 22 Spark sessions");
assert(stats.totalLaps === 205, "Bash profile should include 205 historical laps");
assert(stats.personalBest.session.sourceId === 75429, "Unexpected Bash PB source email");
assert(stats.personalBest.lapNumber === 8, "Unexpected Bash PB lap number");
assert(stats.personalBest.session.bestLap === "42.378", "Unexpected Bash PB time");
assert(sessions[0].sourceId === 132656, "Newest Spark session should be message 132656");
assert(sessions.at(-1)?.sourceId === 7709, "Oldest Spark session should be message 7709");
assert(
  bashProfile.sessions.every((session) => session.sourceId && session.laps.length > 0),
  "Every Spark timing session needs a source ID and lap list",
);

console.log(
  [
    "Driver profile debug passed",
    `sessions=${stats.sessionCount}`,
    `laps=${stats.totalLaps}`,
    `pb=${stats.personalBest.session.bestLap}`,
    `pbSource=${stats.personalBest.session.sourceId}`,
  ].join(" | "),
);
