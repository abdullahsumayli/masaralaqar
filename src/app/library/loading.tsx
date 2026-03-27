export default function LibraryLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="py-20 px-4 bg-surface border-b border-border">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="w-20 h-6 rounded-full bg-[#162444] animate-pulse mx-auto" />
          <div className="w-56 h-10 rounded-lg bg-[#162444] animate-pulse mx-auto" />
          <div className="w-64 h-5 rounded bg-[#162444] animate-pulse mx-auto" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Filter tabs */}
        <div className="flex gap-3 mb-10">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-20 h-9 rounded-full bg-[#162444] animate-pulse" />
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#111E35] border border-[rgba(37,211,102,0.12)] rounded-2xl overflow-hidden">
              <div className="h-44 bg-[#162444] animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="w-16 h-5 rounded-full bg-[#162444] animate-pulse" />
                <div className="w-3/4 h-5 rounded bg-[#162444] animate-pulse" />
                <div className="w-full h-4 rounded bg-[#162444] animate-pulse" />
                <div className="w-28 h-10 rounded-lg bg-primary/20 animate-pulse mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
