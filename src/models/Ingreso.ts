import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";
import { Schema } from "mongoose";

@modelOptions({ 
  schemaOptions: { timestamps: true }, 
  options: { enableMergeHooks: true},
})
export class Ingreso{

  @prop({ required: true, type: Schema.Types.ObjectId, ref: 'Comprobante'} )
  comprobante: Schema.Types.ObjectId

  @prop({ required: true, type: String})
  serie!: string;

  @prop({ required: true, type: String})
  correlativo!: string;

  @prop({ required: true, type: Schema.Types.ObjectId, ref: 'DetalleIngreso'} )
  detalleIngreso: Schema.Types.ObjectId[]

  @prop({ required: true, type: String})
  totalPeso!: string;

  @prop({ required: true, type: String})
  totalCosto!: string;

  @prop({ required: true, type: Schema.Types.ObjectId, ref: 'Tienda'} )
  tienda: Schema.Types.ObjectId

  @prop({ required: true, type: String})
  cantidadProductos!: string;

  @prop({required:true, default:1})
  status!: number; // 0=inactivo , 1=activo

  @prop({ required: true, type: Schema.Types.ObjectId, ref: 'User'} )
  author: Schema.Types.ObjectId

}

export default getModelForClass(Ingreso);