import {
  getModelForClass,
  modelOptions,
  prop,
} from "@typegoose/typegoose";
import { Schema } from "mongoose";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: { enableMergeHooks: true},
})
class Product {

  @prop({ required: true, type: String})
  name: string;

  @prop({ required: true, type: String, unique: true })
  codigoBalanza: string;

  @prop({ required: true, type: Schema.Types.ObjectId, ref: 'UnidadMedida'} )
  unidadMedida: Schema.Types.ObjectId

  @prop()
  precioVenta: string;

  @prop()
  stock: string;

  @prop({ required: true, type: Schema.Types.ObjectId, ref: 'User'} )
  author: Schema.Types.ObjectId

  @prop({required:true, default:1})
  status!: number; // 0=inactivo , 1=activo

}

export default getModelForClass(Product);