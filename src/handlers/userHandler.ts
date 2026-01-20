import { errorCodes } from "../constants/errorCodes";
import { errorMessages } from "../constants/errorMessages";
import { UserErrorMessages } from "../constants/userErrorMessag";
import { Exception } from "../helpers/exception";
import { User } from "../models/users.model";

import { createUser } from "../types/types";

export class userHandler {


     //create user... must send hashed password here 

    static async createUser(data: createUser , hashedPassword: string): Promise<User>{
        const newUser = await User.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
            userType: data.userType,
            phoneNumber: data.phoneNumber
        })  
     return newUser
    }


    static async findUserByEmail(email: string): Promise<User | null> {
        const user: (User | null) = await User.findOne({
            where: {email: email}
        })

       return user
    }

    //find all 
    static async getAllUsers(): Promise<User[]> {
        const users: (User[] | null ) = await User.findAll()
        return users
    }

    //find by role
    static async getUserByRole(role: string): Promise<User | null> {
        const user: (User | null) = await User.findOne({
            where : {userType: role}
        })
        return user
    }

    //find by id 
    static async findById(id: number): Promise<User>{
        console.log(`in user handler to get user by its id and type of id is  ${typeof id} and value is ${id}`)
        const user = await User.findByPk(id)
        if(!user){
            throw new Exception(UserErrorMessages.USER_NOT_FOUND , errorCodes.BAD_REQUEST)
        }
        return user
    }

}