import { Router } from "express";
import { UserController } from "../controllers/userController/userController";
import { Authentication } from "../middleWares/authentication";
import { userHandler } from "../handlers/userHandler";
import { uploadUserImage } from "../middleWares/upload";

export const router = Router()

router.get('/' , UserController.getAllUsers) 
router.get('/me' , Authentication.authenticate , UserController.getProfile)
router.patch('/update' , Authentication.authenticate , uploadUserImage.single('image') , UserController.updateProfile)
//router.get('/:id' ,  Authentication.authenticate , UserController.getUser)
router.get('/:projectId' , Authentication.authenticate , UserController.getDevelopers)

