import { pool } from "../db";
import { sha256 } from "../utils/checksum";
import { zipPeek } from "../utils/zipPeek";

export async function finalize(uploadId: string) {
  const path = `/uploads_tmp/${uploadId}.bin`;
  const hash = await sha256(path);
  const files = await zipPeek(path);

  await pool.query(
    "UPDATE uploads SET status='COMPLETED', final_hash=$1 WHERE id=$2",
    [hash, uploadId]
  );

  console.log("ZIP CONTENTS:", files);
}
