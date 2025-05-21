import express from 'express';
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());//middleware to parse json data from request body(req.body)
app.use(cookieParser());//middleware to parse cookies from request
app.use(cors({
    origin: "http://localhost:5173",//frontend url
    credentials: true,// Allow cookies or auth headers to be sent with requests
}));//middleware to enable CORS

app.use("/api/auth", authRoutes);//mounting middleware
app.use("/api/message", messageRoutes);

app.listen(port, () => {
    console.log("Server is running on port " + port)
    connectDB();
});
