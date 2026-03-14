export default function AdminLoading() {
  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#0D1117] border border-[#21262d] rounded-xl p-4 space-y-2">
            <div className="w-24 h-4 rounded bg-gray-700 animate-pulse" />
            <div className="w-16 h-8 rounded bg-gray-700 animate-pulse" />
          </div>
        ))}
      </div>

      {/* Content area */}
      <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gray-700 animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="w-3/4 h-4 rounded bg-gray-700 animate-pulse" />
              <div className="w-1/2 h-3 rounded bg-gray-700 animate-pulse" />
            </div>
            <div className="w-20 h-6 rounded-full bg-gray-700 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
