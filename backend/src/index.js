
import express from 'express'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import authRouter from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js"

import { connectDB } from './lib/db.js';

dotenv.config();
const app = express();

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
app.use("/api/message",messageRoutes);

app.listen(PORT,()=>{
  connectDB();
  console.log("server is running on port : "+PORT)
});
