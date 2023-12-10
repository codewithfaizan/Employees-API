import mongoose from "mongoose";
import config from "config";

const dbConnect = async () => {
    try {
        await mongoose.connect(config.get("DB_URI"));

        console.log("DB connected Successfully")
    } catch (error) {
        console.error(error)
    }
}

export default dbConnect();