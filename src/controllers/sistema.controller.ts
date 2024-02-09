import { Request, Response } from "express";
import Sistema from "../models/Sistema";

export const getSistema = async (req: Request, res: Response) => {
  const SistemaFound = await Sistema.findOne()

  if (!SistemaFound)
    return res.status(400).json({ message: "Sistema no encontrado" });
  res.json(SistemaFound);
};

export const updateSistema = async (req: Request, res: Response) => {

  const objUpdate= await Sistema.find()
  if (!objUpdate)
      return res.status(400).json({ message: "Sistema no encontrado" });

  let objKeyUnique = await Sistema.findOne({ ruc: req.body.ruc});

  if ( objKeyUnique && objKeyUnique._id.toString() !== req.params.id )  
      return res.status(400).json({ message: "RUC ya está en uso" });

  objKeyUnique = await Sistema.findOne({ version : req.body.version});
  if ( objKeyUnique && objKeyUnique._id.toString() !== req.params.id )  
      return res.status(400).json({ message: "Version ya está en uso" });

  const updateSistema = await Sistema.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updateSistema)
    return res.status(400).json({ message: "Sistema no encontrado" });
  res.json({message:"update successful"});
};