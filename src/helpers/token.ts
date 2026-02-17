import jwt from "jsonwebtoken";
import { errorMessages } from "../constants/errorMessages";

export class token {
    static async getLoginToken(userid: number): Promise<string> {
        const secret  = process.env.JWT_ACCESS_TOKEN_SECRET
        const expiry = ( process.env.JWT_ACCESS_TOKEN_EXPIRY ) as any
        if(!secret){
            throw new Error(errorMessages.MESSAGES.JWT_ACCESS_KEY_NOT_PRESENT)
        }
        const token = jwt.sign({userId: userid}, secret, { expiresIn: expiry })
        return token 
    }
    static async getRefreshToken(userid: number): Promise<string>{
        const secret  = process.env.JWT_REFRESH_TOKEN_SECRET
        const expiry = ( process.env.JWT_REFRESH_TOKEN_EXPIRY ) as any
        if(!secret){
            throw new Error(errorMessages.MESSAGES.JWT_REFRESH_KEY_NOT_PRESENT)
        }
        const refresTokn = jwt.sign({userId: userid} , secret , {expiresIn: expiry})
        return refresTokn
    }

}