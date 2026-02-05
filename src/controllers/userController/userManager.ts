import { userHandler } from '../../handlers/userHandler';
import { UserProjects } from '../../models/userProjects.model';
import { User } from '../../models/users.model';
import { updateUser } from '../../types/types';
import { AuthUtils } from '../../utilities/authUtils';
import { UserUtil } from '../../utilities/userUtil';

export class UserManager {
  static async getAllUsers(): Promise<User[] | null> {
    const users: User[] | null = await userHandler.getAllUsers();
    return users;
  }

  static async updateUser(data: updateUser, id: number, image: string | null) {
    await UserUtil.validateUpdateRequest(data, id);
    let hashedPassword = '';
    if (data.password && data.password.trim().length >= 8 && data.password !== undefined) {
      hashedPassword = await AuthUtils.createHashedPassword(data.password);
    }
    await userHandler.updateUser(data, hashedPassword, image, id);
  }
  //get all develoeprs on a specific project
  static async getDevelopers(projectId: number): Promise<User[] | []> {
    const users: UserProjects[] | [] = await UserProjects.findAll({
      where: { projectId: projectId },
    });
    const userIds = users.map((user) => user.userId);
    //now get qas and devs 
    const developers = await userHandler.getAllDevelopers(userIds);
    return developers;
  }
  
  static async findById(id: number): Promise<User>{
     const user  = await UserUtil.findUserByid(id)
     return user

  }
}
