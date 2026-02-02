import { Bug, status } from '../models/bug.model';
import { createBug, IBugs } from '../types/types';

export class bugHandler {
  static async createBug(data: createBug, userId: number, imgurl: string): Promise<Bug> {
    const bug = await Bug.create({
      title: data.title,
      description: data.description,
      deadline: data.deadline,
      type: data.type,
      status: data.status,
      projectId: data.projectId,
      developerId: data.developerId,
      sqaId: userId,
      screenshot: imgurl,
    });
    console.log('bug created with details', bug);
    return bug;
  }

  static async getbugByID(bugId: number, developerId: number): Promise<Bug | null> {
    const bug: Bug | null = await Bug.findOne({
      where: { bugId, developerId },
    });
    return bug;
  }

  static async getSQAbug(bugId: number, sqaId: number): Promise<Bug | null> {
    const bug: Bug | null = await Bug.findOne({
      where: { bugId, sqaId },
    });
    return bug;
  }

  static async findBugs(projectId: number): Promise<Bug[]> {
    const bugs = await Bug.findAll({
      where: { projectId },
    });

    return bugs;
  }

  static async updateBugStatus(bugStatus: status, bugId: number) {
    await Bug.update({ status: bugStatus }, { where: { bugId } });
  }

  static async updateBug(bug: Bug, imgurl: string | null, bugId: number) {
    const { title, description, deadline, screenshot, developerId, type } = bug;
    await Bug.update(
      { title: title, description: description, deadline: deadline, screenshot: imgurl, developerId: developerId, type: type },
      { where: { bugId: bugId } },
    );
  }

  static async deleteBug(bugId: number) {
    await Bug.destroy({
      where: { bugId },
    });
  }

  //will return bugs on a project 
  static async getBugsonAproject(projectId: number, userId: number, userType: string, page: number, limit: number): Promise<IBugs> {
    let sqaId: number = userId;
    let developerId: number = userId;
    const offset = (page - 1) * limit;
    if (userType === 'sqa') {
      const { rows, count } = await Bug.findAndCountAll({
        where: { projectId, sqaId },
        offset,
        limit,
        order: [['createdAt', 'DESC']],
      });
      return {
        bugs: rows,
        totalBugs: count,
        pages: Math.ceil(count / limit),
      };
    } else if (userType === 'developer') {
      const { rows, count } = await Bug.findAndCountAll({
        where: { projectId, developerId },
        offset,
        limit,
        order: [['createdAt', 'DESC']],
      });
      return {
        bugs: rows,
        totalBugs: count,
        pages: Math.ceil(count / limit),
      };
    } else {
      const { rows, count } = await Bug.findAndCountAll({   // will return bugs for manager  on a project 
        where: { projectId },
        offset,
        limit,
        order: [['createdAt', 'DESC']],
      });
      return {
        bugs: rows,
        totalBugs: count,
        pages: Math.ceil(count / limit),
      };
    }

  }
}
