import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";


dotenv.config();
connectDb();
const app = express();

app.use(cors());
app.use(express.json());
app.use(logger('tiny'));
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));


app.use("/api/v1/auth", authRoutes);

    
app.listen(process.env.PORT, () => {
  console.log(
    `Server Running on port ${process.env.PORT} in ${process.env.MODE}`
  );
});
