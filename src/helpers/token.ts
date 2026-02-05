import jwt from "jsonwebtoken";
import config from '../config/custome_variables.json'

export class token {
    static async getLoginToken(userid: number): Promise<string> {
        const token = jwt.sign({userId: userid}, config.jwt_key,  { expiresIn: "7d" })
        return token 
    }
    static async getRefreshToken(userid: number): Promise<string>{
        const refresTokn = jwt.sign({userId: userid} , config.REFRESH_TOKEN_SECRET, {expiresIn: "7d"})
        return refresTokn
    }

}