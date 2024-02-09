import {  ObjectId } from 'mongoose';

import {
  getModelForClass,
  modelOptions,
  prop,
} from "@typegoose/typegoose";
import { Schema } from "mongoose";

@modelOptions({ schemaOptions: { timestamps: true } })
export class DetallePago{

  _id: ObjectId;

  @prop({  type: String, required:true})
  monto!: string;

  @prop({ required: true, type: Schema.Types.ObjectId, ref: 'FormaPago'} )
  formaPago: Schema.Types.ObjectId

  @prop({  type: String, required:true})
  nameFormaPago!: string;

  @prop({required:true, default:1})
  status!: number; // 0=inactivo , 1=activo

  @prop({  type: Schema.Types.ObjectId, ref: 'User'} )
  author: Schema.Types.ObjectId

}

export default getModelForClass(DetallePago);

