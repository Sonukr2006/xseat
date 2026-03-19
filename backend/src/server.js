const http = require("http");
const app = require("./app");
const env = require("./config/env");
const { connectDb } = require("./config/db");
const { initSockets } = require("./sockets");
const { startMatchingJobs } = require("./modules/matching/jobs");

const server = http.createServer(app);

initSockets(server);

const start = async () => {
  await connectDb();
  server.listen(env.port, () => {
    console.log(`XSEAT backend listening on port ${env.port}`);
  });
  startMatchingJobs();
};

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
