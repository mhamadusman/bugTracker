import { createBug, IBugs, project } from '../../types/types';
import { Bug, status } from '../../models/bug.model';
import { bugHandler } from '../../handlers/bugsHandler';
import { BugUtil } from '../../utilities/bugUtils';
import { ProjectUils } from '../../utilities/projectUtils';
import { Exception } from '../../helpers/exception';
import { UserErrorMessages } from '../../constants/userErrorMessag';
import { errorCodes } from '../../constants/errorCodes';
import { Project } from '../../models/project.model';
import { Op } from 'sequelize';

export class BugManagr {
  static async createBug(data: createBug, userId: number, imgurl: string): Promise<void> {
    console.log('inside bugMnager create bug function', data);
    await BugUtil.validateBugRequest(data);
    await ProjectUils.validateProjectId(data.projectId);
    await BugUtil.validateBugTitle(data.title, data.projectId);
    await bugHandler.createBug(data, userId, imgurl);
    return;
  }

  static async getBugsonAproject(projectId: number, userId: number, userType: string, page: number , limit: number): Promise<IBugs> {
    //validate project id
    await ProjectUils.validateProjectId(projectId);
    const bugs = await bugHandler.getBugsonAproject(projectId, userId, userType, page, limit);
    return bugs;
  }

  //update bug status developere duty
  static async updateBugStatus(bugId: number, bugStatus: status, userId: number) {
    console.log(typeof bugStatus);
    //validat bug is connect to actual developer
    await BugUtil.authorizeDeveloper(bugId, userId);
    await BugUtil.validateBugStatus(bugStatus);
    //now save
    await bugHandler.updateBugStatus(bugStatus, bugId);
  }
  static async updateBug(bug: Bug, imgurl: string | null, bugId: number) {
    await BugUtil.validateUpdateRequest(bug);
    await BugUtil.validateBugTitle(bug.title, bug.projectId, bugId);
    await bugHandler.updateBug(bug, imgurl, bugId);
    return;
  }

  static async allbugs(role: string, id: number) {
    let result: Bug[] | [] = [];
    if (role === 'sqa') {
      const sqaId: number = Number(id);
      result = await Bug.findAll({ where: { sqaId } });
    }
    if (role === 'developer') {
      const developerId: number = Number(id);
      result = await Bug.findAll({ where: { developerId } });
    }
    if (role === 'manager') {
      const managerId: number = id;
      const projects: Project[] | [] = await Project.findAll({ where: { managerId } });
      const projectIds: number[] | [] = projects.map((pro) => Number(pro.projectId));
      result = await Bug.findAll({
        where: {
          projectId: {
            [Op.in]: projectIds,
          },
        },
      });
    }

    return result;
  }
  static async deleteBug(bugId: number, sqaId: number) {
    const bug = await bugHandler.getSQAbug(bugId, sqaId);
    if (!bug) {
      throw new Exception(UserErrorMessages.ACCESS_DENIED, errorCodes.BAD_REQUEST);
    }

    await bugHandler.deleteBug(bugId);
  }
}
