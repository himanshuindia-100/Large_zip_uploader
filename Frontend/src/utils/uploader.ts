import { retry } from "./backoff";

const CHUNK = 5 * 1024 * 1024;
const MAX = 3;

export async function upload(
  file: File,
  setProgress: any,
  setChunks: any,
  setSpeed: any,
  setEta: any
) {
  try{
  const init = await fetch("http://localhost:4000/init", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name, size: file.size })
  }).then(r => r.json());

  const uploaded = new Set(init.uploadedChunks ?? []);
  const total = Math.ceil(file.size / CHUNK);

  // Initialize chunks
  setChunks(
    Array.from({ length: total }).map((_, i) => ({
      index: i,
      status: uploaded.has(i) ? "SUCCESS" : "PENDING"
    }))
  );

  let completed = uploaded.size;
  let active = 0;
  const startTime = Date.now();

  const queue = [...Array(total).keys()].filter(i => !uploaded.has(i));

  const next = async () => {
    if (!queue.length || active >= MAX) return;
    const i = queue.shift()!;
    active++;

    const chunk = file.slice(i * CHUNK, (i + 1) * CHUNK);

    // Mark uploading
    setChunks((prev: any[]) =>
      prev.map(c => (c.index === i ? { ...c, status: "UPLOADING" } : c))
    );

    try {
      await retry(async () => {
        const res = await fetch("http://localhost:4000/chunk", {
          method: "POST",
          headers: {
            "x-upload-id": init.uploadId,
            "x-index": String(i),
            "x-start": String(i * CHUNK)
          },
          body: chunk
        });
        if (!res.ok) throw new Error("Chunk upload failed");
      });

      completed++;

      // Mark success
      setChunks((prev: any[]) =>
        prev.map(c => (c.index === i ? { ...c, status: "SUCCESS" } : c))
      );

      // Update metrics
      const elapsed = (Date.now() - startTime) / 1000;
      const uploadedBytes = completed * CHUNK;
      const speed = uploadedBytes / elapsed / 1024 / 1024; // MB/s
      const eta = ((total - completed) * CHUNK) / (speed * 1024 * 1024);

      setSpeed(speed.toFixed(2));
      setEta(eta.toFixed(1));
      setProgress(Math.floor((completed / total) * 100));
    } catch {
      // Mark error
      setChunks((prev: any[]) =>
        prev.map(c => (c.index === i ? { ...c, status: "ERROR" } : c))
      );
    } finally {
      active--;
      next();
    }
  };

  for (let j = 0; j < MAX; j++) next();
}
catch(err){
  console.error("Upload failed", err);
  alert("Upload failed: " + (err as Error).message);
}
}
