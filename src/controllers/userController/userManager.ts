import { errorCodes } from "../../constants/errorCodes";
import { UserErrorMessages } from "../../constants/userErrorMessag";
import { ProjectHandler } from "../../handlers/projectHandlers";
import { userHandler } from "../../handlers/userHandler";
import { Exception } from "../../helpers/exception";
import { UserProjects } from "../../models/userProjects.model";
import { User } from "../../models/users.model";
import { updateUser } from "../../types/types";
import { AuthUtils } from "../../utilities/authUtils";
import { ProjectUils } from "../../utilities/projectUtils";
import { UserUtil } from "../../utilities/userUtil";

export class UserManager {
  static async getAllUsers(): Promise<User[] | null> {
    const users: User[] | null = await userHandler.getAllUsers();
    return users;
  }

  static async updateUser(
    data: updateUser,
    id: number,
    image: string | null,
    imagePublicId: string | null,
  ) {
    await UserUtil.validateUpdateRequest(data, id);
    let hashedPassword = "";
    if (
      data.password &&
      data.password.trim().length >= 8 &&
      data.password !== undefined
    ) {
      hashedPassword = await AuthUtils.createHashedPassword(data.password);
    }
    await userHandler.updateUser(data, hashedPassword, image, id , imagePublicId);
  }
  //get all users on a specific project having role=developer
  static async getDevelopers(projectId: number): Promise<User[] | []> {
    const project = await ProjectUils.validateProjectId(projectId);
    if (!project) {
      throw new Exception(
        UserErrorMessages.PROJECT_NOT_FOUND,
        errorCodes.BAD_REQUEST,
      );
    }
    const developers = ProjectHandler.getDevelopers(projectId);
    return developers;
  }

  static async findById(id: number): Promise<User> {
    const user = await UserUtil.findUserByid(id);
    return user;
  }
}
