import { Request, Response } from "express";
import Comprobante from "../models/Comprobante";
import User from "../models/User";
import { CreateComprobanteSchema } from "../schemas/comprobante.schema";
import { isValidObjectId } from "mongoose";

export const getComprobantes = async (req: Request, res: Response) => {
  const comprobante= await Comprobante.find({
  }).populate('author');
  res.json(comprobante);
};

export const createComprobante= async (
  req: Request<unknown, unknown, CreateComprobanteSchema>,
  res: Response
) => {
  const { 
    serie,
    correlativo,
    name 
     } = req.body;

  // find user authorized 
  const userFound = await User.findById(req.user._id);
  if (!userFound) return res.status(400).json({ message: "Token no valido" });

  const afiliadoExist = await Comprobante.findOne({name:name});
  if (afiliadoExist) return res.status(400).json({ message: "Comprobante ya existe con el mismo nombre"});

  // create a new Comprobante
  const newComprobante = new Comprobante({
    serie,
    correlativo,
    name,
    author: req.user._id,
  });

  // save Comprobante
  const ComprobanteSaved = await newComprobante.save();

  // save user's Comprobante to the client
  res.json(ComprobanteSaved);
};

export const getComprobante = async (req: Request, res: Response) => {
  let ComprobanteFound;
  if (isValidObjectId(req.params.id))
    ComprobanteFound = await Comprobante.findById(req.params.id)
  else
    return res
      .status(400)
      .json({ message: "id no válido. 24ch" });

  if (!ComprobanteFound)
    return res.status(400).json({ message: "Comprobante no encontrado" });
  res.json(ComprobanteFound);
};

export const deleteComprobante = async (req: Request, res: Response) => {

  const deletedComprobante = await Comprobante.findByIdAndDelete(req.params.id);
  if (!deletedComprobante)
    return res.status(400).json({ message: "Comprobante no encontrado" });
  res.json({message:"Comprobante eliminada totalmente"});
};

export const removeComprobante = async (req: Request, res: Response) => {

  const updateComprobante = await Comprobante.findByIdAndUpdate(req.params.id,{status:0} , {
    new: true,
  });
  if (!updateComprobante)
    return res.status(400).json({ message: "Comprobante no encontrada" });
  res.json({message:"Comprobante removida"});
};

export const updateComprobante = async (req: Request, res: Response) => {

  const afiliadoUpdate= await Comprobante.findById(req.params.id)
  if (!afiliadoUpdate)
      return res.status(400).json({ message: "Comprobante no encontrado" });

  const afiliadoKeyUnique = await Comprobante.findOne({ name: req.body.name});

  if ( afiliadoKeyUnique && !afiliadoKeyUnique._id.equals(req.params.id))  
      return res.status(400).json({ message: "Nombre ya está en uso" });

  const updateComprobante = await Comprobante.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updateComprobante)
    return res.status(400).json({ message: "Comprobante no encontrado" });
  res.json({message:"update successful"});
};