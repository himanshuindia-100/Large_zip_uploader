import { Request, Response } from "express";
import crypto from "crypto";
import fs from "fs";
import { pool } from "../db";
import { writeChunk } from "../utils/chunkWriter";

const CHUNK = 5 * 1024 * 1024;

export async function initUpload(req: Request, res: Response) {
  const { filename, size } = req.body;
  const id = crypto.createHash("sha1").update(filename + size).digest("hex");
  const totalChunks = Math.ceil(size / CHUNK);

  await pool.query(
    `INSERT INTO uploads VALUES ($1,$2,$3,$4,'UPLOADING',NULL)
     ON CONFLICT DO NOTHING`,
    [id, filename, size, totalChunks]
  );

  const { rows } = await pool.query(
    "SELECT chunk_index FROM chunks WHERE upload_id=$1",
    [id]
  );

  res.json({ uploadId: id, uploadedChunks: rows.map(r => r.chunk_index) });
}

export async function uploadStatus(req: Request, res: Response) {
  const { uploadId } = req.params;
  const { rows } = await pool.query(
    "SELECT chunk_index,status FROM chunks WHERE upload_id=$1",
    [uploadId]
  );
  res.json(rows);
}

export async function uploadChunk(req: Request, res: Response) {
  const uploadId = req.headers["x-upload-id"] as string;
  const index = Number(req.headers["x-index"]);
  const start = Number(req.headers["x-start"]);

  const path = `/uploads_tmp/${uploadId}.bin`;
  if (!fs.existsSync(path)) fs.writeFileSync(path, "");

  await writeChunk(path, req, start);

  await pool.query(
    `INSERT INTO chunks VALUES ($1,$2,'DONE',now())
     ON CONFLICT DO NOTHING`,
    [uploadId, index]
  );

  res.sendStatus(200);
}
