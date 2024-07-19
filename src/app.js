import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import viewsRouter from "./routes/views.js";
import ProductManager from "./dao/fs/products-manager.js";
import "./database.js";
//import displayRoutes from "express-routemap";

// Inicialización de la aplicación
const app = express();
const PUERTO = 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

// Configuración de Handlebars como motor de plantillas
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Ruta de bienvenida
app.get("/", (req, res) => {
    res.send("BIENVENIDOS A LA CAFETERIA MAROLIO CON MONGOOSE");
});

// Rutas API
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// Inicialización del servidor HTTP
const httpServer = app.listen(PUERTO, () => {
    //displayRoutes(app);
    console.log(`El servidor está en el puerto ${PUERTO}`);
});

// Inicialización del ProductManager
const productManager = new ProductManager("./src/data/products.json");

// Inicialización del servidor de Socket.IO
const io = new Server(httpServer);

io.on("connection", async (socket) => {
    console.log("Un Cliente se conectó");

    // Enviar lista de productos al cliente al conectarse
    socket.emit("productos", await productManager.getProducts());

    // Manejo del evento de eliminar producto
    socket.on("eliminarProducto", async (id) => {
        await productManager.deleteProduct(id);
        // Enviar lista actualizada de productos a todos los clientes
        io.sockets.emit("productos", await productManager.getProducts());
    });

    // Manejo del evento de agregar producto
    socket.on("agregarProducto", async (producto) => {
        await productManager.addProduct(producto);
        // Enviar lista actualizada de productos a todos los clientes
        io.sockets.emit("productos", await productManager.getProducts());
    });
});
