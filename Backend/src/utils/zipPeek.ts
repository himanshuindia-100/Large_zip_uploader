import fs from "fs";
import unzipper from "unzipper";

export async function zipPeek(path: string) {
  const files: string[] = [];
  await fs.createReadStream(path)
    .pipe(unzipper.Parse())
    .on("entry", e => {
      if (!e.path.includes("/")) files.push(e.path);
      e.autodrain();
    })
    .promise();
  return files;
}
