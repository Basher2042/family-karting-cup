import { championshipData } from "../src/data/championship";
import {
  calculateRoundResult,
  calculateStandings,
  calculateStats,
  getCompletedRounds,
} from "../src/lib/championship";
import type { ChampionshipData, ChampionshipRound } from "../src/lib/types";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function testResetSeason() {
  const standings = calculateStandings(championshipData);
  const completedRounds = getCompletedRounds(championshipData);
  const stats = calculateStats(championshipData);

  assert(completedRounds.length === 0, "Live season should have no completed rounds");
  assert(stats.nextRound?.id === 1, "Round 1 should be the next round");
  assert(
    stats.nextRound.venue === "Barcelona Indoor Karting",
    "Round 1 venue should be Barcelona Indoor Karting",
  );
  assert(stats.nextRound.date === "2026-07-03", "Round 1 date should be 2026-07-03");
  assert(
    standings.every((row) => row.totalPoints === 0 && row.countedPoints === 0),
    "Reset standings should all be zero",
  );
  assert(
    standings.map((row) => row.driver.name).join(",") === "Aajay,Bash,Callum,Sanna",
    "Reset standings should sort drivers alphabetically",
  );
}

function fixtureRound(
  id: number,
  sessions: ChampionshipRound["sessions"],
  jokerDriverIds?: string[],
): ChampionshipRound {
  return {
    id,
    status: "completed",
    sessions,
    jokerDriverIds,
  };
}

const rulesFixture: ChampionshipData = {
  name: "Rules Fixture",
  season: "2026",
  totalRounds: 10,
  countedRounds: 8,
  drivers: [
    { id: "bash", name: "Bash", shortName: "BAS", color: "#ef4444" },
    { id: "callum", name: "Callum", shortName: "CAL", color: "#f59e0b" },
    { id: "aajay", name: "Aajay", shortName: "AAJ", color: "#22c55e" },
    { id: "sanna", name: "Sanna", shortName: "SAN", color: "#38bdf8" },
  ],
  rounds: [
    fixtureRound(
      1,
      [
        {
          id: "r1-1",
          name: "Session 1",
          entries: [
            { driverId: "bash", fastestLap: "44.100" },
            { driverId: "callum", fastestLap: "44.220" },
            { driverId: "aajay", fastestLap: "44.500" },
            { driverId: "sanna", fastestLap: "44.900" },
          ],
        },
        {
          id: "r1-2",
          name: "Session 2",
          entries: [
            { driverId: "callum", fastestLap: "43.900", penalties: ["avoidableContact"] },
            { driverId: "bash", fastestLap: "44.010" },
            { driverId: "aajay", fastestLap: "44.300" },
            { driverId: "sanna", fastestLap: "44.700" },
          ],
        },
        {
          id: "r1-3",
          name: "Session 3",
          entries: [
            { driverId: "aajay", fastestLap: "43.800" },
            { driverId: "bash", fastestLap: "44.050" },
            { driverId: "sanna", fastestLap: "44.200" },
            {
              driverId: "callum",
              fastestLap: "43.700",
              penalties: ["repeatedTrackLimits"],
              note: "Fastest lap deleted",
            },
          ],
        },
      ],
      ["callum"],
    ),
    fixtureRound(2, [
      {
        id: "r2-1",
        name: "Session 1",
        entries: [
          { driverId: "bash", fastestLap: "44.000" },
          { driverId: "callum", fastestLap: "44.100" },
          { driverId: "aajay", fastestLap: "44.200", penalties: ["dangerousDriving"] },
          { driverId: "sanna", fastestLap: "44.300" },
        ],
      },
    ]),
    ...Array.from({ length: 7 }, (_, index) =>
      fixtureRound(index + 3, [
        {
          id: `r${index + 3}-1`,
          name: "Session 1",
          entries: [
            { driverId: "bash", fastestLap: (44 + index / 100).toFixed(3) },
            { driverId: "callum", fastestLap: (44.1 + index / 100).toFixed(3) },
            { driverId: "aajay", fastestLap: (44.2 + index / 100).toFixed(3) },
            { driverId: "sanna", fastestLap: (44.3 + index / 100).toFixed(3) },
          ],
        },
      ]),
    ),
    { id: 10, status: "upcoming", sessions: [] },
  ],
};

function testRulesFixture() {
  const standings = calculateStandings(rulesFixture);
  const completedRounds = getCompletedRounds(rulesFixture);

  assert(standings.length === rulesFixture.drivers.length, "Every driver must rank");
  assert(completedRounds.length === 9, "Fixture should have 9 completed rounds");

  for (const row of standings) {
    assert(
      row.countedRoundIds.length <= rulesFixture.countedRounds,
      `${row.driver.name} has too many counted rounds`,
    );
    assert(row.droppedRoundIds.length === 1, `${row.driver.name} should drop 1 round`);
  }

  const round1 = rulesFixture.rounds.find((round) => round.id === 1);
  assert(round1, "Fixture Round 1 missing");
  const round1Result = calculateRoundResult(round1, rulesFixture);
  const jokerPenalty = round1Result.sessions[1].results.find(
    (result) => result.driverId === "callum",
  );
  assert(jokerPenalty?.jokerMultiplier === 2, "Joker was not applied");
  assert(jokerPenalty.penaltyPoints === -4, "Joker penalty was not doubled");

  const deletedLap = round1Result.sessions[2].results.find(
    (result) => result.driverId === "callum",
  );
  assert(deletedLap?.fastestLapDeleted === true, "Track-limits lap deletion missing");
  assert(deletedLap.validLapMs === null, "Deleted fastest lap should not be valid");

  const round2 = rulesFixture.rounds.find((round) => round.id === 2);
  assert(round2, "Fixture Round 2 missing");
  const round2Result = calculateRoundResult(round2, rulesFixture);
  const disqualified = round2Result.sessions[0].results.find(
    (result) => result.driverId === "aajay",
  );
  assert(disqualified?.disqualified === true, "DQ penalty was not detected");
  assert(disqualified.totalPoints === 0, "DQ session should score zero");
}

testResetSeason();
testRulesFixture();

const standings = calculateStandings(championshipData);
console.log(
  [
    "Scoring debug passed",
    `drivers=${standings.map((row) => row.driver.name).join(",")}`,
    `completedRounds=${getCompletedRounds(championshipData).length}`,
    `nextRound=${calculateStats(championshipData).nextRound?.venue}`,
  ].join(" | "),
);
