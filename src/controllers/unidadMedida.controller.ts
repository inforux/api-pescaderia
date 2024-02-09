import { Request, Response } from "express";
import Product from "../models/Product";
import User from "../models/User";
import { CreateProductSchema } from "../schemas/product.schema";
import { ObjectId, isValidObjectId } from "mongoose";
import UnidadMedida from "../models/UnidadMedida";
import { CreateUnidadSchema } from "../schemas/unidad.schema";

export const getUnidades = async (req: Request, res: Response) => {
  const products = await UnidadMedida.find({}).populate(
    "author"
  );
  res.json(products);
};

export const createUnidad = async (
  req: Request<unknown, unknown, CreateUnidadSchema >,
  res: Response
) => {
  try {
    const {
      name,
      simbol,
    } = req.body;

    // find Product's author
    const userFound = await User.findById(req.user._id);
    if (!userFound)
      return res
        .status(400)
        .json({ message: "Usuario logueado, no encontrado" });

    const productExist = await Product.findOne({ simbol: simbol});
    if (productExist)
      return res
        .status(400)
        .json(
          { message: "Producto ya existe, con el mismo simbolo.." + name},
        );

  const productExist2 = await UnidadMedida.findOne({ name: name});
    if (productExist)
      return res
        .status(400)
        .json(
          { message: "Producto ya existe, con el mismo nombre.." + name},
        );


    // create a new Product
    const newProduct= new UnidadMedida({
      name,
      simbol,
      author: req.user._id,
    });

    const productSaved = await newProduct.save();
    res.json(productSaved);
  } catch (error) {
    console.log(error);
  }
};

export const getUnidad = async (req: Request, res: Response) => {
  let productFound;
  if (isValidObjectId(req.params.id))
    productFound = await UnidadMedida.findById(req.params.id).populate(
      "author"
    );
  else return res.status(400).json({ message: "id no válido. 24ch" });

  if (!productFound)
    return res.status(400).json({ message: "Unidad de medida no encontrada" });

  res.json(productFound);
};

export const deleteUnidad = async (req: Request, res: Response) => {
  const deletedProduct = await UnidadMedida.findByIdAndDelete(req.params.id);
  if (!deletedProduct)
    return res.status(400).json({ message: "Unidad de medida no encontrada" });
  res.json({ message: "Unidad de medida eliminada totalmente" });
};

export const removeUnidad = async (req: Request, res: Response) => {
  const removeProduct = await UnidadMedida.findByIdAndUpdate(
    req.params.id,
    { status: 0 },
    {
      new: true,
    }
  );
  if (!removeProduct)
    return res.status(400).json({ message: "Unidad de medida no encontrada" });
  res.json({ message: "Unidad removida" });
};

export const updateUnidad = async (req: Request, res: Response) => {
  const objUpdate = await UnidadMedida.findById(req.params.id);

  if (!objUpdate)
    return res.status(400).json({ message: "Unidad no encontrada" });

  const objKeyUnique = await UnidadMedida.findOne({ simbol: req.body.simbol });

  if (objKeyUnique && objKeyUnique._id.toString() !== req.params.id)
    return res.status(400).json({ message: "Simbolo ya está en uso" });

  const updateProduct = await UnidadMedida.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      simbol: req.body.simbol,
    },
    {
      new: true,
    }
  );

  if (updateProduct) {
    updateProduct.save();
    res.json({ message: "update successful" });
  } else {
    return res.status(400).json({ message: "Unidad de medida no encontrada" });
  }
};
