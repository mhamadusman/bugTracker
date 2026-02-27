import morgan from "morgan";
import cors from "cors";
import { Request, Response, NextFunction } from "express";
import express from "express";
import cookieParser from "cookie-parser";
import { Exception } from "./helpers/exception";
import { authRoutes } from "./routes/authRoutes";
import { router as projectRoutes } from "./routes/projectRoutes";
import { router as userRoutes } from "./routes/userRoutes";
import { errorCodes } from "./constants/errorCodes";
import { errorMessages } from "./constants/errorMessages";
import { router as bugRoutes } from "./routes/bugRoutes";


const app = express();
const corsOptions = {
  origin: process.env.FRONT_END_URL, 
  methods: 'GET,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/projects", projectRoutes);
app.use("/bugs", bugRoutes);
app.use("/uploads", express.static("public/uploads"));

//page not found 
app.use((req: Request, res: Response, next: NextFunction) => {
  throw new Exception(
    errorMessages.MESSAGES.PAGE_NOT_FOUND,
    errorCodes.DOCUMENT_NOT_FOUND,
  );
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error('actual error from request :: ' , error)
  if (error instanceof Exception) {
    return res.status(error.statusCode).json({
      message: error.message || errorMessages.MESSAGES.SOMETHING_WENT_WRONG,
      errors: error.errors || [] 
    });
  }

  return res.status(errorCodes.INTERNAL_SERVER_ERROR).json({
    message: errorMessages.MESSAGES.INTERNAL_SERVER_ERROR,
  });
});



export default app