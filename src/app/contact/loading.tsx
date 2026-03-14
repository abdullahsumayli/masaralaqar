export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="py-20 px-4 bg-surface border-b border-border">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="w-20 h-6 rounded-full bg-[#162444] animate-pulse mx-auto" />
          <div className="w-64 h-10 rounded-lg bg-[#162444] animate-pulse mx-auto" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Form skeleton */}
          <div className="lg:col-span-2 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="w-20 h-4 rounded bg-[#162444] animate-pulse" />
                  <div className="w-full h-11 rounded-xl bg-[#162444] animate-pulse" />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="w-20 h-4 rounded bg-[#162444] animate-pulse" />
              <div className="w-full h-32 rounded-xl bg-[#162444] animate-pulse" />
            </div>
            <div className="w-36 h-12 rounded-xl bg-primary/20 animate-pulse" />
          </div>

          {/* Info cards skeleton */}
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border border-border rounded-2xl p-5 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#162444] animate-pulse" />
                <div className="w-24 h-4 rounded bg-[#162444] animate-pulse" />
                <div className="w-36 h-4 rounded bg-[#162444] animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
