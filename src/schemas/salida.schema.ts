import { z } from "zod";

const DetalleSalidaSchema = z.object({
    product: z.string().nonempty({ message: "Producto es requerido" }),
    nombreProduct: z.string().nonempty({ message: "Nombre del producto es requerido" }),
    simbolUnidadMedida: z.string().nonempty({ message: "Símbolo de unidad de medida es requerido" }),
    cantidad: z.string().nonempty({ message: "Cantidad es requerida" }),
    precio: z.string().nonempty({ message: "Precio es requerido" }),
    importe: z.string().nonempty({ message: "Importe es requerido" }),
});

const DetallePagoSchema = z.object({
    monto: z.string().nonempty({ message: "Monto es requerido" }),
    formaPago: z.string().nonempty({ message: "Forma de pago es requerida" }),
    nameFormaPago: z.string().nonempty({ message: "Nombre de la forma de pago es requerido" }),
});

export const createSalidaSchema = z.object({
    body: z.object({
        comprobante: z.string().nonempty({ message: "Comprobante es requerido" }),
        cliente: z.string().nonempty({ message: "Cliente es requerido" }),
        detallesSalida: z.array(DetalleSalidaSchema),
        detallesPago: z.array(DetallePagoSchema),
        subTotal: z.string().nonempty({ message: "SubTotal es requerido" }),
        impuesto: z.string().nonempty({ message: "Impuesto es requerido" }),
        total: z.string().nonempty({ message: "Total es requerido" }),
        tienda: z.string().nonempty({ message: "Tienda es requerida" }),
    }),
});

export type CreateSalidaSchema = z.infer<typeof createSalidaSchema>["body"];