export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="py-20 px-4 bg-surface border-b border-border">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="w-24 h-6 rounded-full bg-[#162444] animate-pulse mx-auto" />
          <div className="w-64 h-10 rounded-lg bg-[#162444] animate-pulse mx-auto" />
          <div className="w-80 h-5 rounded bg-[#162444] animate-pulse mx-auto" />
        </div>
      </div>

      {/* Posts grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-[#111E35] border border-[rgba(37,211,102,0.12)] rounded-2xl overflow-hidden"
            >
              <div className="h-48 bg-[#162444] animate-pulse" />
              <div className="p-6 space-y-3">
                <div className="w-20 h-5 rounded-full bg-[#162444] animate-pulse" />
                <div className="w-full h-6 rounded bg-[#162444] animate-pulse" />
                <div className="w-4/5 h-4 rounded bg-[#162444] animate-pulse" />
                <div className="w-3/5 h-4 rounded bg-[#162444] animate-pulse" />
                <div className="flex justify-between pt-2">
                  <div className="w-16 h-4 rounded bg-[#162444] animate-pulse" />
                  <div className="w-16 h-4 rounded bg-[#162444] animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
