export type RoundStatus = "completed" | "upcoming";

export type PenaltyCode =
  | "avoidableContact"
  | "causingSpin"
  | "dangerousDriving"
  | "ignoredMarshal"
  | "repeatedTrackLimits";

export type Driver = {
  id: string;
  name: string;
  shortName: string;
  color: string;
  avatar?: string;
};

export type SessionEntry = {
  driverId: string;
  fastestLap?: string;
  penalties?: PenaltyCode[];
  note?: string;
};

export type RoundSession = {
  id: string;
  name: string;
  entries: SessionEntry[];
};

export type ChampionshipRound = {
  id: number;
  date?: string;
  venue?: string;
  status: RoundStatus;
  jokerDriverIds?: string[];
  sessions: RoundSession[];
};

export type ChampionshipData = {
  name: string;
  season: string;
  totalRounds: number;
  countedRounds: number;
  drivers: Driver[];
  rounds: ChampionshipRound[];
};
