export default function AuthLoading() {
  return (
    <div className="min-h-screen bg-[#010409] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-8 space-y-5">
          <div className="text-center space-y-3 mb-2">
            <div className="w-36 h-6 rounded bg-[#21262d] animate-pulse mx-auto" />
            <div className="w-48 h-4 rounded bg-[#21262d] animate-pulse mx-auto" />
          </div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="w-28 h-4 rounded bg-[#21262d] animate-pulse" />
              <div className="w-full h-12 rounded-xl bg-[#21262d] animate-pulse" />
            </div>
          ))}
          <div className="w-full h-12 rounded-xl bg-primary/20 animate-pulse mt-2" />
        </div>
      </div>
    </div>
  )
}
