import { Request, Response } from "express";
import FormaPago from "../models/FormaPago";
import User from "../models/User";
import { CreateFormaPagoSchema } from "../schemas/formaPago.schema";
import { isValidObjectId } from "mongoose";

export const getFormaPagos = async (req: Request, res: Response) => {
  const FormaPagos = await FormaPago.find({
  }).populate('author');
  res.json(FormaPagos);
};

export const createFormaPago = async (
  req: Request<unknown, unknown, CreateFormaPagoSchema>,
  res: Response
) => {
  const { 
    name,
     } = req.body;

  // find user authorized 
  const userFound = await User.findById(req.user._id);
  if (!userFound) return res.status(400).json({ message: "Token no valido" });

  const afiliadoExist = await FormaPago.findOne({name:name});
  if (afiliadoExist) return res.status(400).json({ message: "FormaPago ya existe con el mismo nombre"});

  // create a new FormaPago
  const newFormaPago = new FormaPago({
    name,
    author: req.user._id,
  });

  // save FormaPago
  const FormaPagoSaved = await newFormaPago.save();

  // save user's FormaPago to the client
  res.json(FormaPagoSaved);
};

export const getFormaPago = async (req: Request, res: Response) => {
  let FormaPagoFound;
  if (isValidObjectId(req.params.id))
    FormaPagoFound = await FormaPago.findById(req.params.id).populate('author')
  else
    return res
      .status(400)
      .json({ message: "id no válido. 24ch" });

  if (!FormaPagoFound)
    return res.status(400).json({ message: "FormaPago no encontrado" });
  res.json(FormaPagoFound);
};

export const deleteFormaPago = async (req: Request, res: Response) => {

  const deletedFormaPago = await FormaPago.findByIdAndDelete(req.params.id);
  if (!deletedFormaPago)
    return res.status(400).json({ message: "FormaPago no encontrado" });
  res.json({message:"FormaPago eliminada totalmente"});
};

export const removeFormaPago = async (req: Request, res: Response) => {

  const updateFormaPago = await FormaPago.findByIdAndUpdate(req.params.id,{status:0} , {
    new: true,
  });
  if (!updateFormaPago)
    return res.status(400).json({ message: "FormaPago no encontrada" });
  res.json({message:"FormaPago removida"});
};

export const updateFormaPago = async (req: Request, res: Response) => {

  const afiliadoUpdate= await FormaPago.findById(req.params.id)
  if (!afiliadoUpdate)
      return res.status(400).json({ message: "FormaPago no encontrado" });

  const afiliadoKeyUnique = await FormaPago.findOne({ name: req.body.name});

  if ( afiliadoKeyUnique && !afiliadoKeyUnique._id.equals(req.params.id))  
      return res.status(400).json({ message: "Nombre ya está en uso" });

  
  const updateFormaPago = await FormaPago.findByIdAndUpdate(req.params.id, 
    {
      name: req.body.name
    },
     {
    new: true,
  });
  if (!updateFormaPago)
    return res.status(400).json({ message: "FormaPago no encontrado" });
  res.json({message:"update successful"});
};