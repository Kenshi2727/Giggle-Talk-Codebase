import express from 'express';
import authRoutes from './routes/auth.route.js'
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './lib/db.js';
dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());//middleware to parse json data from request body(req.body)

app.use("/api/auth", authRoutes);//mounting middleware

app.listen(port, () => {
    console.log("Server is running on port " + port)
    connectDB();
});
