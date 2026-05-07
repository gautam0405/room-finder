import mapImg from "../assets/back.png";

export default function Map() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-12 pt-32 sm:px-6">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
            Room locations
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
            Explore rooms by area
          </h1>
          <p className="mt-3 max-w-2xl text-slate-500">
            Use this map view to understand nearby room availability and popular student locations.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
          <img
            src={mapImg}
            alt="Room finder map"
            className="h-[520px] w-full object-cover object-top"
          />
        </div>
      </section>
    </main>
  );
}
