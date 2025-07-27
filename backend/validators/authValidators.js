const { z } = require('zod');

const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const loginSchema = registerSchema; // same fields

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
});

const resetPasswordSchema = z.object({
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
};
