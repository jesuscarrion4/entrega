import mongoose from "mongoose";

mongoose.connect("mongodb+srv://jesusdcarriong:hola123@jesus.bpi5mzd.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=jesus")
    .then( () => console.log("Conexión exitosa a la Base de Datos!!"))
    .catch( (error) => console.log("Ups!! ha ocurrido un error", error))
