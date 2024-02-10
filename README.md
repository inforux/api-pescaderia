# API REST PESCADERIA - NODEJS CON MONGODB

Gestión de ventas, usuarios, productos, compras, clientes. 

Soporte JWT como seguridad para la autenticación (login).

Integración nativa con MONGODB.

Basado en NodeJs con Express.

## Instalación

Sigue estos pasos para instalar y ejecutar el proyecto:

1. **Clonar el proyecto**

    Para obtener una copia local del proyecto, clónalo:

    ```bash
    git clone https://github.com/inforux/api-pescaderia.git


2. ** Instalar dependencias **
    Navega hasta el directorio del proyecto y ejecuta el siguiente comando para instalar todas las dependencias necesarias: 

    ```bash
    cd api-pescaderia
    npm install


3. ** Configurar las variables de entorno  **
    Crea un archivo .env en la raíz del proyecto y añade las siguientes variables de entorno:

    ```bash
    JWT_SECRET=your_jwt_secret
    JWT_SECRET_REFRESH=your_jwt_secret_refresh
    ORIGIN=your_origin
    PORT=your_port
    MONGO_URI=your_mongo_uri


4. ** Ejecutar el poryecto **
    Finalmente, puedes ejecutar el proyecto con el siguiente comando: 

    ```bash
    npm run dev


## Nota Importante

Este proyecto funciona con MongoDB. Es necesario tener configurado el servidor MongoDB con una base de datos llamada "pescaderia". Cuando el proyecto se conecte por primera vez, generará datos de prueba.
Ademas importante tener el URI mongo en el archivo .env


## Imágenes

### Servicio Login, con integración JWT
![Servicio Login](/src/images/login.jpg)

### Servicio que obtiene el listado general de productos
![Listado de Productos](/src/images/listProductos.jpg)

### Servicio que retorna datos para análisis de datos en ChartJS
![Reportes](/src/images/reportes.jpg)