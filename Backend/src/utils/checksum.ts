import crypto from "crypto";
import fs from "fs";

export function sha256(path: string): Promise<string> {
  return new Promise(res => {
    const h = crypto.createHash("sha256");
    fs.createReadStream(path)
      .on("data", d => h.update(d))
      .on("end", () => res(h.digest("hex")));
  });
}
