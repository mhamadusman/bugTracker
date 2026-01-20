import { NextFunction, Request , Response } from 'express';
import { User } from '../../models/users.model';
import { userHandler } from '../../handlers/userHandler';
import { UserUtil } from '../../utilities/userUtil';
import { successCodes } from '../../constants/sucessCodes';



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
    static async getProfile(req: Request , res: Response , next: NextFunction){
        try{
            const user = await userHandler.findById(Number(req.user?.id))
            return res.status(successCodes.OK).json({
                sucess: true,
                data: user
            })
        }catch(error){
            next(error)
        }
    }
}