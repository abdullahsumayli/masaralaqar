export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#010409] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="w-48 h-7 rounded bg-gray-700 animate-pulse" />
          <div className="w-32 h-4 rounded bg-gray-700 animate-pulse" />
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#0D1117] border border-[#21262d] rounded-xl p-5 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-gray-700 animate-pulse" />
            <div className="w-12 h-7 rounded bg-gray-700 animate-pulse" />
            <div className="w-20 h-3 rounded bg-gray-700 animate-pulse" />
          </div>
        ))}
      </div>

      {/* Activity */}
      <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-6 space-y-4">
        <div className="w-32 h-5 rounded bg-gray-700 animate-pulse" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-3 border-b border-[#21262d]">
            <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="w-2/3 h-4 rounded bg-gray-700 animate-pulse" />
              <div className="w-1/3 h-3 rounded bg-gray-700 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
