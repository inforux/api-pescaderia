import { z } from "zod";

export const createRoleSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Nombre del rol es requerido",
    }),
  }),
});

export type CreateRoleSchema = z.infer<typeof createRoleSchema>["body"];