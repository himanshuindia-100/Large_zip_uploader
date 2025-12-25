type FilePickerProps = {
  onPick: (file: File) => void;
};

export function FilePicker({ onPick }: FilePickerProps) {
  return (
    <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition
                      border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400">
      
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onPick(file);
        }}
      />

      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-sm font-medium text-gray-700 pr-29 pt-5">
          Click to select a ZIP file
        </span>
        <span className="text-xs text-gray-500 pr-29">
          Large files supported (even up to 1GB+)
        </span>
      </div>
    </label>
  );
}
