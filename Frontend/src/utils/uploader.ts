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
  const init = await fetch("http://localhost:4000/init", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name, size: file.size })
  }).then(r => r.json());

  const uploaded = new Set(init.uploadedChunks ?? []);
  const totalChunks = Math.ceil(file.size / CHUNK);

  setChunks(
    Array.from({ length: totalChunks }).map((_, i) => ({
      index: i,
      status: uploaded.has(i) ? "SUCCESS" : "PENDING"
    }))
  );

  let completed = uploaded.size;
  let pointer = 0;
  const startTime = Date.now();

  async function worker() {
    while (true) {
      const i = pointer++;
      if (i >= totalChunks) return;
      if (uploaded.has(i)) continue;

      setChunks((prev: any[]) =>
        prev.map(c =>
          c.index === i ? { ...c, status: "UPLOADING" } : c
        )
      );

      const chunk = file.slice(i * CHUNK, (i + 1) * CHUNK);

      try {
        let flag=0;
        await retry(async () => {
    try {
      const res = await fetch("http://localhost:4000/chunk", {
        method: "POST",
        headers: {
          "x-upload-id": init.uploadId,
          "x-index": String(i),
          "x-start": String(i * CHUNK)
        },
        body: chunk
      });

      if (!res.ok) {
        throw new Error("Server error");
      }
    } catch (err) {
      // NETWORK FAILURE OR FETCH FAILURE
      flag=1;
      setChunks((prev: any[]) =>
        prev.map(c =>
          c.index === i ? { ...c, status: "ERROR" } : c
        )
      );
      throw err; 
    }
  });

        completed++;
if(flag===0){
        setChunks((prev: any[]) =>
          prev.map(c =>
            c.index === i ? { ...c, status: "SUCCESS" } : c
          )
        );
      }
        const elapsed = (Date.now() - startTime) / 1000;
        const uploadedBytes = Math.min(
          completed * CHUNK,
          file.size
        );

        const speed =
          uploadedBytes / elapsed / 1024 / 1024;

        const eta =
          speed > 0
            ? (file.size - uploadedBytes) / (speed * 1024 * 1024)
            : 0;

        setSpeed(speed.toFixed(2));
        setEta(eta.toFixed(1));
        setProgress(Math.floor((uploadedBytes / file.size) * 100));
      } catch {
        setChunks((prev: any[]) =>
          prev.map(c =>
            c.index === i ? { ...c, status: "ERROR" } : c
          )
        );
      }
    }
  }

  await Promise.all(
    Array.from({ length: MAX }).map(() => worker())
  );
}
