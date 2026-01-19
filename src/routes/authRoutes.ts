import { Router } from "express";

import AuthController from "../controllers/authController/authController";



export const authRoutes = Router()
authRoutes.post('/sign-up' , AuthController.signUp)
authRoutes.post('/login' , AuthController.login)

