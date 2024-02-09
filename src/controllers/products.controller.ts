import { Request, Response } from "express";
import Product from "../models/Product";
import User from "../models/User";
import { CreateProductSchema } from "../schemas/product.schema";
import { ObjectId, isValidObjectId } from "mongoose";

export const getProducts = async (req: Request, res: Response) => {
  const products = await Product.find({status:1}).populate(
    "unidadMedida author"
  );
  res.json(products);
};

export const createProduct = async (
  req: Request<unknown, unknown, CreateProductSchema>,
  res: Response
) => {
  try {
    const {
      name,
      codigoBalanza,
      unidadMedida,
      precioVenta,
      stock,
    } = req.body;

    // find Product's author
    const userFound = await User.findById(req.user._id);
    if (!userFound)
      return res
        .status(400)
        .json({ message: "Usuario logueado, no encontrado" });

    const productExist = await Product.findOne({ codigoBalanza: codigoBalanza });
    if (productExist)
      return res
        .status(400)
        .json(
          { message: "Producto ya existe, con el mismo código de balanza.." + codigoBalanza },
        );

    // create a new Product
    const newProduct= new Product({
      name,
      codigoBalanza,
      unidadMedida,
      precioVenta,
      stock,
      author: req.user._id,
    });

    const productSaved = await newProduct.save();
    res.json(productSaved);
  } catch (error) {
    console.log(error);
  }
};

export const getProduct = async (req: Request, res: Response) => {
  let productFound;
  if (isValidObjectId(req.params.id))
    productFound = await Product.findById(req.params.id).populate(
      "author unidadMedida"
    );
  else return res.status(400).json({ message: "id no válido. 24ch" });

  if (!productFound)
    return res.status(400).json({ message: "Producto no encontrada" });

  res.json(productFound);
};

export const deleteProduct = async (req: Request, res: Response) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);
  if (!deletedProduct)
    return res.status(400).json({ message: "Producto no encontrada" });
  res.json({ message: "Producto eliminado totalmente" });
};

export const removeProduct = async (req: Request, res: Response) => {
  const removeProduct = await Product.findByIdAndUpdate(
    req.params.id,
    { status: 0 },
    {
      new: true,
    }
  );
  if (!removeProduct)
    return res.status(400).json({ message: "Producto no encontrado" });
  res.json({ message: "Producto removido" });
};

export const updateProduct = async (req: Request, res: Response) => {
  const objUpdate = await Product.findById(req.params.id);

  if (!objUpdate)
    return res.status(400).json({ message: "Producto no encontrado" });

  const objKeyUnique = await Product.findOne({ codigoBalanza: req.body.codigoBalanza });

  if (objKeyUnique && objKeyUnique._id.toString() !== req.params.id)
    return res.status(400).json({ message: "Codigo balanza ya está en uso" });

  const updateProduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      codigoBalanza: req.body.codigoBalanza,
      unidadMedida: req.body.unidadMedida,
      precioVenta: req.body.precioVenta,
      stock: req.body.stock,
    },
    {
      new: true,
    }
  );

  if (updateProduct) {
    updateProduct.save();
    res.json({ message: "update successful" });
  } else {
    return res.status(400).json({ message: "Producto no encontrado" });
  }
};
