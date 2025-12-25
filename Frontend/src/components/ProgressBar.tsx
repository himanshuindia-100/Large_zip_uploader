type ProgressBarProps = {
  value: number;
  uploadedBytes?: number;
  totalBytes?: number;
};

export function ProgressBar({
  value,
  uploadedBytes,
  totalBytes,
}: ProgressBarProps) {
  return (
    <div className="w-full space-y-1">
      {/* Progress text */}
      <div className="flex justify-between text-base pl-4 font-bold text-gray-600">
        <span>{Math.floor(value)}%</span>

        {uploadedBytes !== undefined && totalBytes !== undefined && (
          <span>
            {(uploadedBytes / 1024 / 1024).toFixed(0)} MB /{" "}
            {(totalBytes / 1024 / 1024).toFixed(0)} MB
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full h-8 rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-300 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
