const { z } = require("zod");

const sendMessageSchema = z.object({
  body: z.object({
    message: z.string().min(1),
  }),
});

module.exports = { sendMessageSchema };
