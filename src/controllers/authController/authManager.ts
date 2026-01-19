
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from '../../config/custome_variables.json'
import { User } from "../../models/users.model";
import { createUser , signUpResponse} from "../../types/types";
import { AuthUtils } from "../../utilities/authUtils";
import { userHandler } from "../../handlers/userHandler";

export class AuthManager{

    static async signUp(data: createUser): Promise<User> {


        //validate data
        AuthUtils.validateUserDataForSignUp(data)
        console.log('data is validated...')

        //validate email
        await AuthUtils.checkEmail(data.email)
        
        AuthUtils.validatePasswordLength(data.password)
        console.log('password validated....')

        const hashedPassword  = await AuthUtils.createHashedPassword(data.password)
        console.log('password hashed')
        //craete user
        const newUser  = await userHandler.createUser(data , hashedPassword)

        console.log('user created........')
        console.log(newUser)
        return newUser

    }

    static async login(email: string , password: string): Promise<string>{
        const token = await  AuthUtils.validateLoginReqeust(email , password)
        return token


    }
}