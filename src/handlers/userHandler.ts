import { User } from "../models/association";
import { Op, fn, col, literal } from "sequelize";
import { createUser, updateUser } from "../types/types";
import { CloudinaryService } from "../services/cloudinarySerevice";
export class userHandler {
  static async createUser(data: createUser, hashedPassword: string) {
    await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      userType: data.userType,
      phoneNumber: data.phoneNumber,
    });
  }
  static async findUserByEmail(email: string): Promise<User | null> {
    const user = await User.findOne({
      where: { email: email },
    });
    return user;
  }
  static async getAllUsers(): Promise<User[]> {
    const users: User[] = await User.findAll({
      attributes: ["id", "name", "userType", "image"],
    });
    return users;
  }
  static async getUserByRole(role: string): Promise<User | null> {
    const user: User | null = await User.findOne({
      where: { userType: role },
    });
    return user;
  }
  static async findById(id: number): Promise<User | null> {
    const user = await User.findByPk(id);
    return user;
  }
  static async getAllDevelopers(ids: number[]): Promise<User[] | []> {
    const users = await User.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });
    return users;
  }

  static async getdevAndQaEmails(ids: number[]): Promise<User[] | []> {
    const users = await User.findAll({
      attributes: ["email"],
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      raw: true,
    });
    return users;
  }

  static async updateUser(
    data: updateUser,
    password: string,
    image: string | null,
    id: number,
    imagePublicId: string | null,
  ) {
    const updateData: any = {
      name: data.name,
      phoneNumber: data.phoneNumber,
      email: data.email,
    };
    if (imagePublicId) {
      updateData.imagePublicId = imagePublicId;
    }
    if (password.length > 0) {
      updateData.password = password;
    }
    if (image) {
      updateData.image = image;
    }
    const user = await this.findById(id);
    if (user?.imagePublicId && imagePublicId) {
      const response = await CloudinaryService.deleteImage(user.imagePublicId);
      console.log("deleted old profile :: ", response);
    }
    await User.update(updateData, { where: { id } });
  }
  static async udpatRefreshToken(refreshToken: string, email: string) {
    await User.update(
      { refreshToken: refreshToken },
      { where: { email: email } },
    );
  }
  static async validateSQAids(ids: number[]): Promise<User[]> {
    const users = await User.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
        userType: "sqa",
      },
    });
    return users;
  }
  static async validateDeveloperIds(ids: number[]): Promise<User[]> {
    const users = await User.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
        userType: "developer",
      },
    });
    return users;
  }
  static async getValidatedUserCounts(devIds: number[], sqaIds: number[]) {
    const allIds = [...devIds , ...sqaIds];
    const result: any = await User.findAll({
      attributes: [
        [fn("COUNT", col("id")), "totalFound"],
        [
          literal(`COUNT(CASE WHEN "userType" = 'developer' THEN 1 END)`),
          "devCount",
        ],
      ],
      where: {
        id: { [Op.in]: allIds },
        userType: { [Op.in]: ["developer", "sqa"] },
      },
      raw: true,
    });

    const totalFound = parseInt(result[0]?.totalFound || "0");
    const devCount = parseInt(result[0]?.devCount || "0");
    const sqaCount = totalFound - devCount;

    return { devCount, sqaCount };
  }
  static async invalidateRefreshToken(userId: number, refreshToken: string) {
    const invalidRefreshToken = null;
    await User.update(
      { refreshToken: invalidRefreshToken },
      { where: { refreshToken: refreshToken, id: userId } },
    );
  }
}
