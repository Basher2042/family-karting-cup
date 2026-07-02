# LC Karting Cup

Mobile-first Next.js app for a static, manually updated karting championship.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
```

This app is Vercel-ready and uses the Next.js App Router with local static data only.

## Update race results

Edit the data file:

```text
src/data/championship.ts
```

Each completed round has three `session(...)` blocks. Add one `entry(...)` per driver:

```ts
session("r10-1", [
  entry("driver-1", "45.231"),
  entry("driver-2", "45.588"),
  entry("driver-3", "46.102"),
  entry("driver-4", "46.490"),
]),
session("r10-2", [
  entry("driver-1", "44.980"),
  entry("driver-2", "45.101"),
  entry("driver-3", "45.777"),
  entry("driver-4", "46.020"),
]),
session("r10-3", [
  entry("driver-2", "44.850"),
  entry("driver-1", "45.010"),
  entry("driver-3", "45.500"),
  entry("driver-4", "45.810"),
]),
```

Then change the round status:

```ts
status: "completed",
```

The app automatically calculates:

- session position points
- fastest-lap bonus
- penalties
- Joker multiplier
- event total
- best 8 counted rounds
- dropped rounds
- championship standings
- quick stats and awards

## Add penalties

Pass penalty codes as the third `entry(...)` argument:

```ts
entry("driver-2", "43.940", ["avoidableContact"])
entry("driver-1", "44.704", ["causingSpin"])
entry("driver-3", "44.222", ["dangerousDriving"], "Session disqualification")
entry("driver-4", "44.040", ["repeatedTrackLimits"], "Fastest lap deleted")
```

Available penalty codes:

- `avoidableContact`
- `causingSpin`
- `dangerousDriving`
- `ignoredMarshal`
- `repeatedTrackLimits`

## Declare a Joker

Add the driver id to the round:

```ts
jokerDriverIds: ["driver-2"],
```

A Joker doubles session points, fastest-lap bonus, and penalties for that driver in that round.

## Debug scoring

```bash
npm run debug:scoring
```

This checks dropped rounds, Joker doubling, doubled Joker penalties, disqualification, and fastest-lap deletion.
