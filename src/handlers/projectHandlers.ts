import sequelize from "../config/database";
import { Project } from "../models/project.model";
import { UserProjects } from "../models/userProjects.model";
import { User } from "../models/users.model";
import { createProject, project } from "../types/types";
import { AssignedUserTypes } from "../types/types";
import { Exception } from "../helpers/exception";
import { errorMessages } from "../constants/errorMessages";
import { errorCodes } from "../constants/errorCodes";



interface userProjectsData {
    projectId: number,
    userId: number,
    userType: AssignedUserTypes
}

export class ProjectHandler{

    //create new project 
    static async createProject(data: createProject): Promise<project>{


        //first save data in proejcts then in junstion table using projct id 
        const transaction = await sequelize.transaction()

        try{

            const newProject = await Project.create({
                name: data.name,
                managerId: data.managerId
            }, {transaction})

            //now save data into junction table
            const userProjectData: userProjectsData[]  = []
            const developerIds = data.developerIds.split(',').map(id => Number(id))
            const sqaIds = data.sqaIds.split(',').map(id => Number(id))

             developerIds.forEach((userId)=>{
                userProjectData.push({
                    projectId: newProject.projectId,
                    userId,
                    userType: AssignedUserTypes.DEVELOPER
                })
             })

             sqaIds.forEach((userId)=>{
                userProjectData.push({
                    projectId: newProject.projectId,
                    userId,
                    userType: AssignedUserTypes.SQA
                })
             })

             //now save into db

             console.log('data which is going to save in userProjects..' , userProjectData)

             const userProject = await UserProjects.bulkCreate(userProjectData , {transaction})
             console.log('userproeject which is created is ' , userProject)
              await transaction.commit();

              return newProject

        }catch(error){

             await transaction.rollback();
             throw new Exception (errorMessages.MESSAGES.SOMETHING_WENT_WRONG,  errorCodes.INTERNAL_SERVER_ERROR)

        }
    }


    //get all projects project
   
    static async getAllProjects(managerId: number): Promise<Project[] | null>{

        const projects = await Project.findAll({
            where: { managerId }
        });

        return projects 
        
    } 

    //get project using id 

    static async getProjectUsingId(projectId: number): Promise<Project | null>{
            const project  = await Project.findByPk(projectId)
            return project
    }

    //delete project 

    static async deleteProjectUsingId(projectId: number){
        await Project.destroy({
            where: {projectId}
        })
    }

    //edit project 
}
