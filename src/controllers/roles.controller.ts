import { Request, Response } from "express";
import Role from "../models/Role";
import User from "../models/User";
import { CreateRoleSchema } from "../schemas/role.schema";
import { isValidObjectId } from "mongoose";

export const getRoles = async (req: Request, res: Response) => {
  const Roles = await Role.find({
  }).populate('author');
  res.json(Roles);
};

export const createRole = async (
  req: Request<unknown, unknown, CreateRoleSchema>,
  res: Response
) => {
  const { 
    name, 
     } = req.body;

  // find user authorized 
  const userFound = await User.findById(req.user._id);
  if (!userFound) return res.status(400).json({ message: "Token no valido" });

  const roleExist = await Role.findOne({name:name});
  if (roleExist) return res.status(400).json({ message: "Role ya existe con el mismo nombre"});

  // create a new Role
  const newRole = new Role({
    name,
    author: req.user._id,
  });

  // save Role
  const RoleSaved = await newRole.save();

  // save user's Role to the client
  res.json(RoleSaved);
};

export const getRole = async (req: Request, res: Response) => {
  let RoleFound;
  if (isValidObjectId(req.params.id))
    RoleFound = await Role.findById(req.params.id);
  else
    return res
      .status(400)
      .json({ message: "id no válido. 24ch" });

  if (!RoleFound)
    return res.status(400).json({ message: "Role no encontrado" });
  res.json(RoleFound);
};

export const deleteRole = async (req: Request, res: Response) => {
  const deletedRole = await Role.findByIdAndDelete(req.params.id);
  if (!deletedRole)
    return res.status(400).json({ message: "Role no encontrado" });
  res.json({message:"Role eliminada totalmente"});
};

export const removeRole = async (req: Request, res: Response) => {
  const updateRole = await Role.findByIdAndUpdate(req.params.id,{status:0} , {
    new: true,
  });
  if (!updateRole)
    return res.status(400).json({ message: "Role no encontrada" });
  res.json({message:"Role removida"});
};

export const updateRole = async (req: Request, res: Response) => {

  const objUpdate= await Role.findById(req.params.id)
  if (!objUpdate)
      return res.status(400).json({ message: "Rol no encontrado" });

  const objKeyUnique = await Role.findOne({ name: req.body.name});

  if ( objKeyUnique && objKeyUnique._id.toString() !== req.params.id )  
      return res.status(400).json({ message: "Nombre de rol ya está en uso" });

  const updateRole = await Role.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updateRole)
    return res.status(400).json({ message: "Role no encontrado" });
  res.json({message:"update successful"});
};