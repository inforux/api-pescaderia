import { Request, Response } from "express";
import Tienda from "../models/Tienda";
import User from "../models/User";
import { CreateTiendaSchema } from "../schemas/tienda.schema";
import { isValidObjectId } from "mongoose";

export const getTiendas = async (req: Request, res: Response) => {
  const Tiendas = await Tienda.find({
  }).populate("responsable gerente")
  res.json(Tiendas);
  console.log("hellou world")
};

export const createTienda = async (
  req: Request<unknown, unknown, CreateTiendaSchema>,
  res: Response
) => {
  const { 
    name,
    address,
    telefono,
    email,
    iva,
    responsable,
    gerente
     } = req.body;

  const userFound = await User.findById(req.user._id);
  if (!userFound) return res.status(400).json({ message: "Token no valido" });

  let afiliadoExist = await Tienda.findOne({name:name});
  if (afiliadoExist) return res.status(400).json({ message: "Tienda ya existe con el mismo nombre"});

  // create a new Tienda
  const newTienda = new Tienda({
    name,
    address,
    telefono,
    email,
    iva,
    responsable,
    gerente,
    author: req.user._id,
  });
  const TiendaSaved = await newTienda.save();
  res.json(TiendaSaved);
};

export const getTienda = async (req: Request, res: Response) => {
  let TiendaFound;
  if (isValidObjectId(req.params.id))
    TiendaFound = await Tienda.findById(req.params.id).populate(
"responsable gerente"
    )
  else
    return res
      .status(400)
      .json({ message: "id no válido. 24ch" });

  if (!TiendaFound)
    return res.status(400).json({ message: "Tienda no encontrado" });
  res.json(TiendaFound);
};

export const deleteTienda = async (req: Request, res: Response) => {

  const deletedTienda = await Tienda.findByIdAndDelete(req.params.id);
  if (!deletedTienda)
    return res.status(400).json({ message: "Tienda no encontrado" });
  res.json({message:"Tienda eliminada totalmente"});
};

export const removeTienda = async (req: Request, res: Response) => {

  const updateTienda = await Tienda.findByIdAndUpdate(req.params.id,{status:0} , {
    new: true,
  });
  if (!updateTienda)
    return res.status(400).json({ message: "Tienda no encontrada" });
  res.json({message:"Tienda removida"});
};

export const updateTienda = async (req: Request, res: Response) => {

  const afiliadoUpdate= await Tienda.findById(req.params.id)
  if (!afiliadoUpdate)
      return res.status(400).json({ message: "Tienda no encontrado" });

  let objKeyUnique = await Tienda.findOne({ name : req.body.nombre });

  if ( objKeyUnique && objKeyUnique._id.toString() !== req.params.id ) 
      return res.status(400).json({ message: "Nombre de la tienda ya está en uso" });

  const updateTienda = await Tienda.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updateTienda)
    return res.status(400).json({ message: "Tienda no encontrado" });
  res.json({message:"update successful"});
};