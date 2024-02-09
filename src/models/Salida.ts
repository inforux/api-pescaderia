import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";
import { Schema } from "mongoose";

@modelOptions({ 
  schemaOptions: { timestamps: true }, 
  options: { enableMergeHooks: true},
})
export class Salida{

  @prop({ required: true, type: Schema.Types.ObjectId, ref: 'Comprobante'} )
  comprobante: Schema.Types.ObjectId

  @prop({ required: true, type: String})
  serie!: string;

  @prop({ required: true, type: String})
  correlativo!: string;

  @prop({ required: true, type: Schema.Types.ObjectId, ref: 'Client'} )
  cliente: Schema.Types.ObjectId

  @prop({ required: true, type: Schema.Types.ObjectId, ref: 'DetalleSalida'} )
  detallesSalida: Schema.Types.ObjectId[]

  @prop({ required: true, type: Schema.Types.ObjectId, ref: 'DetallePago'} )
  detallesPago: Schema.Types.ObjectId[]

  @prop({ required: true, type: String})
  subTotal!: string;

  @prop({ required: true, type: String})
  impuesto!: string;
  
  @prop({ required: true, type: String})
  total!: string;

  @prop({ required: true, type: String})
  cantidadProductos!: string;

  @prop({ required: true, type: Schema.Types.ObjectId, ref: 'Tienda'} )
  tienda: Schema.Types.ObjectId

  @prop({required:true, default:1})
  status!: number; // 0=inactivo , 1=activo

  @prop({ required: true, type: Schema.Types.ObjectId, ref: 'User'} )
  author: Schema.Types.ObjectId

}

export default getModelForClass(Salida);