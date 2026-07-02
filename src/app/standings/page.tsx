import { PageHeader } from "@/components/PageHeader";
import { StandingsTable } from "@/components/StandingsTable";
import { championshipData } from "@/data/championship";
import { calculateStandings, getCompletedRounds } from "@/lib/championship";

export default function StandingsPage() {
  const standings = calculateStandings(championshipData);
  const completedRounds = getCompletedRounds(championshipData);

  return (
    <div>
      <PageHeader
        title="Championship standings"
        meta={`${completedRounds.length}/${championshipData.totalRounds} rounds complete`}
        copy={`Best ${championshipData.countedRounds} rounds count toward the title. Dropped rounds are struck through in the table.`}
      />
      <StandingsTable rows={standings} />
      <section className="mt-5 rounded-lg border border-white/10 bg-white/[0.04] p-4">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">
          Counted round rule
        </h2>
        <p className="mt-2 text-sm font-medium leading-6 text-zinc-400">
          {`Current standings ignore future rounds. Once more than ${championshipData.countedRounds} completed rounds exist, each driver's lowest completed scores become dropped rounds automatically.`}
        </p>
      </section>
    </div>
  );
}
