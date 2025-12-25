type Chunk = {
  index: number
  status: "PENDING" | "UPLOADING" | "SUCCESS" | "ERROR"
}

export function ChunkGrid({ chunks }: { chunks: Chunk[] }) {

  if (!chunks.length) return null;

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">
        Chunk Upload Map
      </h3>

      <div className="grid grid-cols-10 gap-2">
        {chunks.map((c: any) => (
          <div
            key={c.index}
            className={`
              h-9 flex items-center justify-center text-xs font-semibold
              rounded border shadow-sm
              ${
                c.status === "PENDING"
                  ? "bg-gray-300 text-gray-700"
                  : c.status === "UPLOADING"
                  ? "bg-blue-500 text-white animate-pulse"
                  : c.status === "SUCCESS"
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }
            `}
          >
            {c.index}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-700">
        <Legend color="bg-gray-300" label="Pending" />
        <Legend color="bg-blue-500" label="Uploading" />
        <Legend color="bg-green-500" label="Success" />
        <Legend color="bg-red-500" label="Error" />
      </div>
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-4 h-4 rounded ${color} border`} />
      <span>{label}</span>
    </div>
  )
}
