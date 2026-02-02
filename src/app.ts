import morgan from "morgan";
import cors from "cors"
import { Request, Response, NextFunction } from "express";
import express from "express";
import cookieParser from "cookie-parser";
import { Exception } from "./helpers/exception";
import { authRoutes } from "./routes/authRoutes";
import {router as projectRoutes} from './routes/projectRoutes'
import {router as userRoutes } from './routes/userRoutes'
import { errorCodes } from "./constants/errorCodes";
import { errorMessages } from './constants/errorMessages';
import {router as bugRoutes} from './routes/bugRoutes'

export const app = express();


app.use(cors({
  origin: "http://localhost:3001",
  credentials: true,
}));

app.use(cookieParser());

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));


app.use('/auth' , authRoutes)


//user routes 
app.use('/users', userRoutes)

//project routees
app.use('/projects' ,  projectRoutes)

//bugs routes 
app.use('/bugs', bugRoutes)

app.use('/uploads', express.static('public/uploads'))
app.use((req: Request, res: Response, next: NextFunction) => {
    throw new Exception(errorMessages.MESSAGES.PAGE_NOT_FOUND , errorCodes.DOCUMENT_NOT_FOUND)
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    if(error instanceof Exception){
      console.log('this is inside main error middleware')
      console.log(error)
      return res.status(error.statusCode).json({
        sucess: false,
        message: error.message ? error.message : errorMessages.MESSAGES.SOMETHING_WENT_WRONG
      })
    }
    console.error(error)
    return res.status(errorCodes.INTERNAL_SERVER_ERROR).json({
      sucess: false,
      message: errorMessages.MESSAGES.INTERNAL_SERVER_ERROR
    })
});
