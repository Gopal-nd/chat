
import express from 'express'
import dotenv from 'dotenv'

import authRouter from "./routes/auth.route.js";
import { connectDB } from './lib/db.js';

dotenv.config();
const app = express();

app.use(express.json());
const PORT = process.env.PORT;

app.use("/api/auth",authRouter);

app.listen(PORT,()=>{
  connectDB();
  console.log("server is running on port : "+PORT)
});
