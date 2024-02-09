import {  ObjectId } from 'mongoose';

import {
  getModelForClass,
  modelOptions,
  prop,
} from "@typegoose/typegoose";
import { Schema } from "mongoose";

@modelOptions({ 
  schemaOptions: { timestamps: true }, 
  options: { enableMergeHooks: true},
})
export class DetalleSalida{

  _id: ObjectId;

  @prop({ required: true, type: Schema.Types.ObjectId, ref: 'Product'} )
  product: Schema.Types.ObjectId

  @prop({  type: String, required:true})
  nombreProduct!: string;

  @prop({  type: String, required:true})
  simbolUnidadMedida!: string;

  @prop({  type: String, required:true})
  cantidad!: string;

  @prop({  type: String, required:true})
  precio!: string;

  @prop({  type: String, required:true})
  importe!: string;

  @prop({required:true, default:1})
  status!: number; // 0=inactivo , 1=activo

  @prop({ type: Schema.Types.ObjectId, ref: 'User'} )
  author: Schema.Types.ObjectId

}

export default getModelForClass(DetalleSalida);