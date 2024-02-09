import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";
import bcrypt from "bcryptjs";
import {  ObjectId } from 'mongoose';
import { Schema } from "mongoose";

@modelOptions({ 
  schemaOptions: { timestamps: true }, 
  options: { enableMergeHooks: true},
})
export class User {

  _id: ObjectId;
  
  @prop({ required: true, type: String, unique: true })
  email!: string;

  @prop({  type: String, required:true, unique: true })
  doc!: string;

  @prop({ required: true, type: String, select: false})
  password!: string;

  @prop({ required: true, type: String })
  firstName!: string;

  @prop({ required: true, type: String })
  lastName!: string;

  @prop({ required: true, type: Schema.Types.ObjectId, ref: 'Role'} )
  roles: Schema.Types.ObjectId[]

  @prop({ type: Schema.Types.ObjectId, ref: 'Tienda'} )
  tienda: Schema.Types.ObjectId

  @prop({required:true, default:1})
  status!: number; // 0=inactivo , 1=activo
  
  public async comparePassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }

  public async hashPassword() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
}

export default getModelForClass(User);