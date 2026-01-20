import { UserTypes, createProject, project} from '../../types/types';
import { ProjectUils } from "../../utilities/projectUtils";
import { ProjectHandler } from "../../handlers/projectHandlers";
import { User } from '../../models/users.model';
import { Project } from '../../models/project.model';
import { Exception } from '../../helpers/exception';
import { errorMessages } from '../../constants/errorMessages';
import { UserErrorMessages } from '../../constants/userErrorMessag';
import { errorCodes } from '../../constants/errorCodes';




export class projectManager{
    static async createProject(data: createProject): Promise<project>{
      //validate projct data 
      await ProjectUils.validateProjectData(data)
      

      //create project
      const newProject: project  = await ProjectHandler.createProject(data)
      return newProject

    }

    //
    static async getProjects(userId: number , userRole: string): Promise<Project[]>{

        await this.validateUser(userId)
        if(userRole === "manager"){
           const projects: Project[]= await ProjectHandler.getManagerProjects(userId)
           return projects
        }else if(userRole === "sqa"){
            const projects: Project[] = await ProjectHandler.getSQAprojects(userId)
            return projects
        }
        else if(userRole === "developer"){
            const projects: Project[] = await ProjectHandler.getSQAprojects(userId)
            return projects
        }else{
            throw new Exception(UserErrorMessages.INVALID_USER_TYPE , errorCodes.BAD_REQUEST)
        }
        
    }

    static async validateUser(id: number){
        console.log(`inside validate user function in projectManager and typeof id is ${typeof id}`)
        await ProjectUils.validateUser(id)
        return 
    }
    static async validateManagerToDeleteProject(userId: string , projectId: string){

        await ProjectUils.validateManagerAndProject(userId , projectId)

    }

    //delete proeject

    static async deleteProjectById(projectId: string , managerId: string){
       // await ProjectUils.validateProjectId(projectId)
        await ProjectUils.validateManagerAndProject(managerId , projectId)
        await ProjectHandler.deleteProjectUsingId(Number(projectId))

    }

    
    //edit project using id 

    static async editProject(projectId: number , projectData: createProject , managerId: number){
        //validate project id 
        await ProjectUils.validateManagerAndProject(String(managerId) , String(projectId))
        await  ProjectUils.validateProjectData(projectData)
        await ProjectHandler.editProject(projectId , projectData)


    }
}