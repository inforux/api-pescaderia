import { z } from "zod";

export const createUnidadSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Nombre de la unidad de medida es requerido",
    }),
    simbol: z.string({
      required_error: "Nombre de la unidad de medida es requerido",
    })
  }),
});

export type CreateUnidadSchema = z.infer<typeof createUnidadSchema>["body"];