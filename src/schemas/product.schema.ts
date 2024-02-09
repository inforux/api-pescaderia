import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Nombre es requerido",
    }),
    codigoBalanza: z.string({
      required_error: "Código de balanza es requerido",
    }),
    unidadMedida: z.string({
      required_error: "Unidad de medida es requerido",
    }),
    precioVenta: z.string({
      required_error: "Precio de venta es requerido",
    }),
    stock: z.string({
      required_error: "Stock es requerido",
    }),
  }),
});


export type CreateProductSchema = z.infer<typeof createProductSchema>["body"];
