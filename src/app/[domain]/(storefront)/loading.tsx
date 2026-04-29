export default function StorefrontLoading() {
  return (
    <div className="min-h-screen bg-[#f7f4ee] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-slate-950 shadow-[0_30px_80px_rgba(15,23,42,0.16)]">
          <div className="h-[68svh] bg-[linear-gradient(135deg,_rgba(255,255,255,0.05),_rgba(255,255,255,0)),radial-gradient(circle_at_top,_rgba(245,158,11,0.24),_transparent_42%)]" />
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/90 shadow-sm"
            >
              <div className="aspect-[4/5] bg-gradient-to-br from-slate-200 via-slate-100 to-slate-50" />
              <div className="space-y-4 p-6">
                <div className="h-2 w-24 rounded-full bg-slate-200" />
                <div className="h-6 w-3/4 rounded-full bg-slate-200" />
                <div className="h-4 w-1/2 rounded-full bg-slate-200" />
                <div className="h-12 rounded-full bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
