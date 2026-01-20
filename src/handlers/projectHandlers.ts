import sequelize from "../config/database";
import { Project } from '../models/project.model';
import { UserProjects } from "../models/userProjects.model";
import { createProject, project } from '../types/types';
import { AssignedUserTypes } from "../types/types";
import { Exception } from "../helpers/exception";
import { errorMessages } from "../constants/errorMessages";
import { errorCodes } from "../constants/errorCodes";
import { userProjectsData } from "../types/types";
import { User } from "../models/users.model";



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
            const userProjectData: userProjectsData[]  = this.createUserProjectData(newProject.projectId , data)
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
   
    static async getManagerProjects(managerId: number): Promise<Project[]>{

        const projects: Project[] = await Project.findAll({
            where: { managerId }
        });

        return projects 
        
    } 

     static async getSQAprojects(userId: number): Promise<Project[]>{

        const user  = await User.findByPk(userId,{
            include:[{
                model: Project,
                as: "assignedProjects"
            }]
        })

        return user?.assignedProjects ?? []
    } 
     static async getDeveloperProjects(userId: number): Promise<Project[]>{
        const user  = await User.findByPk(userId,{
            include:[{
                model: Project,
                as: "assignedProjects"
            }]
        })

        return user?.assignedProjects ?? []
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

    static async editProject(projectId: number, data: createProject){

        const transaction = await sequelize.transaction()
        //update name in project table 

        await Project.update({name: data.name},{where: {projectId} , transaction})

        //remove old data from junction table
        await UserProjects.destroy({where:{projectId} , transaction})

         const userProjectData: userProjectsData[]  = this.createUserProjectData(projectId , data)
        //now save into db

        console.log('data which is going to save in userProjects..' , userProjectData)

        const userProject = await UserProjects.bulkCreate(userProjectData , {transaction})
        console.log('userproeject which is created is ' , userProject)
        await transaction.commit();
    }
    static createUserProjectData(projectId: number , data: createProject): userProjectsData[] {

        const userProjectData: userProjectsData[]  = []
        const developerIds = data.developerIds.split(',').map(id => Number(id))
            const sqaIds = data.sqaIds.split(',').map(id => Number(id))

             developerIds.forEach((userId)=>{
                userProjectData.push({
                    projectId: projectId,
                    userId,
                    userType: AssignedUserTypes.DEVELOPER
                })
             })

             sqaIds.forEach((userId)=>{
                userProjectData.push({
                    projectId: projectId,
                    userId,
                    userType: AssignedUserTypes.SQA
                })
             })
        return userProjectData
    }
}
