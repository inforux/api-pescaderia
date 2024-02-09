import { z } from "zod";

export const signupSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email({
        message: "Email is not valid",
      }),
    doc: z
      .string({
        required_error: "document is required",
      }
      ),
    firstName: z
      .string({
        required_error: "firstName is required",
      })
      .min(3, {
        message: "Firstname must be at least 3 characters",
      }),
    lastName: z
      .string({
        required_error: "lastname is required",
      })
      .min(3, {
        message: "Lastname must be at least 3 characters",
      }),
    roles: z.array(z.string().optional()).optional(),
    tienda: z.string({
      required_error: "Tienda es requerido",
    }),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, {
        message: "Password must be at least 6 characters",
      }),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email({
        message: "Email is not valid",
      }),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, {
        message: "Password must be at least 6 characters",
      }),
  }),
});

export type SignupSchemaType = z.infer<typeof signupSchema>["body"];
export type LoginSchemaType = z.infer<typeof loginSchema>["body"];
