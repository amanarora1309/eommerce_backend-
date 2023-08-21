import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv'
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'
import cors from 'cors'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import path from 'path';

// create __dirname
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

//configure env
dotenv.config()

// database config
connectDB();

// rest object
const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, './client/build')))

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes)
app.use("/api/v1/product", productRoutes)
app.use("/static", express.static(__dirname + '/uploads'));

// rest api
app.use("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
})

// app.use("/", (req, res) => {
//     res.send("<h1>Welcome to ecommerce app</h1>");
// });

//PORT
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`server Running on ${PORT}`.bgCyan.white);
});

