import { Router } from "express";
import { UserController } from "../controllers/userController/userController";
import { Authentication } from "../middleWares/authentication";

export const router = Router()

router.get('/' , UserController.getAllUsers)  //create controller functions, and controller manager and userhandler
router.get('/me' , Authentication.authenticate , UserController.getProfile)