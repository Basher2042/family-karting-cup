import type { ChampionshipData } from "@/lib/types";

export const championshipData: ChampionshipData = {
  name: "Family Karting Cup",
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
    {
      id: 1,
      date: "2026-07-03",
      venue: "Barcelona Indoor Karting",
      status: "upcoming",
      sessions: [],
    },
    { id: 2, status: "upcoming", sessions: [] },
    { id: 3, status: "upcoming", sessions: [] },
    { id: 4, status: "upcoming", sessions: [] },
    { id: 5, status: "upcoming", sessions: [] },
    { id: 6, status: "upcoming", sessions: [] },
    { id: 7, status: "upcoming", sessions: [] },
    { id: 8, status: "upcoming", sessions: [] },
    { id: 9, status: "upcoming", sessions: [] },
    { id: 10, status: "upcoming", sessions: [] },
  ],
};
