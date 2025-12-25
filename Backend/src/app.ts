import express from "express";
import uploadRoutes from "./routes/upload.routes";
import cors from "cors";

const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",  // frontend URL
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "x-upload-id", "x-index", "x-start"]
}));

app.use(uploadRoutes);

export default app;
