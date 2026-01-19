
import { Request, Response, NextFunction } from 'express';
import { createProject, project, deleteProjectResponse } from '../../types/types';

import { projectManager } from './projectManager';
import { User } from '../../models/users.model';

declare global {
  namespace Express {
    interface Request {
      user?: User ; 
    }
  }
}



export class ProjectController {
    

    //create project 
    static async createProjct(req: Request<{} , project , createProject> , res: Response<project> , next: NextFunction){
        try{

          const project: project = await projectManager.createProject(req.body)
          return res.status(201).json({
            sucess: true,
            message: 'project created',
            managerId: project.managerId,
            name: project.name,
            projectId: project.projectId
          })


        }catch(error){
            next(error)
        }
    }


    //get specifi proejets using manaegr id
    static async getManagerProjects(req: Request<{managerId: string}>,  res: Response , next: NextFunction){ 
        try{

            console.log('inside project controller to get all projects' , req.params.managerId)

            await projectManager.getManagerUsingId(Number(req.params.managerId))
            const managedProjects = await projectManager.getManagedProjects(Number(req.params.managerId))
            return res.status(200).json({
                 sucess: true,
                 count: managedProjects?.length,
                 message: `total number of porjects found ${managedProjects?.length}`,
                 projects: managedProjects
            })

        }catch(error){

            next(error)

        }
    }

    //delt projct using project id
    //validate id then delete
    static async deleteProjectById(req: Request<{ projectId: string }>, res: Response<deleteProjectResponse>, next: NextFunction) {
      const projectId = String(req.params.projectId);
      try{

        //first validate project is connected with manager 
        const managerId = String(req.user!.id);
        
        await  projectManager.deleteProjectById(projectId , managerId)
        return res.status(200).json({
            sucess: true,
            message: 'proeject deleted sucessfully'
        })

      }catch(error){
            next(error)
      }




    }




}