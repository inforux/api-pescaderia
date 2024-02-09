import Client from "../models/Client";
import Comprobante from "../models/Comprobante";
import DetalleIngreso from "../models/DetalleIngreso";
import DetallePago from "../models/DetallePago";
import DetalleSalida from "../models/DetalleSalida";
import FormaPago from "../models/FormaPago";
import Ingreso from "../models/Ingreso";
import Product from "../models/Product";
import Salida from "../models/Salida";
import Sistema from "../models/Sistema";
import Tienda from "../models/Tienda";
import UnidadMedida from "../models/UnidadMedida";
import User from "../models/User";
import Role from "../models/Role";

export const createRoles = async () => {
  try {
    const countSis = await Sistema.estimatedDocumentCount();
    if (countSis > 0) return;
    await Promise.all([
      new Sistema({
        licenciaValida: true,
        ruc: "10443399955",
        version: "v.1",
      }).save(),
    ]);
    console.log("0 - bootstrap for sistema de pescaderia... ok");

    const countRoles = await Role.estimatedDocumentCount();
    if (countRoles > 0) return;
    await Promise.all([
      new Role({ name: "USER" }).save(),
      new Role({ name: "ADMIN" }).save(),
    ]);
    console.log("1 - bootstrap for roles... ok");

    const userFound = await User.findOne({ email: "admin@localhost.com" });

    if (userFound) return;

    const admin = new User({
      email: "admin@localhost.com",
      doc: "99999999",
      password: "123456789",
      lastName: "Administration",
      firstName: "root",
    });
    await admin.hashPassword();

    const user = new User({
      email: "user@localhost.com",
      doc: "0000000",
      password: "123456789",
      lastName: "piura",
      firstName: "user",
    });
    await user.hashPassword();

    const adminRole = await Role.findOne({ name: "ADMIN" });
    if (adminRole) admin.roles = [adminRole._id];
    await admin.save();

    const userRole = await Role.findOne({ name: "USER" });
    if (userRole) user.roles = [userRole._id];
    await user.save();

    console.log("1 - bootstrap for user ... ok");

    let tienda1;
    const countStores = await Tienda.estimatedDocumentCount();
    if (countStores > 0) return;
    await Promise.all([
      (tienda1 = new Tienda({
        codigo: "td01",
        name: "SAN JOSE",
        address: "Urb San Jose Jr D",
        telefono: "989898989",
        email: "pescaderia.sanjosepiura@gamil.com",
        responsable: admin._id,
        gerente: admin._id,
      }).save()),
      (admin.tienda = (await tienda1)._id),
      new Tienda({
        codigo: "td02",
        name: "CASTILLA",
        address: "-",
        telefono: "-",
        email: "pescaderia.sanjosecastilla@gamil.com",
        responsable: admin._id,
        gerente: admin._id,
      }).save(),
    ]);
    console.log("2 - bootstrap for tiendas ... ok");

    admin.tienda = (await tienda1)._id;
    user.tienda = (await tienda1)._id;
    admin.save();
    user.save();

    let client1;
    let client2;
    const countClient = await Client.estimatedDocumentCount();
    if (countClient > 0) return;
    await Promise.all([
      (client1 = new Client({
        doc: "00000000",
        names: "PUBLICO",
        address: "Urb. san jose Jr d",
        email: "-",
        phone: "-",
        sex: 1,
        author: admin._id,
      }).save()),
      client2 = new Client({
        doc: "028732314",
        names: "Teresa Paiva",
        address: "Urb. San Jose",
        email: "-",
        phone: "-",
        sex: "0",
        author: admin._id,
      }).save(),
    ]);

    console.log("3 - bootstrap for clients...ok");

    let um1;
    let um2;
    const countUm= await UnidadMedida.estimatedDocumentCount();
    if (countUm > 0) return;
    await Promise.all([
      (um1= new UnidadMedida({
        name: "Kilogramo",
        simbol: "kg",
        author: admin._id,
      }).save()),
      um2= new UnidadMedida({
        name: "Unidad",
        simbol: "und",
        author: admin._id,
      }).save(),
    ]);

    console.log("4 - bootstrap for unidad de medida...ok");

    let fp1;
    let fp2;
    const countFp = await FormaPago.estimatedDocumentCount();
    if (countFp > 0) return;
    await Promise.all([
      (fp1= new FormaPago({
        name: "EFECTIVO",
        author: admin._id,
      }).save()),
      fp2= new FormaPago({
        name: "Plin",
        author: admin._id,
      }).save(),
    ]);

    console.log("5 - bootstrap for forma de pago...ok"); 

    let comprobante1;
    let comprobante2;
    let comprobante3;
    const countComprobantes = await Comprobante.estimatedDocumentCount();
    if ( countComprobantes > 0) return;
    await Promise.all([
      (comprobante1= new Comprobante({
        serie: "NV",
        correlativo: "1",
        name: "NOTA DE VENTA",
        author: admin._id,
      }).save()),
      comprobante2= new Comprobante({
        serie: "TK",
        correlativo: "1",
        name: "Ticket",
        author: admin._id,
      }).save(),
      (comprobante3= new Comprobante({
        serie: "BL",
        correlativo: "1",
        name: "Boleta",
        author: admin._id,
      }).save()),
    ]);

    console.log("6 - bootstrap for comprobante...ok"); 


    let product1;
    let product2;
    let product3;
    let product4;
    const countProduct= await Product.estimatedDocumentCount();
    if (countProduct > 0) return;
    await Promise.all([
      (product1= new Product({
        name:"Cachema chica",
        codigoBalanza: "02030",
        unidadMedida: (await um1)._id,
        precioVenta: "15",
        stock: "0",
        author: admin._id,
      }).save()),
      (product2= new Product({
        name:"Cachema mediana",
        codigoBalanza: "02031",
        unidadMedida: (await um1)._id,
        precioVenta: "25",
        stock: "0",
        author: admin._id,
      }).save()),
      (product3= new Product({
        name:"Cabrilla chica",
        codigoBalanza: "02032",
        unidadMedida: (await um1)._id,
        precioVenta: "17",
        stock: "0",
        author: admin._id,
      }).save()),
      (product4= new Product({
        name:"Cabrilla mediana",
        codigoBalanza: "02033",
        unidadMedida: (await um1)._id,
        precioVenta: "27",
        stock: "0",
        author: admin._id,
      }).save()),
    ]);
    console.log("7 - bootstrap for Productos...ok");

    let ingreso1;
    let ingreso2;
    const countIngreso= await Ingreso.estimatedDocumentCount();
    if (countIngreso > 0) return;
    await Promise.all([
      (ingreso1= new Ingreso({
        comprobante: (await comprobante1)._id,
        serie:"IN",
        correlativo: "1",
        totalPeso: "40",
        totalCosto: "600",
        tienda:(await tienda1)._id,
        cantidadProductos:2,
        author: admin._id,
      }).save()),
      (ingreso2 = new Ingreso({
        comprobante: (await comprobante1)._id,
        serie:"IN",
        correlativo: "2",
        totalPeso: "10",
        totalCosto: "150",
        tienda:(await tienda1)._id,
        cantidadProductos:2,
        author: admin._id,
      }).save()),
    ]);
    console.log("8- bootstrap for ingreso...ok");


    //creamos los detalles de ingreso 
    let di1;
    let di2;
    let di3;
    let di4;
    await Promise.all([
      (di1 = new DetalleIngreso({
        product: (await product1)._id,
        nombreProduct: (await product1).name,
        simbolUnidadMedida: (await um1).simbol,
        cantidad: "20", 
        precioCosto: "10", 
        importe: "200"
      }).save()),
      (await ingreso1).detalleIngreso.push((await di1)._id),
      (await product1).stock = "20",
      (di2 = new DetalleIngreso({
        product: (await product2)._id,
        nombreProduct: (await product2).name,
        simbolUnidadMedida: (await um1).simbol,
        cantidad: "20", 
        precioCosto: "20", 
        importe: "400"
      }).save()),
      (await ingreso1).detalleIngreso.push((await di2)._id),
      (await product2).stock = "20",
      (di3 = new DetalleIngreso({
        product: (await product3)._id,
        nombreProduct: (await product3).name,
        simbolUnidadMedida: (await um1).simbol,
        cantidad: "5", 
        precioCosto: "10", 
        importe: "50"
      }).save()),
      (await ingreso2).detalleIngreso.push((await di3)._id),
      (await product3).stock = "5",
      (di4 = new DetalleIngreso({
        product: (await product4)._id,
        nombreProduct: (await product4).name,
        simbolUnidadMedida: (await um1).simbol,
        cantidad: "5", 
        precioCosto: "20", 
        importe: "100"
      }).save()),
      (await ingreso2).detalleIngreso.push((await di4)._id),
      (await product4).stock = "5",
    ]);
    (await ingreso1).save(), (await ingreso2).save(), (await product1).save,(await product2).save,(await product3).save, (await product4).save;

    console.log("9 - bootstrap for detalles de ingreso...ok");

    let salida1;
    let salida2;
    let salida3;
    const countSalida= await Salida.estimatedDocumentCount();
    if (countSalida > 0) return;
    await Promise.all([
      (salida1= new Salida({
        comprobante: (await comprobante2)._id,
        serie:"TK",
        correlativo: "1",
        cliente: (await client1)._id,
        subTotal: "40",
        impuesto: "00",
        total: "40",
        cantidadProductos:2,
        tienda: (await tienda1)._id,
        author: admin._id,
      }).save()),
      (salida2= new Salida({
        comprobante: (await comprobante2)._id,
        serie:"TK",
        correlativo: "2",
        cliente: (await client2)._id,
        subTotal: "15",
        impuesto: "0",
        total: "15",
        cantidadProductos:1,
        tienda: (await tienda1)._id,
        author: admin._id,
      }).save()),
      (salida3= new Salida({
        comprobante: (await comprobante2)._id,
        serie:"TK",
        correlativo: "3",
        cliente: (await client1)._id,
        subTotal: "44",
        impuesto: "0",
        total: "44",
        cantidadProductos:2,
        tienda: (await tienda1)._id,
        author: admin._id,
      }).save()),
    ]);
    console.log("10- bootstrap for salida...ok");

    let dp1;
    let dp2;
    let dp3;
    let dp4;
    let dp5;
    await Promise.all([
      (dp1 = new DetallePago({
        monto: "30", 
        formaPago: (await fp1)._id,
        nameFormaPago: (await fp1).name
      }).save()),
      (await salida1).detallesPago.push((await dp1)._id),
      (dp2 = new DetallePago({
        monto: "10", 
        formaPago: (await fp2)._id,
        nameFormaPago: (await fp2).name
      }).save()),
      (await salida1).detallesPago.push((await dp2)._id),
      (dp3 = new DetallePago({
        monto: "15", 
        formaPago: (await fp1)._id,
        nameFormaPago: (await fp1).name
      }).save()),
      (await salida2).detallesPago.push((await dp3)._id),
      (dp4 = new DetallePago({
        monto: "14", 
        formaPago: (await fp1)._id,
        nameFormaPago: (await fp1).name
      }).save()),
      (await salida3).detallesPago.push((await dp4)._id),
      (dp5 = new DetallePago({
        monto: "30", 
        formaPago: (await fp2)._id,
        nameFormaPago: (await fp2).name
      }).save()),
      (await salida3).detallesPago.push((await dp5)._id),
    ]);
    (await salida1).save(), (await salida2).save(), (await salida3).save;

    console.log("11 - bootstrap for detalle pago...ok");

    //creamos los detalles de salida 
    let ds1;
    let ds2;
    let ds3;
    let ds4;
    await Promise.all([
      (ds1 = new DetalleSalida({
        product: (await product1)._id,
        nombreProduct: (await product1).name,
        simbolUnidadMedida: (await um1).simbol,
        cantidad: "1", 
        precio: "15", 
        importe: "15"
      }).save()),
      (await salida1).detallesSalida.push((await ds1)._id),
      (await product1).stock = "19",
      (ds2 = new DetalleSalida({
        product: (await product2)._id,
        nombreProduct: (await product2).name,
        simbolUnidadMedida: (await um1).simbol,
        cantidad: "1", 
        precio: "25", 
        importe: "25"
      }).save()),
      (await salida1).detallesSalida.push((await ds2)._id),
      (await product2).stock = "19",
      (ds3 = new DetalleSalida({
        product: (await product3)._id,
        nombreProduct: (await product3).name,
        simbolUnidadMedida: (await um1).simbol,
        cantidad: "1", 
        precio: "17", 
        importe: "17"
      }).save()),
      (await salida2).detallesSalida.push((await ds3)._id),
      (await product3).stock = "4",
      (ds4 = new DetalleSalida({
        product: (await product4)._id,
        nombreProduct: (await product4).name,
        simbolUnidadMedida: (await um1).simbol,
        cantidad: "1", 
        precio: "27", 
        importe: "27"
      }).save()),
      (await salida2).detallesSalida.push((await ds4)._id),
      (await product4).stock = "4",
    ]);
    (await salida1).save(), (await salida2).save(), (await product1).save,(await product2).save,(await product3).save, (await product4).save;

    console.log("12 - bootstrap for detalle salida...ok");
    


    console.log("13 - bootstrap total ...ok");
  } catch (error) {
    console.log(error);
  }
};