import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from '../config/custome_variables.json'

import { userHandler } from "../handlers/userHandler";

import { Request, Response , NextFunction } from "express";
import { Exception } from "../helpers/exception";
import { UserErrorMessages } from "../constants/userErrorMessag";
import { errorCodes } from "../constants/errorCodes";
import { errorMessages } from "../constants/errorMessages";
import { User } from "../models/users.model";

interface myJwtType extends JwtPayload{
    userId : number 
}



declare global {
  namespace Express {
    interface Request {
      user?: User ; 
    }
  }
}

export class Authentication{

    static async authenticate(req: Request, res: Response , next: NextFunction){
        
     const authorization = req.headers.authorization
    if(!authorization)
    {
       return res.status(errorCodes.UNAUTHORIZED).json({
            message: UserErrorMessages.ACCESS_DENIED
        })
        
    }
    console.log(`authorization header: ${req.headers.authorization}`)
    const token  = authorization?.split(' ')[1]
    console.log(token)
    try{
        console.log('inside try of authentication ')
        const decode = jwt.verify(token , config.jwt_key) as myJwtType
        console.log(`here is decoded value of jwt ${decode}`)

        console.log(`here is decode value ${decode.userId}`)
        const user =  await userHandler.findById(decode.userId)
        if(!user){
            throw new Exception (UserErrorMessages.ACCESS_DENIED , errorCodes.UNAUTHORIZED)
        }
        console.log(`here is user details for rol verificatin : ${user?.email}`)

        req.user = user
        
        next()
     

    }catch(error){
        console.log('inside catch of authentication function')
        res.status(errorCodes.UNAUTHORIZED).json({
            message: UserErrorMessages.ACCESS_DENIED
        })
    }
    }

    //check manager role autherization 

    static async autorizeManagerRole(req: Request , res: Response , next: NextFunction){
        try{
            console.log('inside authorization for user role')
            console.log(req.body)
            console.log('this is the user details which i attach to req , ' , req.user)

         //   const user  = await userHandler.findById(Number(req.body.managerId))
            if(req.user?.userType === 'manager'){
                console.log(`this is the user : ${req.user?.name} : ${req.user?.userType}`)
                console.log('role is verified for manager ')
                return next()
            }else{
                console.log('user not verified...')
            }
           throw new Exception(UserErrorMessages.ACCESS_DENIED, errorCodes.UNAUTHORIZED)
        }catch(error){
            next(error)
        }
    }

    //validat sqa role for creating bug

    static async autorizeSQArole(req: Request , res: Response , next: NextFunction){
        try{
            console.log(req.body)
            console.log('this is the user details which i attach to req , ' , req.user)

         //   const user  = await userHandler.findById(Number(req.body.managerId))
            if(req.user?.userType === 'sqa'){
                console.log(`this is the user : ${req.user?.name} : ${req.user?.userType}`)
                console.log('role is verified for sqa role ')
                return next()
            }else{
                console.log('user not verified...')
            }
           throw new Exception(UserErrorMessages.ACCESS_DENIED, errorCodes.UNAUTHORIZED)
        }catch(error){
            next(error)
        }
    } 

    static async autorizeDeveloperRole(req: Request , res: Response , next: NextFunction){
        try{
            console.log(req.body)
            console.log('this is the user details which i attach to req , ' , req.user)

         //   const user  = await userHandler.findById(Number(req.body.managerId))
            if(req.user?.userType === 'developer'){
                console.log(`this is the user : ${req.user?.name} : ${req.user?.userType}`)
                console.log('role is verified for developer role ')
                return next()
            }else{
                console.log('user not verified...')
            }
           throw new Exception(UserErrorMessages.ACCESS_DENIED, errorCodes.UNAUTHORIZED)
        }catch(error){
            next(error)
        }
    } 

}