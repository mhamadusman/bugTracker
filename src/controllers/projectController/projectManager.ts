import { createProject, projectCreationResponse, project } from '../../types/types';

import { ProjectUils } from "../../utilities/projectUtils";
import { ProjectHandler } from "../../handlers/projectHandlers";
import { userHandler } from "../../handlers/userHandler";
import { User } from "../../models/users.model";



export class projectManager{
    static async createProject(data: createProject): Promise<project>{
      //validate projct data 
      await ProjectUils.validateCreateProject(data)
      

      //create project
      const newProject: project  = await ProjectHandler.createProject(data)
      return newProject

    }

    // get managr using id

    static async getManagerUsingId(id: number){
        console.log(`inside get managerUsingId in projectManager and typeof id is ${typeof id}`)
        await ProjectUils.getManagerUsingId(id)
        return 
    }

    //get manager's projects 

    static async getManagedProjects(managerId: number){
        console.log('manager id to get managed projects' , managerId)
        const managerProjects = await ProjectHandler.getAllProjects(managerId)
        return managerProjects
    }



    static async validateManagerToDeleteProject(userId: string , projectId: string){

        await ProjectUils.validateManagerToDeleteProject(userId , projectId)

    }

    //delete proeject

    static async deleteProjectById(projectId: string , managerId: string){
       // await ProjectUils.validateProjectId(projectId)
        await ProjectUils.validateManagerToDeleteProject(managerId , projectId)
        await ProjectHandler.deleteProjectUsingId(Number(projectId))

    }

    
    //edit project using id 
}