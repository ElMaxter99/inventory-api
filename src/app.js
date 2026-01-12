const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const pinoHttp = require("pino-http");
const path = require("path");
const config = require("./config");
const logger = require("./utils/logger");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("./docs/openapi.json");
const fs = require("fs");
const sanitizeRequest = require("./middlewares/sanitize");

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeRequest);
app.use(cors({ origin: config.corsOrigin }));
app.use(pinoHttp({ logger }));
const uploadPath = path.resolve(process.cwd(), config.uploadDir);
fs.mkdirSync(uploadPath, { recursive: true });
app.use("/uploads", express.static(uploadPath));

// rate limiting
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use("/api/v1", routes.router);

app.use(errorHandler);

module.exports = app;
