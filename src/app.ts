import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import path from "path";
import config from "./config";
import logger from "./utils/logger";
import * as routes from "./routes";
import errorHandler from "./middlewares/errorHandler";
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "./docs/openapi.json";

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: config.corsOrigin }));
app.use(pinoHttp({ logger }));
app.use(
  "/uploads",
  express.static(path.resolve(process.cwd(), config.uploadDir))
);

// rate limiting
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use("/api/v1", routes.router);

app.use(errorHandler);

export default app;
