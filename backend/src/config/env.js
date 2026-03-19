const dotenv = require("dotenv");

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 4000),
  mongodbUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/xseat",
  jwtSecret: process.env.JWT_SECRET || "supersecret",
  sessionSecret: process.env.SESSION_SECRET || process.env.JWT_SECRET || "supersecret",
  otpExpiryMinutes: Number(process.env.OTP_EXPIRY_MINUTES || 5),
  otpDevBypass: process.env.OTP_DEV_BYPASS || "123456",
  predictionServiceUrl:
    process.env.PREDICTION_SERVICE_URL || "http://localhost:8000",
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID || "",
  firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
  firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY || "",
};

module.exports = env;
