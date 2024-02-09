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
class Client {

  @prop({  type: String, required:true, unique: true })
  doc!: string;

  @prop({required:true})
  names: string;

  @prop({required:true})
  address: string;

  @prop({ type: String })
  email!: string;

  @prop({ required: false, type: String })
  phone!: string;

  @prop()
  sex: number; // 0=FEMALE , 1=VARON , 2=INDETERMINATE

  @prop({ required: true, type: Schema.Types.ObjectId, ref: 'User'} )
  author: Schema.Types.ObjectId

  @prop({required:true, default:1})
  status!: number; // 0=inactivo , 1=activo

}

export default getModelForClass(Client);