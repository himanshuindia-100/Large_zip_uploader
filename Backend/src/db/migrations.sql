DELETE FROM uploads;
DELETE FROM chunks;

CREATE TABLE IF NOT EXISTS uploads (
  id TEXT PRIMARY KEY,
  filename TEXT,
  total_size BIGINT,
  total_chunks INT,
  status TEXT,
  final_hash TEXT
);

CREATE TABLE IF NOT EXISTS chunks (
  upload_id TEXT,
  chunk_index INT,
  status TEXT,
  received_at TIMESTAMP,
  PRIMARY KEY (upload_id, chunk_index)
);
