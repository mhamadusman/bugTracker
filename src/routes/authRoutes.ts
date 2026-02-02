import { Router } from "express";
import { Authentication } from "../middleWares/authentication";
import AuthController from "../controllers/authController/authController";



export const authRoutes = Router()
authRoutes.post('/sign-up' , AuthController.signUp)
authRoutes.post('/login' , AuthController.login)
authRoutes.post ('/refresh-token' , Authentication.authenticateRefreshToken , AuthController.refreshToken)

