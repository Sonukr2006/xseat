const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const env = require("./config/env");
const routes = require("./routes");
const { errorHandler, notFound } = require("./middlewares/errorHandler");

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    origin: env.frontendOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.use(
  session({
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: env.mongodbUri,
      ttl: 7 * 24 * 60 * 60,
    }),
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: env.nodeEnv === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, try again later." },
});

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "xseat-backend" });
});

app.use("/api/auth", authLimiter, routes.auth);
app.use("/api/ticket", routes.ticket);
app.use("/api/exchange", routes.exchange);
app.use("/api/prediction", routes.prediction);
app.use("/api/assistant", routes.assistant);
app.use("/api/notifications", routes.notifications);
app.use("/api/chat", routes.chat);
app.use("/api/coach", routes.coach);
app.use("/api/admin", routes.admin);
app.use("/api/user", routes.user);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
