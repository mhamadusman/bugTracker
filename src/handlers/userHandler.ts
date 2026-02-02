import { errorCodes } from '../constants/errorCodes';
import { UserErrorMessages } from '../constants/userErrorMessag';
import { Exception } from '../helpers/exception';
import { User } from '../models/users.model';
import { Op } from 'sequelize';

import { createUser, updateUser } from '../types/types';

export class userHandler {
  static async createUser(data: createUser, hashedPassword: string): Promise<User> {
    const newUser = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      userType: data.userType,
      phoneNumber: data.phoneNumber,
    });
    return newUser;
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    const user = await User.findOne({
      where: { email: email },
    });

    return user;
  }

  static async getAllUsers(): Promise<User[]> {
    const users: User[] = await User.findAll();
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

  static async updateUser(data: updateUser, password: string, image: string | null, id: number) {
    const updateData: any = {
      name: data.name,
      phoneNumber: data.phoneNumber,
      email: data.email,
    };

    if (password.length > 0) {
      updateData.password = password;
    }
    if (image) {
      updateData.image = image;
    }
    await User.update(updateData, { where: { id } });
  }

  static async udpatRefreshToken(refreshToken: string, email: string) {
    await User.update({ refreshToken: refreshToken }, { where: { email: email } });
  }

  static async validateSQAids(ids: number[]): Promise<User[]> {
    const users = await User.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
        userType: 'sqa',
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
        userType: 'developer',
      },
    });
    return users;
  }
}
