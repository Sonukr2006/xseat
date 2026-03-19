const { z } = require("zod");

const otpLoginSchema = z.object({
  body: z.object({
    phone: z.string().min(8),
    name: z.string().min(2).optional(),
  }),
});

const emailLoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

const loginSchema = z.union([emailLoginSchema, otpLoginSchema]);

const verifySchema = z.object({
  body: z.object({
    phone: z.string().min(8),
    otp: z.string().min(4),
  }),
});

const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    age: z.number().min(1).max(120).optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
    preferredBerth: z.string().optional(),
  }),
});

const signupSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

module.exports = { loginSchema, verifySchema, updateProfileSchema, signupSchema };
