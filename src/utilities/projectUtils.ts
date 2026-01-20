
import { errorCodes } from "../constants/errorCodes";
import { UserErrorMessages } from '../constants/userErrorMessag';
import { userHandler } from "../handlers/userHandler";
import { Exception } from "../helpers/exception";
import { createProject } from "../types/types";
import { User } from "../models/users.model";
import { Op } from "sequelize";
import { ProjectHandler } from "../handlers/projectHandlers";
import { Project } from "../models/project.model";




export class ProjectUils{
    // validate project data
    static async  validateProjectData(data: createProject) {
        const {name , sqaIds , developerIds } = data
        if(!name?.trim()){
            console.log('provide project name')
            throw new Exception(UserErrorMessages.INcOMPELETE_DATA_TO_CREATE_PROEJECT, errorCodes.BAD_REQUEST);

        }

        const sqaIdsInNumber: number[] = sqaIds.split(',').map(id => Number(id.trim()));
        console.log('in projct utils, validate create project reques and these are sqa ids', sqaIds)

        //now validate these id's fromd data bas
        await this.validateSQAids(sqaIdsInNumber)

        //in the same way validate developers

        const developerIdsInNumber: number[] = developerIds.split(',').map(id => Number(id.trim()));

        await this.validateDeveloperids(developerIdsInNumber)

    }

    //validat all sqa ids and role

    static async validateSQAids(ids: number[]){

        if(ids.length <= 0){
            throw new Exception(UserErrorMessages.INcOMPELETE_DATA_TO_CREATE_PROEJECT , errorCodes.BAD_REQUEST)

        }
        const users = await User.findAll({
         where: {
            id: {
            [Op.in]: ids
            }
        }
        });

        if(users.length !== ids.length){
            console.log('inside project utils validate sqa ids... some sqa are not pressent in data basee')
            throw new Exception(UserErrorMessages.INVALID_SQA_IDS_TO_CREATE_PROJECET, errorCodes.BAD_REQUEST);

        }

        //validate role too

        const result  = users.filter((user)=>{
            return user.userType !== 'sqa'
        })
        if(result?.length > 0){
            throw new Exception(UserErrorMessages.INVALID_SQA_IDS_TO_CREATE_PROJECET , errorCodes.BAD_REQUEST)
        }

    }

    //validates developer ids

    static async validateDeveloperids(ids: number[]){

        if(ids.length <= 0){
            throw new Exception(UserErrorMessages.INcOMPELETE_DATA_TO_CREATE_PROEJECT , errorCodes.BAD_REQUEST)

        }
        const users = await User.findAll({
         where: {
            id: {
            [Op.in]: ids
            }
        }
        });

        if(users.length !== ids.length){
            console.log('inside project utils validate developer ids... some developre are not pressent in data basee')
            throw new Exception(UserErrorMessages.INVALID_DEVELOPER_IDS_TO_CREATE_PROJECET, errorCodes.BAD_REQUEST);

        }

        //check role for developer
        const result  = users.filter((user)=>{
            return user.userType !== 'developer'
        })
        if(result?.length > 0){
            throw new Exception(UserErrorMessages.INVALID_DEVELOPER_IDS_TO_CREATE_PROJECET , errorCodes.BAD_REQUEST)
        }

    }

    //validate user by id
    static async validateUser(id: number){
      console.log(`inside get project utils to get manger using id typeof id is ${typeof id}`)

        const manager  = await userHandler.findById(id)
        console.log(`manager using his id , ${manager?.name}`)
        if(!manager){
            throw new Exception(UserErrorMessages.USER_NOT_FOUND , errorCodes.BAD_REQUEST)
        }
        return 
    }

    static async validateManagerAndProject(userId: string  , projectId: string){

        // get proeject using id
        const project = await ProjectHandler.getProjectUsingId(Number(projectId))
        if(!project){
            throw new Exception(UserErrorMessages.INVALID_ID , errorCodes.BAD_REQUEST)
        }   

        if(project.managerId !== Number(userId)){
            throw new Exception (UserErrorMessages.ACCESS_DENIED , errorCodes.UNAUTHORIZED)
        }
    }

    static async validateProjectId(projectId: number): Promise<void>{
        const project = await Project.findByPk(projectId)
        if(!project){
            throw new Exception(UserErrorMessages.INVALID_ID , errorCodes.BAD_REQUEST)
        }


    }
}