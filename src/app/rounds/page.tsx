import { PageHeader } from "@/components/PageHeader";
import { RoundCard } from "@/components/RoundCard";
import { championshipData } from "@/data/championship";
import { calculateRoundResult } from "@/lib/championship";

export default function RoundsPage() {
  const results = championshipData.rounds.map((round) =>
    calculateRoundResult(round, championshipData),
  );

  return (
    <div>
      <PageHeader
        title="Rounds"
        meta={`${championshipData.totalRounds} round calendar`}
        copy="Each round card is generated from the same local data used for the championship table."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {results.map((result) => (
          <RoundCard key={result.round.id} result={result} />
        ))}
      </div>
    </div>
  );
}
