export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 pb-16 px-4 bg-surface border-b border-border">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="w-20 h-6 rounded-full bg-gray-200 animate-pulse mx-auto" />
          <div className="w-80 h-12 rounded-lg bg-gray-200 animate-pulse mx-auto" />
          <div className="w-64 h-5 rounded bg-gray-200 animate-pulse mx-auto" />
          <div className="flex justify-center gap-3 pt-4">
            <div className="w-36 h-12 rounded-xl bg-primary/20 animate-pulse" />
            <div className="w-36 h-12 rounded-xl bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-6">
            <div className="w-40 h-6 rounded bg-gray-200 animate-pulse" />
            <div className="grid md:grid-cols-3 gap-5">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="border border-border rounded-2xl p-6 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-200 animate-pulse" />
                  <div className="w-32 h-5 rounded bg-gray-200 animate-pulse" />
                  <div className="space-y-2">
                    <div className="w-full h-4 rounded bg-gray-200 animate-pulse" />
                    <div className="w-4/5 h-4 rounded bg-gray-200 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
