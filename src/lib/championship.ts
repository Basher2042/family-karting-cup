import type {
  ChampionshipData,
  ChampionshipRound,
  Driver,
  PenaltyCode,
  RoundSession,
  SessionEntry,
} from "@/lib/types";

export const sessionPointScale = [10, 8, 6, 5, 4, 3, 2];

export const penaltyDefinitions: Record<
  PenaltyCode,
  {
    label: string;
    points: number;
    disqualifies?: boolean;
    deletesFastestLap?: boolean;
  }
> = {
  avoidableContact: { label: "Avoidable contact", points: -2 },
  causingSpin: { label: "Causing a spin", points: -5 },
  dangerousDriving: {
    label: "Dangerous driving",
    points: 0,
    disqualifies: true,
  },
  ignoredMarshal: {
    label: "Ignoring marshal instructions",
    points: 0,
    disqualifies: true,
  },
  repeatedTrackLimits: {
    label: "Repeated track limits",
    points: 0,
    deletesFastestLap: true,
  },
};

export type RankedSessionResult = {
  driver: Driver;
  driverId: string;
  position: number;
  fastestLap?: string;
  lapMs: number | null;
  validLapMs: number | null;
  penalties: PenaltyCode[];
  penaltyLabels: string[];
  disqualified: boolean;
  fastestLapDeleted: boolean;
  isSessionFastest: boolean;
  jokerMultiplier: 1 | 2;
  baseSessionPoints: number;
  sessionPoints: number;
  bonusPoints: number;
  penaltyPoints: number;
  totalPoints: number;
  note?: string;
};

export type RoundStanding = {
  driver: Driver;
  driverId: string;
  points: number;
  fastestLaps: number;
  penaltyPoints: number;
};

export type RoundFastestLap = {
  driver: Driver;
  lap: string;
  lapMs: number;
  sessionName: string;
};

export type RoundResult = {
  round: ChampionshipRound;
  status: ChampionshipRound["status"];
  sessions: {
    session: RoundSession;
    results: RankedSessionResult[];
  }[];
  standings: RoundStanding[];
  winner?: RoundStanding;
  topThree: RoundStanding[];
  fastestLap?: RoundFastestLap;
};

export type DriverRoundScore = {
  roundId: number;
  points: number;
  dropped: boolean;
  status: ChampionshipRound["status"];
};

export type StandingRow = {
  position: number;
  driver: Driver;
  totalPoints: number;
  countedPoints: number;
  droppedPoints: number;
  roundWins: number;
  fastestLaps: number;
  penaltyPoints: number;
  jokerRoundId?: number;
  roundScores: DriverRoundScore[];
  countedRoundIds: number[];
  droppedRoundIds: number[];
  finalRoundPosition?: number;
};

export type ChampionshipStats = {
  completedRounds: number;
  nextRound?: ChampionshipRound;
  latestRound?: ChampionshipRound;
  mostRoundWins?: StandingRow;
  mostFastestLaps?: StandingRow;
  bestAverageScore?: { row: StandingRow; average: number };
  cleanDriver?: StandingRow;
  mostImproved?: { row: StandingRow; change: number };
};

export function scoreForPosition(position: number) {
  return sessionPointScale[position - 1] ?? 1;
}

export function parseLapTime(lap?: string) {
  if (!lap) return null;

  const trimmed = lap.trim();
  if (!trimmed) return null;

  if (trimmed.includes(":")) {
    const [minutes, seconds] = trimmed.split(":");
    return Math.round(
      Number(minutes) * 60_000 + Number.parseFloat(seconds) * 1_000,
    );
  }

  return Math.round(Number.parseFloat(trimmed) * 1_000);
}

export function formatLapTime(ms: number | null) {
  if (ms === null) return "No valid lap";

  const minutes = Math.floor(ms / 60_000);
  const seconds = (ms - minutes * 60_000) / 1_000;

  if (minutes > 0) {
    return `${minutes}:${seconds.toFixed(3).padStart(6, "0")}`;
  }

  return seconds.toFixed(3);
}

export function formatPoints(points: number) {
  return Number.isInteger(points) ? String(points) : points.toFixed(1);
}

export function getDriver(data: ChampionshipData, driverId: string) {
  const driver = data.drivers.find((candidate) => candidate.id === driverId);
  if (!driver) {
    throw new Error(`Unknown driver: ${driverId}`);
  }
  return driver;
}

type PenaltyFlag = "disqualifies" | "deletesFastestLap";

function hasPenalty(entry: SessionEntry, predicate: PenaltyFlag) {
  return entry.penalties?.some((penalty) => penaltyDefinitions[penalty][predicate]) ?? false;
}

function isDisqualified(entry: SessionEntry) {
  return hasPenalty(entry, "disqualifies");
}

function hasDeletedFastestLap(entry: SessionEntry) {
  return hasPenalty(entry, "deletesFastestLap");
}

function penaltyPoints(entry: SessionEntry) {
  return (entry.penalties ?? []).reduce(
    (total, penalty) => total + penaltyDefinitions[penalty].points,
    0,
  );
}

export function rankSessionEntries(session: RoundSession) {
  return [...session.entries]
    .map((entry) => {
      const lapMs = parseLapTime(entry.fastestLap);
      const validLapMs =
        lapMs !== null && !isDisqualified(entry) && !hasDeletedFastestLap(entry)
          ? lapMs
          : null;

      return {
        entry,
        lapMs,
        validLapMs,
      };
    })
    .sort((a, b) => {
      if (a.validLapMs !== null && b.validLapMs !== null) {
        return a.validLapMs - b.validLapMs;
      }

      if (a.validLapMs !== null) return -1;
      if (b.validLapMs !== null) return 1;

      return (a.lapMs ?? Number.POSITIVE_INFINITY) - (b.lapMs ?? Number.POSITIVE_INFINITY);
    })
    .map((ranked, index) => ({
      ...ranked,
      position: index + 1,
    }));
}

export function calculateSessionResults(
  session: RoundSession,
  round: ChampionshipRound,
  data: ChampionshipData,
): RankedSessionResult[] {
  const rankedEntries = rankSessionEntries(session);
  const sessionFastestDriverId = rankedEntries.find(
    (ranked) => ranked.validLapMs !== null,
  )?.entry.driverId;

  return rankedEntries.map(({ entry, lapMs, validLapMs, position }) => {
    const driver = getDriver(data, entry.driverId);
    const penalties = entry.penalties ?? [];
    const disqualified = isDisqualified(entry);
    const fastestLapDeleted = hasDeletedFastestLap(entry);
    const jokerMultiplier = round.jokerDriverIds?.includes(entry.driverId) ? 2 : 1;
    const baseSessionPoints = disqualified ? 0 : scoreForPosition(position);
    const isSessionFastest =
      !disqualified &&
      !fastestLapDeleted &&
      validLapMs !== null &&
      entry.driverId === sessionFastestDriverId;
    const rawBonusPoints = isSessionFastest ? 1 : 0;
    const rawPenaltyPoints = penaltyPoints(entry);
    const sessionPoints = baseSessionPoints * jokerMultiplier;
    const bonusPoints = rawBonusPoints * jokerMultiplier;
    const appliedPenaltyPoints = rawPenaltyPoints * jokerMultiplier;

    return {
      driver,
      driverId: entry.driverId,
      position,
      fastestLap: entry.fastestLap,
      lapMs,
      validLapMs,
      penalties,
      penaltyLabels: penalties.map((penalty) => penaltyDefinitions[penalty].label),
      disqualified,
      fastestLapDeleted,
      isSessionFastest,
      jokerMultiplier,
      baseSessionPoints,
      sessionPoints,
      bonusPoints,
      penaltyPoints: appliedPenaltyPoints,
      totalPoints: disqualified
        ? 0
        : sessionPoints + bonusPoints + appliedPenaltyPoints,
      note: entry.note,
    };
  });
}

export function calculateRoundResult(
  round: ChampionshipRound,
  data: ChampionshipData,
): RoundResult {
  const totals = new Map(
    data.drivers.map((driver) => [
      driver.id,
      {
        driver,
        driverId: driver.id,
        points: 0,
        fastestLaps: 0,
        penaltyPoints: 0,
      },
    ]),
  );

  const sessions = round.sessions.map((session) => {
    const results = calculateSessionResults(session, round, data);

    results.forEach((result) => {
      const total = totals.get(result.driverId);
      if (!total) return;
      total.points += result.totalPoints;
      total.fastestLaps += result.isSessionFastest ? 1 : 0;
      total.penaltyPoints += result.penaltyPoints;
    });

    return { session, results };
  });

  const standings = [...totals.values()].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.fastestLaps !== a.fastestLaps) return b.fastestLaps - a.fastestLaps;
    return a.driver.name.localeCompare(b.driver.name);
  });

  const allValidLaps = sessions
    .flatMap(({ session, results }) =>
      results
        .filter((result) => result.validLapMs !== null)
        .map((result) => ({
          driver: result.driver,
          lap: result.fastestLap ?? formatLapTime(result.validLapMs),
          lapMs: result.validLapMs ?? 0,
          sessionName: session.name,
        })),
    )
    .sort((a, b) => a.lapMs - b.lapMs);

  const isCompleted = round.status === "completed" && round.sessions.length > 0;

  return {
    round,
    status: round.status,
    sessions,
    standings,
    winner: isCompleted ? standings[0] : undefined,
    topThree: isCompleted ? standings.slice(0, 3) : [],
    fastestLap: allValidLaps[0],
  };
}

export function getCompletedRounds(data: ChampionshipData) {
  return data.rounds.filter((round) => round.status === "completed");
}

export function getLatestRound(data: ChampionshipData) {
  return getCompletedRounds(data).at(-1);
}

export function getNextRound(data: ChampionshipData) {
  return data.rounds.find((round) => round.status === "upcoming");
}

export function calculateStandings(data: ChampionshipData): StandingRow[] {
  const completedRounds = getCompletedRounds(data);
  const roundResults = completedRounds.map((round) => calculateRoundResult(round, data));
  const latestRoundResult = roundResults.at(-1);

  const rows = data.drivers.map((driver) => {
    const completedScores = roundResults.map((roundResult) => {
      const standing = roundResult.standings.find(
        (roundStanding) => roundStanding.driverId === driver.id,
      );

      return {
        roundId: roundResult.round.id,
        points: standing?.points ?? 0,
        dropped: false,
        status: roundResult.round.status,
      };
    });

    const countedScores = [...completedScores]
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        return a.roundId - b.roundId;
      })
      .slice(0, data.countedRounds);
    const countedRoundIds = countedScores.map((score) => score.roundId);
    const countedRoundIdSet = new Set(countedRoundIds);
    const roundScores = completedScores.map((score) => ({
      ...score,
      dropped: !countedRoundIdSet.has(score.roundId),
    }));
    const droppedRoundIds = roundScores
      .filter((score) => score.dropped)
      .map((score) => score.roundId);
    const jokerRoundId = data.rounds.find((round) =>
      round.jokerDriverIds?.includes(driver.id),
    )?.id;
    const latestRoundStandingIndex = latestRoundResult?.standings.findIndex(
      (standing) => standing.driverId === driver.id,
    );

    return {
      position: 0,
      driver,
      totalPoints: completedScores.reduce((total, score) => total + score.points, 0),
      countedPoints: roundScores
        .filter((score) => !score.dropped)
        .reduce((total, score) => total + score.points, 0),
      droppedPoints: roundScores
        .filter((score) => score.dropped)
        .reduce((total, score) => total + score.points, 0),
      roundWins: roundResults.filter((roundResult) => roundResult.winner?.driverId === driver.id)
        .length,
      fastestLaps: roundResults.reduce((total, roundResult) => {
        const roundStanding = roundResult.standings.find(
          (standing) => standing.driverId === driver.id,
        );
        return total + (roundStanding?.fastestLaps ?? 0);
      }, 0),
      penaltyPoints: roundResults.reduce((total, roundResult) => {
        const roundStanding = roundResult.standings.find(
          (standing) => standing.driverId === driver.id,
        );
        return total + (roundStanding?.penaltyPoints ?? 0);
      }, 0),
      jokerRoundId,
      roundScores,
      countedRoundIds,
      droppedRoundIds,
      finalRoundPosition:
        latestRoundStandingIndex !== undefined && latestRoundStandingIndex >= 0
          ? latestRoundStandingIndex + 1
          : undefined,
    };
  });

  return rows
    .sort((a, b) => {
      if (b.countedPoints !== a.countedPoints) return b.countedPoints - a.countedPoints;
      if (b.roundWins !== a.roundWins) return b.roundWins - a.roundWins;
      if (b.fastestLaps !== a.fastestLaps) return b.fastestLaps - a.fastestLaps;
      const finalRoundTieBreak =
        (a.finalRoundPosition ?? 999) - (b.finalRoundPosition ?? 999);
      if (finalRoundTieBreak !== 0) return finalRoundTieBreak;
      return a.driver.name.localeCompare(b.driver.name);
    })
    .map((row, index) => ({ ...row, position: index + 1 }));
}

export function calculateStats(data: ChampionshipData): ChampionshipStats {
  const standings = calculateStandings(data);
  const completedRounds = getCompletedRounds(data);

  const byAverage = standings
    .map((row) => ({
      row,
      average: completedRounds.length > 0 ? row.totalPoints / completedRounds.length : 0,
    }))
    .sort((a, b) => b.average - a.average);

  const byImprovement = standings
    .map((row) => {
      const firstThree = row.roundScores.slice(0, 3);
      const lastThree = row.roundScores.slice(-3);
      const firstAverage =
        firstThree.reduce((total, score) => total + score.points, 0) /
        Math.max(firstThree.length, 1);
      const lastAverage =
        lastThree.reduce((total, score) => total + score.points, 0) /
        Math.max(lastThree.length, 1);

      return { row, change: lastAverage - firstAverage };
    })
    .sort((a, b) => b.change - a.change);

  return {
    completedRounds: completedRounds.length,
    nextRound: getNextRound(data),
    latestRound: getLatestRound(data),
    mostRoundWins: [...standings].sort((a, b) => b.roundWins - a.roundWins)[0],
    mostFastestLaps: [...standings].sort((a, b) => b.fastestLaps - a.fastestLaps)[0],
    bestAverageScore: byAverage[0],
    cleanDriver: [...standings].sort((a, b) => b.penaltyPoints - a.penaltyPoints)[0],
    mostImproved: byImprovement[0],
  };
}
