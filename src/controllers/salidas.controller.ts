import { Request, Response } from 'express';
import { createSalidaSchema, CreateSalidaSchema } from '../schemas/salida.schema';
import  Salida  from '../models/Salida';
import  DetalleSalida  from '../models/DetalleSalida';
import DetallePago  from '../models/DetallePago';
import Comprobante from '../models/Comprobante';
import Product from '../models/Product';

export const createSalida = async (
  req: Request<unknown, unknown, CreateSalidaSchema>, 
  res: Response) => {
  console.log('init createSalida...'); // agregar esta línea

  const data = req.body;

  try {
    // Buscar el Comprobante
    const comprobante = await Comprobante.findById(data.comprobante);
    if (!comprobante) {
      return res.status(404).json({ message: 'Comprobante no encontrado' });
    }

    comprobante.correlativo += 1;
    await comprobante.save();

    const detallesSalida = await Promise.all(data.detallesSalida.map((detalle: any) => new DetalleSalida(detalle).save()));
    const detallesPago = await Promise.all(data.detallesPago.map((detalle: any) => new DetallePago(detalle).save()));

    const newSalida = new Salida({
      ...data,
      serie: comprobante.serie,
      correlativo: comprobante.correlativo,
      detallesSalida: detallesSalida.map(detalle => detalle._id),
      detallesPago: detallesPago.map(detalle => detalle._id),
      cantidadProductos: detallesSalida.length,
      author: req.user._id,
    });

    await newSalida.save();

    res.status(201).json({
  ...newSalida.toObject(), 
  comprobanteName: comprobante.name, 
});

  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    } else {
      console.log(error);
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

export const getHistoricoDeVentas = async (req: Request, res: Response) => {
  try {
    const ventas = await Salida.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000), // 30 días atrás
          },
        },
      },
      {
        $addFields: {
          totalNum: { $toDouble: "$total" },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          totalVentas: { $sum: "$totalNum" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ]);

    res.status(200).json(ventas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ocurrió un error al obtener el historial de ventas" });
  }
};

export const get5TopProductByDay = async (req: Request, res: Response) => {
  try {
    // Primero, calculamos los 6 productos más vendidos del mes
    let topProductos = await DetalleSalida.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000), // 30 días atrás
          },
        },
      },
      {
        $group: {
          _id: "$product",
          totalVendido: { $sum: { $toDouble: "$cantidad" } },
        },
      },
      {
        $sort: { totalVendido: -1 },
      },
      {
        $limit: 6,
      },
    ]);

    // Obtenemos los nombres de los productos
    const productNames = await Product.find({
      _id: { $in: topProductos.map((p) => p._id) },
    }).select('name');

    // Creamos un objeto para mapear los IDs de los productos a sus nombres
    const productNameMap: { [key: string]: string } = productNames.reduce((map: { [key: string]: string }, product) => {
      map[product._id.toString()] = product.name;
      return map;
    }, {});

    // Agregamos el nombre del producto a topProductos
    topProductos = topProductos.map((producto) => ({
      ...producto,
      name: productNameMap[producto._id.toString()],
    }));

    // Luego, para cada día de los últimos 30 días, calculamos cuánto se vendió de cada producto
    const ventasPorDia = await DetalleSalida.aggregate([
      {
        $match: {
          product: { $in: topProductos.map((p) => p._id) },
          createdAt: {
            $gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000), // 30 días atrás
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
            product: "$product",
          },
          totalVendido: { $sum: { $toDouble: "$cantidad" } },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ]);

    // Agregamos el nombre del producto a ventasPorDia._id
    ventasPorDia.forEach((venta) => {
      venta._id.name = productNameMap[venta._id.product.toString()];
    });

    res.status(200).json({ topProductos, ventasPorDia });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ocurrió un error al obtener los productos más vendidos" });
  }
};

export const getStock10Top = async (req: Request, res: Response) => {
  try {
    // Primero, calculamos los 10 productos más vendidos
    const topProductos = await DetalleSalida.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000), // 30 días atrás
          },
        },
      },
      {
        $group: {
          _id: "$product",
          totalVendido: { $sum: { $toDouble: "$cantidad" } },
        },
      },
      {
        $sort: { totalVendido: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    // Luego, obtenemos el stock de cada uno de estos productos
    const stocks = await Product.find({
      _id: { $in: topProductos.map((p) => p._id) },
    }).select('stock name');

    res.status(200).json(stocks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ocurrió un error al obtener el stock de los productos más vendidos" });
  }
};

export const getSalidas = async (req: Request, res: Response) => {
  try {
    const salidas = await Salida.find().populate("comprobante cliente");;
    res.json(salidas);
  }catch (error) {
  if (error instanceof Error) {
    res.status(500).json({ message: error.message });
  } else {
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
} 
};

export const getSalida = async (req: Request, res: Response) => {
  try {
    const salida = await Salida.findById(req.params.id).populate('comprobante author cliente detallesSalida detallesPago');
    if (salida == null) {
      return res.status(404).json({ message: 'No se puede encontrar la salida' });
    }
    res.json(salida);
  }catch (error) {
  if (error instanceof Error) {
    res.status(500).json({ message: error.message });
  } else {
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
} 
};

export const anularSalida = async (req: Request, res: Response) => {

  try {
    const salida = await Salida.findByIdAndUpdate(req.params.id, { status: 0 }, { new: true });
    if (salida == null) {
      return res.status(404).json({ message: 'No se puede encontrar la salida' });
    }
    res.json(salida);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

export const deleteSalida = async (req: Request, res: Response) => {
  try {
    const salida = await Salida.findByIdAndDelete(req.params.id);
    if (salida == null) {
      return res.status(404).json({ message: 'No se puede encontrar la salida' });
    }
    res.json({ message: 'Salida eliminada' });
  }catch (error) {
  if (error instanceof Error) {
    res.status(500).json({ message: error.message });
  } else {
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
} 
};