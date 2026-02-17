import { Router } from "express";
import { UserController } from "../controllers/userController/userController";
import { Authentication } from "../middleWares/authentication";
import { uploadUserImage } from "../middleWares/upload";

export const router = Router()

router.get('/' , Authentication.authenticate , UserController.getAllUsers) 
router.get('/me' , Authentication.authenticate , UserController.getProfile)
router.patch('/update' , Authentication.authenticate , uploadUserImage.single('image') , UserController.updateProfile)
router.get('/:projectId' , Authentication.authenticate , Authentication.autorizeSQArole , UserController.getDevelopers) //Will return developers to sqa

