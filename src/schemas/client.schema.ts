import { z } from "zod";

export const createClientSchema = z.object({
  body: z.object({
    doc: z.string({
      required_error: "documento es requerido",
    }),
    names: z.string({
      required_error: "nombres y/o razon social es requerido",
    }),
    address: z.string({
      required_error: "Dirección es requerida",
    }),
    email: z.string({
      //required_error: "Correo electrónico es requerido",
    }).optional(),
    phone: z.string({
      //required_error: "Telefono es requerido",
    }).optional(),
    sex: z.string({
      //required_error: "Sexo es requerido",
    }).optional(),
  }),
});

export type CreateClientSchema = z.infer<typeof createClientSchema>["body"];