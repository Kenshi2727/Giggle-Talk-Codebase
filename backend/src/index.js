import express from 'express';
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { app, server } from './lib/socket.js';
import path from 'path';
dotenv.config();

const port = process.env.PORT || 3000;
// const app = express();

const __dirname = path.resolve();

//middleware to parse json data from request body(req.body)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());//middleware to parse cookies from request
app.use(cors({
    origin: "http://localhost:5173",//frontend url
    credentials: true,// Allow cookies or auth headers to be sent with requests
}));//middleware to enable CORS

app.use("/api/auth", authRoutes);//mounting middleware
app.use("/api/messages", messageRoutes);

// app.listen(port, () => {
//     console.log("Server is running on port " + port)
//     connectDB();
// });

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));// entry point for react app
    });
}

server.listen(port, () => {
    console.log("Server is running on port " + port)
    connectDB();
});
