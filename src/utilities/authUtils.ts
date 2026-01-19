//validat data // validate email // validat password length //  create hashpassword // 

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from '../config/custome_variables.json'
import { User } from "../models/users.model";
import { token } from "../helpers/token";
import { errorCodes } from "../constants/errorCodes";
import { Exception } from "../helpers/exception";
import { UserErrorMessages } from "../constants/userErrorMessag";
import { errorMessages } from "../constants/errorMessages";
import { createUser } from "../types/types";
import { userHandler } from "../handlers/userHandler";
import { UserTypes } from "../types/types";

export class AuthUtils {


    //validate requested data 
    static validateUserDataForSignUp(data: createUser){
        const { name, email, password, userType, phoneNumber } = data;
        console.log(`inside validate signup data ${name} , ${email}`)
        if(!name?.trim() || !email?.trim() || !userType?.trim() || !phoneNumber || !password?.trim()){
            console.log('inside if block to throw error in validate sign up data ')
            throw new Exception(UserErrorMessages.USER_DATA_INCOMPLETE , errorCodes.BAD_REQUEST)
        }

        //now validating usertype
        const types  = Object.values(UserTypes)
        if(!types.includes(userType)){
            throw new Exception(UserErrorMessages.INVALID_USER_TYPE , errorCodes.BAD_REQUEST)
        }   


    }

    //validate password length 

    static validatePasswordLength(password: string){
        
        if(password.trim().length < 8)
        {
            throw new Exception(UserErrorMessages.PASSWORD_TOO_SHORT , errorCodes.BAD_REQUEST)
        }
    }

    //craete hash pass word 
    static async createHashedPassword (password: string): Promise<string> {

        password = await bcrypt.hash(password, 10);

        return password;
  }

  //check email already exist or not 

  static async checkEmail(email: string){
    const userEmail = await userHandler.findUserByEmail(email)
    if(userEmail){
        throw new Exception(UserErrorMessages.USER_ALREADY_EXISTS , errorCodes.CONFLICT_WITH_CURRENT_STATE)
    }
  }

  //validate login request 

  static async validateLoginReqeust(email: string , password: string): Promise<string> {
     
    const user = await userHandler.findUserByEmail(email)
    if(!user){
        throw new Exception(UserErrorMessages.INVALID_CREDENTIALS , errorCodes.UNAUTHORIZED)
    }

    //check password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new Exception(UserErrorMessages.INVALID_CREDENTIALS , errorCodes.UNAUTHORIZED)
    }

    //get token
    const userToken  = await token.getLoginToken(user.id)
    return userToken
  }
  

}

    
 
