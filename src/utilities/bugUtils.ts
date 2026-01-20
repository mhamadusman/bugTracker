import { createBug } from '../types/types';
import { UserErrorMessages } from "../constants/userErrorMessag";
import { Exception } from "../helpers/exception";
import { errorCodes } from "../constants/errorCodes";
import { Bug, BugType } from "../models/bug.model";
import { status } from '../models/bug.model';
import { bugHandler } from '../handlers/bugsHandler';



export class BugUtil{

    static async validateBugRequest(data: createBug): Promise<void> {
            
        if (!data.title || data.title.trim() === "" || !data.description || data.description.trim() === "" || 
            !data.deadline || !Object.values(BugType).includes(data.type) || !Object.values(status).includes(data.status)
            || !data.projectId || !data.developerId ) {
        throw new Exception(UserErrorMessages.INcOMPELETE_DATA_TO_CREATE_PROEJECT , errorCodes.BAD_REQUEST);
        }
        return;
    }

    static async validateBugTitle(title: string, projectId: number): Promise<void> {
            const bug:  ( Bug | null )  = await Bug.findOne({
             where: {
              title,
             projectId
             }
         });
         if(bug){
            throw new Exception(UserErrorMessages.DUPLICATE_BUG_WITH_PROJECT_SCOPE , errorCodes.BAD_REQUEST)

         }
    }

    //get all bugs related to a project 
    static async getBugs(projectId: number , userId: number , userType: string): Promise<Bug[]>{


            let bugs: Bug[] = []
            let sqaId: number = userId
            let developerId: number = userId

            if(userType === "sqa"){
                 bugs = await Bug.findAll({
                 where:{projectId , sqaId}
                 })
            }else{
                 bugs = await Bug.findAll({
                 where:{projectId , developerId}
                 })
            }
           
        return bugs
    }
    static async validateBugStatus(bugStatus: status){

        if(!Object.values(status).includes(bugStatus)){
            throw new Exception(UserErrorMessages.INVALID_DATA , errorCodes.BAD_REQUEST)
        }
    }
    static async authorizeDeveloper(bugId: number , userId: number): Promise<void>{
        const bug = await bugHandler.getbugByID(bugId , userId)
        if(!bug){
            throw new Exception(UserErrorMessages.INVALID_REQUEST_STATE, errorCodes.BAD_REQUEST)
        }
        return 
    }


}

   