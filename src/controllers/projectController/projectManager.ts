import { createProject, project } from '../../types/types';
import { ProjectUils } from "../../utilities/projectUtils";
import { ProjectHandler } from "../../handlers/projectHandlers";




export class projectManager{
    static async createProject(data: createProject): Promise<project>{
      //validate projct data 
      await ProjectUils.validateProjectData(data)
      

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