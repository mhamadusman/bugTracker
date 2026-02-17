import { User } from "../../models/users.model";
import { createUser, loginResponse, signUpResponse } from "../../types/types";
import { AuthUtils } from "../../utilities/authUtils";
import { userHandler } from "../../handlers/userHandler";
import { token } from "../../helpers/token";

export class AuthManager {
  static async signUp(data: createUser) {
    await AuthUtils.validateUserDataForSignUp(data);
    const hashedPassword = await AuthUtils.createHashedPassword(data.password);
    await userHandler.createUser(data, hashedPassword);
  }
  static async login(email: string, password: string): Promise<loginResponse> {
    const data = await AuthUtils.validateLoginReqeust(email, password);
    return data;
  }
  static async getRefreshToken(
    id: number,
    userType: string,
    email: string,
  ): Promise<loginResponse> {
    const userToken = await token.getLoginToken(id);
    const refreshToken = await token.getRefreshToken(id);
    await userHandler.udpatRefreshToken(refreshToken, email);
    return {
      token: userToken,
      refreshToken: refreshToken as string,
      userType: userType,
    };
  }
  static async logOut(userId: number , refreshToken: string){
    await userHandler.invalidateRefreshToken(userId , refreshToken)
  }
}
