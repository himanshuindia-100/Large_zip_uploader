# Large File Uploader

This project implements a chunked file uploader that supports resumable uploads, progress tracking, and resilient backend processing for large ZIP files (>1GB).

---

## File Integrity (Hashing)

- Each upload is identified using a unique identifier (derived from filename and file size).
- File chunks are written to disk using streaming I/O to avoid loading the full file into memory.
- Once all chunks are received, the backend merges them and calculates a SHA-256 hash of the assembled file.
- The final hash is stored and used to verify that the uploaded file was not corrupted during transmission.
- If the calculated hash does not match the expected value, the upload is marked as FAILED.

---

## Pause / Resume Logic

- The frontend splits the file into fixed-size chunks and uploads them with a controlled concurrency limit.
- Before uploading, the frontend performs a handshake with the backend to determine which chunks have already been uploaded.
- Users can pause the upload by stopping further chunk dispatch and resume by continuing from the remaining chunks.
- On page refresh or network interruption, the uploader resumes from the last successfully uploaded chunk without restarting the entire upload.
- Each chunk maintains a status (`PENDING`, `UPLOADING`, `SUCCESS`, `ERROR`) which is reflected in the UI.

---

## Known Trade-offs

- Streaming writes improve memory efficiency but may slightly reduce I/O performance.
- Chunk upload state is primarily maintained on the frontend; recovery after a browser crash depends on backend chunk records.
- Only top-level ZIP entries are inspected to avoid the overhead of full extraction.
- A fixed chunk size (5MB) is used, which may not be optimal for all network conditions.

---

## Further Enhancements

- Support for uploading multiple files simultaneously.
- User authentication and access control for uploads.
- Persistent frontend state using IndexedDB to survive browser crashes.
- Dynamic chunk sizing based on network speed.
- Automatic cleanup of abandoned or incomplete uploads after a configurable timeout.

## Running the Project
- Using Docker Compose :  "docker-compose up --build"
- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- Also create .env files for frontend/backend with appropriate database credentials.
