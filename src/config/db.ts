import mongoose from "mongoose";
import colors from 'colors';

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.DATABASE_URL);
        console.log(colors.bgMagenta(`[BBDD] Connected at: ${connection.connection.host}:${connection.connection.port}`));
        
    } catch (error) {
        console.log(colors.bgRed(`[BBDD] error: ${error.message}`));
        process.exit(1)
    }
}