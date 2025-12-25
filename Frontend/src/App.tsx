import { useState } from "react";
import { upload } from "./utils/uploader";
import { ProgressBar } from "./components/ProgressBar";
import { ChunkGrid } from "./components/ChunkGrid";
import { FilePicker } from "./components/FilePicker";
import { LiveMetrics } from "./components/metrics";

export default function App() {
  const [progress, setProgress] = useState(0);
  const [chunks, setChunks] = useState<any[]>([]);
  const [speed, setSpeed] = useState("0");
  const [eta, setEta] = useState("0");
  const [file, setFile] = useState<File | null>(null);
  
const handleUpload = () => {
    if (!file) return alert("Select a file first!");
    upload(file, setProgress, setChunks, setSpeed, setEta);
  };

  return (
    <>
    <div className="flex flex-col p-10">
      <FilePicker onPick={setFile}/>
      <div className="pl-170"><button 
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 cursor-pointer "
        onClick={handleUpload}
      ><div className="text-bold">📤 Upload</div></button></div>

      <ProgressBar value={progress} />
      <div className="pl-160">
      <LiveMetrics speed={speed} eta={eta}/>
      </div>
      <ChunkGrid chunks={chunks} />
      </div>
    </>
  );
}
