const { z } = require("zod");

const waitlistSchema = z.object({
  query: z.object({
    trainNumber: z.string().min(2),
    travelDate: z.string().min(4),
    currentWaitlist: z.string().min(1),
  }),
});

module.exports = { waitlistSchema };
