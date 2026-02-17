import { status } from "../models/bug.model";
import { Bug } from "../models/association";
import { Project } from "../models/association";
import { createBug, IBugs, IBugState } from "../types/types";
import { User } from "../models/association";
import { Op } from "sequelize";
import { IBugWithDeveloper } from "../types/types";
import path from "path";
import fs from "fs/promises";

export class bugHandler {
  static async createBug(
    data: createBug,
    userId: number,
    imgurl: string,
  ): Promise<IBugWithDeveloper | null> {
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
    const newBug: IBugWithDeveloper | null = await this.getSingleBug(bug.bugId);
    return newBug;
  }
  static async getbugByID(
    bugId: number,
    developerId?: number,
  ): Promise<Bug | null> {
    const where: any = {}
    where.bugId = bugId
    if(developerId){
      where.developerId = developerId
    }
    const bug: Bug | null = await Bug.findOne({
      where
    });
    return bug;
  }
  static async getSingleBug(bugId: number): Promise<IBugWithDeveloper | null> {
    let parameters: any = {};
    parameters.bugId = bugId;
    let include: any = [];
    include.push({
      model: User,
      as: "developer",
      attributes: ["id", "name", "image"],
    });
    include.push({
      model: User,
      as: "sqa",
      attributes: ["id", "name", "image"],
    });

    const bugInstance: any = await Bug.findByPk(bugId, {
      include,
    });
    const { developer, sqa, ...bug } = bugInstance.get({ plain: true });
    return { bug, developer, sqa };
  }
  //remove it
  static async getSQAbug(bugId: number, sqaId: number): Promise<Bug | null> {
    const bug: Bug | null = await Bug.findOne({
      where: { bugId, sqaId },
    });
    return bug;
  }
  //remove it
  static async findBugs(projectId: number): Promise<Bug[]> {
    const bugs = await Bug.findAll({
      where: { projectId },
    });
    return bugs;
  }
  static async updateBugReview(bug: Partial<Bug>, bugId: number) {
    await Bug.update(
      { status: bug.status, isClose: bug.isClose },
      { where: { bugId: bugId } },
    );
  }
  static async updateBugStatus(bugStatus: status, bugId: number) {
    await Bug.update({ status: bugStatus }, { where: { bugId } });
  }
  static async updateBug(
    bug: Partial<Bug>,
    imgurl: string,
    bugId: number,
  ): Promise<IBugWithDeveloper | null> {
    const data: any = {};
    if (imgurl && imgurl.length !== 0) {
      data.screenshot = imgurl;
      const bug = await this.getbugByID(bugId);
      const oldScreeenShoot = bug?.screenshot;
      if (oldScreeenShoot && oldScreeenShoot !== "null") {
        console.log("old image is :: ", oldScreeenShoot);
        const oldScreenShootPath = path.join(__dirname, "../../public", oldScreeenShoot);
        try {
          await fs.unlink(oldScreenShootPath);
          console.log("old screenShoot deleted successfully", oldScreeenShoot);
        } catch (error) {
          console.log("error happend during deleting old screenShoot :: ", error);
        }
      }
    }
    if (bug.title) {
      data.title = bug.title;
    }
    if (bug.description) {
      data.description = bug.description;
    }
    if (bug.deadline) {
      data.deadline = bug.deadline;
    }
    if (bug.developerId) {
      data.developerId = bug.developerId;
    }
    if (bug.type) {
      data.type = bug.type;
    }
    if (bug.isClose !== undefined) {
      const isCloseBool =
        typeof bug.isClose === "string" ? bug.isClose === "true" : bug.isClose;
      data.isClose = isCloseBool;
      data.status = isCloseBool ? "completed" : bug.status || "in progress";
    } else if (bug.status) {
      data.status = bug.status;
    }
    await Bug.update(data, { where: { bugId } });
    const updateBug = await this.getSingleBug(bugId);
    return updateBug;
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

  static async getAllBugs(
    userId: number,
    userType: string,
    page: number,
    limit: number,
    title: string,
    projectId?: number,
  ): Promise<IBugs> {
    const offset = (page - 1) * limit;
    const parameters: any = {};
    const include: any[] = [];

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
    } else if (userType === "manager" && !projectId) {
      include.push({
        model: Project,
        as: "project",
        where: { managerId: userId },
        attributes: ["projectId", "name", "image"],
      });
    }

    include.push({
      model: User,
      as: "developer",
      attributes: ["id", "name", "image"],
    });

    include.push({
      model: User,
      as: "sqa",
      attributes: ["id", "name", "image"],
    });

    const { rows, count } = await Bug.findAndCountAll({
      where: parameters,
      include,
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });
    const bugsWithDeveloper: any[] = rows.map((bugInstance: any) => {
      const bugobj = bugInstance.get({ plain: true });
      const { developer, sqa, ...bug } = bugobj;
      return {
        bug,
        developer,
        sqa,
      };
    });

    return {
      totalBugs: count,
      pages: Math.ceil(count / limit),
      statusCount: 0,
      bugsWithDeveloper,
    };
  }
}
