import { z } from "zod";

export const createFormaPagoSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Nombre es requerido",
    })
  }),
});

export type CreateFormaPagoSchema = z.infer<typeof createFormaPagoSchema>["body"];