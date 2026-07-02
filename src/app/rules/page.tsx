import { PageHeader } from "@/components/PageHeader";

const scoringRows = [
  ["1st", "10"],
  ["2nd", "8"],
  ["3rd", "6"],
  ["4th", "5"],
  ["5th", "4"],
  ["6th", "3"],
  ["7th", "2"],
  ["8th or lower", "1"],
];

const penaltyRows = [
  ["Avoidable contact", "-2 points"],
  ["Causing a spin", "-5 points"],
  ["Dangerous driving", "Session disqualification"],
  ["Ignoring marshal instructions", "Session disqualification"],
  ["Repeated track limits", "Fastest lap deleted"],
];

export default function RulesPage() {
  return (
    <div>
      <PageHeader
        title="Rules"
        meta="Family Karting Cup"
        copy="The site calculates standings directly from these scoring rules."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-white/10 bg-[#0d0f15] p-5">
          <h2 className="text-xl font-black uppercase text-white">Format</h2>
          <ul className="mt-4 grid gap-2 text-sm font-medium leading-6 text-zinc-400">
            <li>10 rounds total.</li>
            <li>Each round has 3 sessions.</li>
            <li>Each session is 12 minutes.</li>
            <li>Results are ranked by fastest lap in each session.</li>
            <li>The round winner is the driver with the highest session total.</li>
            <li>The champion is highest on counted points after 10 rounds.</li>
          </ul>
        </section>

        <section className="rounded-lg border border-white/10 bg-[#0d0f15] p-5">
          <h2 className="text-xl font-black uppercase text-white">Session scoring</h2>
          <div className="mt-4 overflow-hidden rounded-md border border-white/10">
            <table className="w-full border-collapse text-sm">
              <tbody>
                {scoringRows.map(([position, points]) => (
                  <tr key={position} className="border-t border-white/10 first:border-t-0">
                    <td className="px-3 py-2 font-black uppercase text-white">{position}</td>
                    <td className="px-3 py-2 text-right font-bold text-red-300">
                      {points} pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm font-medium leading-6 text-zinc-400">
            Fastest lap of the session earns +1 bonus point.
          </p>
        </section>

        <section className="rounded-lg border border-white/10 bg-[#0d0f15] p-5">
          <h2 className="text-xl font-black uppercase text-white">Championship</h2>
          <ul className="mt-4 grid gap-2 text-sm font-medium leading-6 text-zinc-400">
            <li>Best 8 rounds count.</li>
            <li>Worst 2 rounds are dropped.</li>
            <li>A missed completed round scores 0 and can be dropped.</li>
            <li>Future rounds do not count until marked completed.</li>
          </ul>
        </section>

        <section className="rounded-lg border border-white/10 bg-[#0d0f15] p-5">
          <h2 className="text-xl font-black uppercase text-white">Joker rule</h2>
          <ul className="mt-4 grid gap-2 text-sm font-medium leading-6 text-zinc-400">
            <li>Each driver gets one Joker round for the season.</li>
            <li>The Joker must be declared before the first session.</li>
            <li>That round scores double points for that driver.</li>
            <li>Bonus points and penalties are doubled during a Joker round.</li>
            <li>Each driver can only use the Joker once.</li>
          </ul>
        </section>

        <section className="rounded-lg border border-white/10 bg-[#0d0f15] p-5">
          <h2 className="text-xl font-black uppercase text-white">Penalties</h2>
          <div className="mt-4 overflow-hidden rounded-md border border-white/10">
            <table className="w-full border-collapse text-sm">
              <tbody>
                {penaltyRows.map(([penalty, result]) => (
                  <tr key={penalty} className="border-t border-white/10 first:border-t-0">
                    <td className="px-3 py-2 font-black uppercase text-white">{penalty}</td>
                    <td className="px-3 py-2 text-right font-bold text-red-300">
                      {result}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-lg border border-white/10 bg-[#0d0f15] p-5">
          <h2 className="text-xl font-black uppercase text-white">Tie-breaks</h2>
          <ol className="mt-4 grid list-decimal gap-2 pl-5 text-sm font-medium leading-6 text-zinc-400">
            <li>Most round wins.</li>
            <li>Most fastest laps.</li>
            <li>Best finish in the final completed round.</li>
          </ol>
          <h3 className="mt-6 text-sm font-black uppercase tracking-[0.2em] text-white">
            Optional awards
          </h3>
          <p className="mt-2 text-sm font-medium leading-6 text-zinc-400">
            Champion, Most Wins, Fastest Lap Trophy, Clean Driver Award, and Most
            Improved Driver.
          </p>
        </section>
      </div>
    </div>
  );
}
