import { NextFunction, Request , Response } from 'express';
import { User } from '../../models/users.model';
import { userHandler } from '../../handlers/userHandler';



export class UserController{

    //get all users
    static async getAllUsers(req: Request, res: Response, next: NextFunction){

        try{
            const users: (User[] | null) = await userHandler.getAllUsers()
            return res.status(200).json({
                success: true,
                count: users.length,
                message: `total number of users are ${users.length}`,
                data: users, 
            })

        }catch(error){
            next(error)
        }


    }
}