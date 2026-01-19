//find user with email


import { errorCodes } from "../constants/errorCodes";
import { Exception } from "../helpers/exception";
import { UserErrorMessages } from "../constants/userErrorMessag";
import { errorMessages } from "../constants/errorMessages";
import { createUser } from "../types/types";
import { User } from "../models/users.model";

export class UserUtil {


   
    static  async findUserWithEmail(email: string){
        const user  = await User.findOne({
            where: {email: email}
        })
        if(user)
        {
            throw new Exception(UserErrorMessages.USER_ALREADY_EXISTS , errorCodes.CONFLICT_WITH_CURRENT_STATE)
        }
    }
}