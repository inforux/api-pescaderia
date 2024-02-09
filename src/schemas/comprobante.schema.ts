import { z } from "zod";

export const createComprobanteSchema = z.object({
  body: z.object({
    serie: z.string({
      required_error: "Serie es requerido",
    }),
    correlativo: z.string({
      required_error: "Correlativo es requerido",
    }),
    name: z.string({
      required_error: "Nombre es requerido",
    }),
  }),
});

export type CreateComprobanteSchema = z.infer<typeof createComprobanteSchema>["body"];