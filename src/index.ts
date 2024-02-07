import express , { Request , Response} from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';
import { error } from 'console';
import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import cookieParser from "cookie-parser";

// Mongodb connection

const connectDB= async  () =>{
     return await mongoose.connect(`${process.env.MONGODB_CONNECTION_STRING}`)
}

connectDB().then(()=>{
    console.log("*****Database Connected*****")
}).then(()=>{
    app.listen(4000, ()=> {
        console.log("Server running on 4000")
    })
}).catch((error)=>{
    console.log("MongoDB Error : " ,error)
    process.exit(1)
})


const app = express();

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}))

// api handling 

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

