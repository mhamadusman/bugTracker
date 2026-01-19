import { Router } from "express";
import { UserController } from "../controllers/userController/userController";

export const router = Router()

router.get('/' , UserController.getAllUsers)  //create controller functions, and controller manager and userhandler