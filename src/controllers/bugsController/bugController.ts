
import { Request, Response , NextFunction } from "express";
import { createBug } from "../../types/types";
import { BugManagr } from "./bugsManager";
import { successCodes } from "../../constants/sucessCodes";
import { successMessages } from "../../constants/sucessMessages";
import { Bug, status } from '../../models/bug.model';
import { getBugs } from "../../types/types";

export class BugController{

    static async  createBug(req: Request<{},{},createBug> , res: Response , next: NextFunction){
        try{
            let imgurl = null 
            if (req.file) {
               imgurl = `/uploads/bugs/${req.file.filename}`;
            }
            console.log('img path' , imgurl)
            console.log('data is ' , req.body)
            await BugManagr.createBug(req.body , Number(req.user?.id) , String(imgurl))
            
            return res.status(successCodes.CREATED).json({
                sucess: true,
                message: successMessages.MESSAGES.CREATED
            })

        }catch(error){
            console.log('inside catch of createbug function in bugController')
            next(error)
        }
    }


    static async getAllBugs(req: Request<{projectId: string}> , res: Response<getBugs> , next: NextFunction){
        try{
            const bugs: Bug[] = await BugManagr.getBugs(Number(req.params.projectId) , Number(req.user?.id) , String(req.user?.userType))
            return res.status(successCodes.OK).json({
                succees: true,
                count: bugs.length,
                message: successMessages.MESSAGES.FETCHED,
                data: bugs,
            })

        }catch(error){
            next(error)
        }
    }

    static async updateBugStatus(req: Request<{bugId: string} , {} , {bugStatus: status}> , res: Response , next: NextFunction){
        try{

            const {bugStatus} = req.body
            console.log('bugstatus value : ' , bugStatus)
            await BugManagr.updateBugStatus(Number(req.params.bugId) , bugStatus , Number(req.user?.id))
            return res.status(successCodes.NO_CONTENT).json({
                sucess: true,
                message: successMessages.MESSAGES.UPDATED
            })

        }catch(error){
            next(error)
        }


    }
}