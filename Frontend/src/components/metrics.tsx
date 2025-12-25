type LiveMetricsProps = {
  speed: string;
  eta: string;
};

export function LiveMetrics({ speed, eta }: LiveMetricsProps) {
  return (
    <div className="flex items-center gap-6 text-sm text-gray-700 mt-2">
      
      {/* Speed */}
      <div className="flex items-baseline gap-1">
        <span className="font-semibold text-gray-900">
          {speed}
        </span>
        <span className="text-gray-500">MB/s</span>
      </div>

      {/* Divider */}
      <span className="text-gray-300">|</span>

      {/* ETA */}
      <div className="flex items-baseline gap-1">
        ETA:
        <span className="font-semibold text-gray-900">
          {eta}s
        </span>
        <span className="text-gray-500">remaining</span>
      </div>
    </div>
  );
}