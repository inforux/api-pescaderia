import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";
import { Schema } from "mongoose";
import {  ObjectId } from 'mongoose';

@modelOptions({ 
  schemaOptions: { timestamps: true }, 
  options: { enableMergeHooks: true},
})
export class Tienda{

  _id: ObjectId;

  @prop({ required: true, type: String, unique: true })
  name!: string;

  @prop({ required: true, type: String })
  address!:string

  @prop({ required: true, type: String })
  telefono!:string

  @prop({ required: true, type: String })
  email!:string

  @prop({ required: true, type: Number, default:18 })
  iva!:number

  @prop({ required: true, type: Schema.Types.ObjectId, ref: 'User'} )
  responsable: Schema.Types.ObjectId

  @prop({ required: false, type: Schema.Types.ObjectId, ref: 'User'} )
  gerente: Schema.Types.ObjectId

  @prop({required:true, default:1})
  status!: number; // 0=inactivo , 1=activo

}

export default getModelForClass(Tienda);
