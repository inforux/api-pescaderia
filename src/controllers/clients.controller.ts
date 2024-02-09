import { Request, Response } from "express";
import Client from "../models/Client";
import User from "../models/User";
import { CreateClientSchema } from "../schemas/client.schema";
import { isValidObjectId } from "mongoose";

export const getClients = async (req: Request, res: Response) => {
  const Clients = await Client.find({}).populate("author");
  res.json(Clients);
};

export const createClient = async (
  req: Request<unknown, unknown, CreateClientSchema>,
  res: Response
) => {
  const {
    doc,
    names,
    address,
    email,
    phone,
    sex,
  } = req.body;

  // find user authorized
  const userFound = await User.findById(req.user._id);
  if (!userFound) return res.status(400).json({ message: "Token no valido" });

  if (doc !== null ) {
    let clientExist = await Client.findOne({ doc: doc });
    if (clientExist)
      return res
        .status(400)
        .json({ message: "Cliente ya existe con el mismo documento " });
    clientExist = await Client.findOne({ email: email });
  }

  // create a new Client
  const newClient = new Client({
    doc,
    names,
    address,
    email,
    phone,
    sex,
    author: req.user._id,
  });

  // save Client
  const ClientSaved = await newClient.save();

  // save user's Client to the client
  res.json(ClientSaved);
};

export const getClient = async (req: Request, res: Response) => {
  let ClientFound;
  if (isValidObjectId(req.params.id))
    ClientFound = await Client.findById(req.params.id).populate(
      "author ubication"
    );
  else return res.status(400).json({ message: "id no válido. 24ch" });

  if (!ClientFound)
    return res.status(400).json({ message: "Cliente no encontrado" });
  res.json(ClientFound);
};

export const deleteClient = async (req: Request, res: Response) => {
  const deletedClient = await Client.findByIdAndDelete(req.params.id);
  if (!deletedClient)
    return res.status(400).json({ message: "Cliente no encontrado" });
  res.json({ message: "Cliente eliminado totalmente" });
};

export const removeClient = async (req: Request, res: Response) => {
  const updateClient = await Client.findByIdAndUpdate(
    req.params.id,
    { status: 0 },
    {
      new: true,
    }
  );
  if (!updateClient)
    return res.status(400).json({ message: "Cliente no encontrado" });
  res.json({ message: "Cliente removido" });
};

export const updateClient = async (req: Request, res: Response) => {
  const objUpdate = await Client.findById(req.params.id);
  if (!objUpdate)
    return res.status(400).json({ message: "Cliente no encontrada" });

  let objKeyUnique = await Client.findOne({ doc: req.body.doc });

  if (objKeyUnique && !objKeyUnique._id.equals(req.params.id))
    return res.status(400).json({ message: "Documento ya está en uso" });

  objKeyUnique = await Client.findOne({ email: req.body.email });

  if (objKeyUnique && !objKeyUnique._id.equals(req.params.id))
    return res.status(400).json({ message: "Email ya está en uso" });

  const updateClient = await Client.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updateClient)
    return res.status(400).json({ message: "Cliente no encontrado" });
  res.json({ message: "update successful" });
};