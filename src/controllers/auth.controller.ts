import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { JWT_SECRET } from "../config";
import { LoginSchemaType, SignupSchemaType } from "../schemas/auth.schema";
import Role from "../models/Role";
import { isValidObjectId } from "mongoose";
import { secureAdmin } from "../middlewares/validateSchema";
import Tienda from "../models/Tienda";
import Sistema from "../models/Sistema";

export const signupHandler = async (
  req: Request<unknown, unknown, SignupSchemaType>,
  res: Response
) => {
  try {
    const { roles } = req.body;
    // find existing user
    let userFound = await User.findOne({
      email: req.body.email,
    });

    // throw with status code
    if (userFound)
      return res.status(400).json({ message: "Email is in use" });

    userFound = await User.findOne({
      doc: req.body.doc,
    });

    // throw with status code
    if (userFound) return res.status(400).json({ message: "Numero de documento esta en uso" });

    const foundRoles = await Role.find({ name: { $in: roles } });
    let rulesValids;
    if (foundRoles.length > 0 || !foundRoles) {
      rulesValids = foundRoles.map((role) => role._id);
      //newUser.roles = rules ;
    } else {
      const role = await Role.findOne({ name: "USER" });
      if (role) {
        rulesValids = [role._id];
      }
    }

    const foundSistema = await Sistema.find();
    if (!foundSistema)
      return res.status(400).json({ message: "KERNEL PANIC" });

    const foundTienda = await Tienda.findById(req.body.tienda);
    if (!foundTienda)
      return res.status(400).json({ message: "Tienda no existe" });

    const newUser = new User({
      email: req.body.email,
      password: req.body.password,
      doc: req.body.doc,
      lastName: req.body.lastName,
      firstName: req.body.firstName,
      tienda: foundTienda._id,
      roles: rulesValids,
    });

    await newUser.hashPassword();

    const createdUser = await (await newUser.save()).populate("roles");

    const token = jwt.sign(
      {
        _id: createdUser._id,
        email: createdUser.email,
        doc: req.body.doc,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        roles: createdUser.roles,
        sistema: foundSistema,
        tienda: foundTienda,
      },
      JWT_SECRET,
      {
        expiresIn: 60 * 60 * 24, // 24 hours
      }
    );

    return res.json({
      token,
    });
  } catch (error) {
    console.log(error);
  }
};

export const loginHandler = async (
  req: Request<unknown, unknown, LoginSchemaType>,
  res: Response
) => {
  try {
    // find existing user
    const userFound = await User.findOne({ email: req.body.email })
      .select("password email firstName dni lastName tienda")
      .populate("roles");
    if (!userFound)
      return res.status(400).json({ message: "User not found" });

    const validPassword = await userFound.comparePassword(req.body.password);
    if (!validPassword)
      return res.status(400).json({ message: "Invalid password" });

    const foundSistema = await Sistema.find();
    if (!foundSistema)
      return res.status(400).json({ message: "KERNEL PANIC" });

    const foundTienda= await Tienda.findById(userFound.tienda);
    if (!foundTienda)
      return res.status(400).json({ message: "Tienda no encontrada" });

    if (!foundTienda.iva)
      foundTienda.iva = 18

    const token = jwt.sign(
      {
        _id: userFound._id,
        email: userFound.email,
        doc: userFound.doc,
        firstName: userFound.firstName,
        lastName: userFound.lastName,
        roles: userFound.roles,
        tienda: foundTienda,
        sistema: foundSistema 
      },
      JWT_SECRET,
      {
        expiresIn: 60 * 60 * 24, // 24 hours
      }
    );

    return res.json({
      token,
    });
  } catch (error) {
    console.log("error from try ", error);
  }
};

export const profileHandler = async (req: Request, res: Response) => {
  const userProfile = await User.findOne({ _id: req.user._id })
    .select("-password")
    .populate("roles");
  if (userProfile) return res.json(userProfile);
  else return res.status(400).json({ message: "Usuario no encontrado" });
};

export const getUsers = async (req: Request, res: Response) => {
  const users = await User.find({}).populate("roles");
  res.json(users);
};

export const getUser = async (req: Request, res: Response) => {
  let userFound;
  if (isValidObjectId(req.params.id))
    userFound = await User.findById(req.params.id).populate("roles");

  else return res.status(400).json({ message: "id no válido. 24ch" });

  if (!userFound)
    return res.status(400).json({ message: "Usuario no encontrado" });
  res.json(userFound);
};

export const deleteUser = async (req: Request, res: Response) => {
  const objDel = await User.findById(req.params.id);
  if (!objDel)
    return res.status(400).json({ message: "Usuario no encontrado" });

  const isUserAdmin = await User.findById(req.params.id);
  if (secureAdmin(isUserAdmin))
    return res
      .status(400)
      .json({ message: "Operación no permitida por el sistema" });

  const deletedUser = await User.findByIdAndDelete(req.params.id);
  if (!deletedUser)
    return res.status(400).json({ message: "Usuario no encontrado" });
  res.json({ message: "Usuario eliminado totalmente" });
};

export const removeUser = async (req: Request, res: Response) => {
  const objDel = await User.findById(req.params.id);
  if (!objDel)
    return res.status(400).json({ message: "Usuario no encontrado" });

  const isUserAdmin = await User.findById(req.params.id);
  if (secureAdmin(isUserAdmin))
    return res
      .status(400)
      .json({ message: "Operación no permitida por el sistema" });

  const updateUser = await User.findByIdAndUpdate(
    req.params.id,
    { status: 0 },
    {
      new: true,
    }
  );
  if (!updateUser)
    return res.status(400).json({ message: "Usuario no encontrado" });
  res.json({ message: "Usuario removido" });
};

export const updateUser = async (req: Request, res: Response) => {
  const userUpdate = await User.findById(req.params.id);
  if (!userUpdate)
    return res.status(400).json({ message: "Usuario no encontrado" });

  if (secureAdmin(userUpdate)) delete req.body.email;

  let userKeyUnique = await User.findOne({ email: req.body.email });

  if (userKeyUnique && !(userKeyUnique._id.toString() === req.params.id))
    return res.status(400).json({ message: "Email ya está en uso" });

  userKeyUnique = await User.findOne({ dni: req.body.dni });
  if (userKeyUnique && !(userKeyUnique._id.toString() === req.params.id))
    return res.status(400).json({ message: "Numero de documento ya está en uso" });

  const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updateUser)
    return res.status(400).json({ message: "Usuario no encontrado" });
  res.json({ message: "update successful" });
};
