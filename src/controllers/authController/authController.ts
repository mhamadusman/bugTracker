import { Request , Response , NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from '../../config/custome_variables.json'
import { User } from "../../models/users.model";
import { AuthManager } from "./authManager";
import { successMessages } from "../../constants/sucessMessages";
import { Exception } from "../../helpers/exception";

import { createUser, signUpResponse} from '../../types/types';
import { PassThrough } from "node:stream";


class AuthController{
  static async signUp(req: Request<{}, signUpResponse, createUser> , res: Response<signUpResponse> , next: NextFunction){
       try {
        
          const data = await AuthManager.signUp(req.body)
          return res.status(200).json({
            sucess: true,
            message: `user ${successMessages.MESSAGES.CREATED}`,
            user_id: data.id,
            email: data.email
          })
          
        } catch (error: unknown) {
          next(error)
        }
    
  }
  static async login(req: Request<{},{},{email: string , password: string}> , res: Response<{message: string, token?: string}> , next: NextFunction){

    try {
    const token = await AuthManager.login(req.body.email , req.body.password)

    return res.status(200).json({
      message: "Authorized",
      token: token
    });

  } catch (error) {
    next(error);
  }
  }
}


export default AuthController