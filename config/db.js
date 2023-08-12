import mongoose from 'mongoose';
import colors from 'colors';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log('Connect to mongodb database'.bhMagenta.white);
    }
    catch (error) {
        console.log(`Error in mongodb ${error}`.bgRed.white);
    }
}

export default connectDB;


// mongoose.connect("mongodb://127.0.0.1:27017/iNotebook", { useNewUrlParser: true });

// const db = mongoose.connection;

// db.on("error", function () {
//     console.log("Mongo DB not connected")
// })
// db.once("open", function () {
//     console.log("Successfully connected with mongo db")
// })


// module.exports = db;