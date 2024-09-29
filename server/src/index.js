import dotenv from "dotenv"
import connectDB from "./config/db.js"
import { app } from "./server.js"
dotenv.config({path:"./env"});

connectDB().then(
    app.listen(process.env.PORT||8000,()=>{
        console.log(`Server running on port : ${process.env.PORT}`)
    })
).catch((err)=>{
    console.log("MongoDB connection failed !!!",err)
})