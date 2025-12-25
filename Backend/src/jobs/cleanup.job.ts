import fs from "fs";
import { pool } from "../db";

export async function cleanupJob() {
  const { rows } = await pool.query(
    `SELECT id FROM uploads
     WHERE status='UPLOADING'
     AND NOW() - INTERVAL '1 hour' >
         (SELECT MAX(received_at) FROM chunks WHERE upload_id=uploads.id)`
  );

  for (const r of rows) {
    const p = `/uploads_tmp/${r.id}.bin`;
    if (fs.existsSync(p)) fs.unlinkSync(p);
    await pool.query("DELETE FROM chunks WHERE upload_id=$1", [r.id]);
    await pool.query("DELETE FROM uploads WHERE id=$1", [r.id]);
  }
}
