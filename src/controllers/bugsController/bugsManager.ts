import { createBug } from "../../types/types";
import { Bug, status } from "../../models/bug.model";
import { bugHandler } from "../../handlers/bugsHandler";
import { BugUtil } from "../../utilities/bugUtils";
import { ProjectUils } from "../../utilities/projectUtils";


export class BugManagr{

    static async createBug(data: createBug , userId: number): Promise<void>{
        await BugUtil.validateBugRequest(data)
        //check title scop
        //validat project 
        await ProjectUils.validateProjectId(data.projectId) 
        
        await BugUtil.validateBugTitle(data.title , data.projectId)
        await bugHandler.createBug(data , userId)
        return 
    }

    static async getBugs(projectId: number , userId: number , userType: string): Promise<Bug[]>{

        //validate project id 
        await ProjectUils.validateProjectId(projectId)

        const bugs: Bug[] = await BugUtil.getBugs(projectId , userId , userType)
        return bugs

    }

    //update bug status developere duty 
    static async updateBugStatus(bugId: number , bugStatus: status , userId: number){
        console.log('we are here to update bug status...')
        console.log(typeof  bugStatus)
        //validat bug is connect to actual developer 
        await BugUtil.authorizeDeveloper(bugId , userId)
        
        await BugUtil.validateBugStatus(bugStatus)
        
       

        //now save
        await bugHandler.updateBugStatus(bugStatus , bugId)
    }
}