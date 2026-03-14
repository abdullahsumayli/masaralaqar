export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="h-16 md:h-20 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container-custom flex items-center justify-between h-full">
          <div className="flex items-center gap-2">
            <div className="w-11 h-11 rounded-lg bg-[#162444] animate-pulse" />
            <div className="w-24 h-5 rounded bg-[#162444] animate-pulse" />
          </div>
          <div className="hidden md:flex items-center gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-16 h-4 rounded bg-[#162444] animate-pulse" />
            ))}
          </div>
          <div className="w-24 h-10 rounded-lg bg-primary/20 animate-pulse" />
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="w-48 h-8 rounded-full bg-[#162444] animate-pulse mx-auto" />
          <div className="w-full max-w-xl h-12 rounded-lg bg-[#162444] animate-pulse mx-auto" />
          <div className="w-full max-w-lg h-6 rounded bg-[#162444] animate-pulse mx-auto" />
          <div className="flex justify-center gap-4 pt-4">
            <div className="w-40 h-12 rounded-xl bg-primary/20 animate-pulse" />
            <div className="w-36 h-12 rounded-xl bg-[#162444] animate-pulse" />
          </div>
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-surface border border-border rounded-2xl p-6 space-y-4">
              <div className="w-14 h-14 rounded-xl bg-[#162444] animate-pulse" />
              <div className="w-28 h-5 rounded bg-[#162444] animate-pulse" />
              <div className="w-full h-4 rounded bg-[#162444] animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
