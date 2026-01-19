
import jwt from "jsonwebtoken";
import config from '../config/custome_variables.json'

export class token {
    static async getLoginToken(userid: number): Promise<string> {

        const token = jwt.sign({userId: userid}, config.jwt_key,  { expiresIn: "10m" })
        return token 
    }
}