// we will connect to our database here:-
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


 const connectDB = async() => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected DB host: ${connectionInstance.connection.host} `);  //this "host" is used to specify that on which host we are getting connected to is it database of production or development or testing      
    } catch (error) {
        console.error("MONGODB CONNECTION ERROR", error);
        process.exit(1)
    }
}

export default connectDB