import { Bug, status } from "../models/bug.model";
import { createBug } from '../types/types';

export class bugHandler{

    static async createBug(data: createBug , userId: number): Promise<Bug>{
      
        const bug = await Bug.create({
        title: data.title,
        description: data.description,
        deadline: data.deadline,
        type: data.type,
        status: data.status,
        projectId: data.projectId,
        developerId: data.developerId,
        sqaId: userId
        });

        return bug
    }

    static async getbugByID(bugId: number , developerId: number): Promise<Bug | null>{
        const bug: Bug | null= await Bug.findOne({
            where: {bugId, developerId}
        })
        return bug
    }
    
    static async findBugs(projectId: number): Promise<Bug[]> {

        const bugs = await Bug.findAll({
            where: { projectId }
        });

      return bugs;
   } 

   static async updateBugStatus(bugStatus: status , bugId: number){

    console.log('we are inside bughalder to upadte bug status ')

      await Bug.update({status: bugStatus}, {where: {bugId}})
   }

}