import express from "express";
import helmet from "helmet";
import cors from "cors";
import router from "./routes";
import { globalErrorHandler, notFoundHandler } from "./middlewares/error-handler";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", router);

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
