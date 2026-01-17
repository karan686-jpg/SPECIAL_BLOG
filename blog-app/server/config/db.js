import mongoose from "mongoose";

const connectDB= async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Mongodb connected");
    }
    catch(error){
        console.error('Mongodb failed',error.message);
        
    }
};
export default connectDB;
