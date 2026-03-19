const cron = require("node-cron");
const { runMatchingCycle } = require("./matchingEngine");

const startMatchingJobs = () => {
  cron.schedule("*/1 * * * *", async () => {
    try {
      await runMatchingCycle();
    } catch (err) {
      console.error("Matching job failed", err);
    }
  });
};

module.exports = { startMatchingJobs };
