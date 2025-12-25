import { Router } from "express";
import {
  initUpload,
  uploadChunk,
  uploadStatus
} from "../controllers/upload.controller";

const router = Router();

router.post("/init", initUpload);
router.get("/status/:uploadId", uploadStatus);
router.post("/chunk", uploadChunk);

export default router;
