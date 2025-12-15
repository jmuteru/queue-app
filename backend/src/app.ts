import cors from "cors";
import express from "express";
import queueRoutes from "./routes/queueRoutes";

export const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ ok: true, time: new Date().toISOString() });
  });

  app.use("/", queueRoutes);
  return app;
};

export const initApp = async () => {
  return createApp();
};

