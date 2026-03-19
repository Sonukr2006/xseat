const { z } = require("zod");

const exchangeRequestSchema = z.object({
  body: z.object({
    ticketId: z.string().min(8),
    haveSeatType: z.string().min(1),
    wantSeatType: z.string().min(1),
    coachPreference: z.string().optional(),
    routeSegment: z.object({
      from: z.string().min(2),
      to: z.string().min(2),
    }),
  }),
});

const confirmSchema = z.object({
  body: z.object({
    matchId: z.string().min(8),
    confirm: z.boolean(),
  }),
});

module.exports = { exchangeRequestSchema, confirmSchema };
