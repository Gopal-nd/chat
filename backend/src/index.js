
import express from 'express'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";
import { fileURLToPath } from 'url';

import authRouter from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js"
import {app, server} from './lib/socket.js'
import { connectDB } from './lib/db.js';
import bodyParser from 'body-parser';

dotenv.config();

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
const PORT = process.env.PORT;

app.use("/api/auth",authRouter);
app.use("/api/messages",messageRoutes);



const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}


server.listen(PORT,()=>{
  connectDB();
  console.log("server is running on port : "+PORT)
});
