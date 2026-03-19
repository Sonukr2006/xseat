const { z } = require("zod");

const ticketSchema = z.object({
  body: z.object({
    trainNumber: z.string().min(2),
    trainName: z.string().min(2),
    travelDate: z.string().min(4),
    sourceStation: z.string().min(2),
    destinationStation: z.string().min(2),
    coachNumber: z.string().min(1),
    seatNumber: z.string().min(1),
    seatType: z.string().min(1),
    ticketStatus: z.enum(["CNF", "RAC", "WL"]),
  }),
});

const ticketUpdateSchema = z.object({
  body: z.object({
    trainNumber: z.string().min(2).optional(),
    trainName: z.string().min(2).optional(),
    travelDate: z.string().min(4).optional(),
    sourceStation: z.string().min(2).optional(),
    destinationStation: z.string().min(2).optional(),
    coachNumber: z.string().min(1).optional(),
    seatNumber: z.string().min(1).optional(),
    seatType: z.string().min(1).optional(),
    ticketStatus: z.enum(["CNF", "RAC", "WL"]).optional(),
  }),
});

const ticketOcrImportSchema = z.object({
  body: z.object({
    rawText: z.string().optional(),
    save: z.string().optional(),
    trainNumber: z.string().min(2).optional(),
    trainName: z.string().min(2).optional(),
    travelDate: z.string().min(4).optional(),
    sourceStation: z.string().min(2).optional(),
    destinationStation: z.string().min(2).optional(),
    coachNumber: z.string().min(1).optional(),
    seatNumber: z.string().min(1).optional(),
    seatType: z.string().min(1).optional(),
    ticketStatus: z.enum(["CNF", "RAC", "WL"]).optional(),
    currentWaitlistPosition: z.union([z.string(), z.number()]).optional(),
    pnr: z.string().optional(),
  }),
});

module.exports = { ticketSchema, ticketUpdateSchema, ticketOcrImportSchema };
