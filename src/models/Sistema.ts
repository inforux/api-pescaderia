import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";

@modelOptions({ 
  schemaOptions: { timestamps: true }, 
  options: { enableMergeHooks: true},
})
export class Sistema{

  @prop({ required: true, type: Boolean })
  licenciaValida!: true;
  
  @prop({ required: true, type: String, unique: true })
  ruc!: string;

  @prop({ required: true, type: String, unique: true })
  version!: string;

}

export default getModelForClass(Sistema);