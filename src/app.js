const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const path = require("path");
const config = require("./config");
const { stream } = require("./utils/logger");
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
const corsOptions = {
  origin: config.corsOrigin,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(morgan("combined", { stream }));
const uploadPath = path.resolve(process.cwd(), config.uploadDir);
fs.mkdirSync(uploadPath, { recursive: true });
app.use("/uploads", express.static(uploadPath));

// rate limiting
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use("/api/v1", routes.router);

app.use(errorHandler);

module.exports = app;
