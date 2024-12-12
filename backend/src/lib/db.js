import mongoose from 'mongoose'

export const connectDB = async()=>{

  try{
    const connnect = await mongoose.connect(process.env.MONGODB_URI);
    console.log(" db connected");
  }catch(err){
    console.log(err);
  }
}
