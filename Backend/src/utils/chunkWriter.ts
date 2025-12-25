import fs from "fs";

export function writeChunk(
  path: string,
  stream: NodeJS.ReadableStream,
  start: number
) {
  return new Promise<void>(resolve => {
    const ws = fs.createWriteStream(path, { flags: "r+", start });
    stream.pipe(ws);
    ws.on("close", resolve);
  });
}
