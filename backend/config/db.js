import mongoose from 'mongoose'
import {MONGODB_URI} from "./environments.js";

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log(`Connected to DB`);
    } catch (error) {
        console.log(`Failed to connect to DB: ${error}`);
    }
}