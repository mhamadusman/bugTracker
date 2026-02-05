import { Bug, status } from "../models/bug.model";
import { Project } from "../models/project.model";
import { createBug, IBugs, IBugState } from "../types/types";
import { Op } from "sequelize";

export class bugHandler {
  static async createBug(
    data: createBug,
    userId: number,
    imgurl: string,
  ): Promise<Bug> {
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
    console.log("bug created with details", bug);
    return bug;
  }

  static async getbugByID(
    bugId: number,
    developerId: number,
  ): Promise<Bug | null> {
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

  static async updateBug(bug: Bug, imgurl: string, bugId: number) {
    const { title, description, deadline, screenshot, developerId, type } = bug;
    if (imgurl.length === 0) {
      await Bug.update(
        {
          title: title,
          description: description,
          deadline: deadline,
          developerId: developerId,
          type: type,
        },
        { where: { bugId: bugId } },
      );
    } else {
      await Bug.update(
        {
          title: title,
          description: description,
          deadline: deadline,
          screenshot: imgurl,
          developerId: developerId,
          type: type,
        },
        { where: { bugId: bugId } },
      );
    }
  }

  static async getBugState(
    userId: number,
    role: string,
    projectId: number,
  ): Promise<IBugState> {
    const parameters: any = { projectId };
    const include: any[] = [];

    if (role === "manager") {
      include.push({
        model: Project,
        as: "project",
        where: { managerId: userId },
        attributes: [],
      });
    } else if (role === "developer") {
      parameters.developerId = userId;
    } else if (role === "sqa") {
      parameters.sqaId = userId;
    }

    const bugs = await Bug.findAll({
      where: parameters,
      include: include,
    });

    const totalBugs = bugs.length;
    const completedBugs = bugs.filter(
      (bug) => bug.status === "completed",
    ).length;
    const pendingBugs = totalBugs - completedBugs;
    return {
      totalBugs,
      completedBugs,
      pendingBugs,
    };
  }

  static async deleteBug(bugId: number) {
    await Bug.destroy({
      where: { bugId },
    });
  }

  //will return bugs on a project
  static async getAllBugs(
    userId: number,
    userType: string,
    page: number,
    limit: number,
    title: string,
    projectId?: number | undefined,
  ): Promise<IBugs> {
    const offset = (page - 1) * limit;
    const parameters: any = {};
    let include: any[] = [];
    if (title && title.trim().length > 0) {
      parameters.title = { [Op.iLike]: `%${title.trim()}%` };
    }
    if (projectId) {
      parameters.projectId = projectId;
    }
    if (userType === "sqa") {
      parameters.sqaId = userId;
    } else if (userType === "developer") {
      parameters.developerId = userId;
    } else if (userType === "manager") {
      if (!projectId) {
        include.push({
          model: Project,
          as: "project",
          where: { managerId: userId },
          attributes: [],
        });
      }
    }

    const { rows, count } = await Bug.findAndCountAll({
      where: parameters,
      include: include.length > 0 ? include : undefined,
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

    return {
      bugs: rows,
      totalBugs: count,
      pages: Math.ceil(count / limit),
    };
  }
}
