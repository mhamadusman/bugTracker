import { User } from '../../models/users.model';
import { createUser, loginResponse, signUpResponse } from '../../types/types';
import { AuthUtils } from '../../utilities/authUtils';
import { userHandler } from '../../handlers/userHandler';
import { token } from '../../helpers/token';

export class AuthManager {
    static async signUp(data: createUser): Promise<User> {
        await AuthUtils.validateUserDataForSignUp(data);
        const hashedPassword = await AuthUtils.createHashedPassword(data.password);
        const newUser = await userHandler.createUser(data, hashedPassword);
        return newUser;
    }

    static async login(email: string, password: string): Promise<loginResponse> {
        const data = await AuthUtils.validateLoginReqeust(email, password);
        await userHandler.udpatRefreshToken(data.refreshToken, email);
        return data;
    }

    static async getRefreshToken(id: number, email: string, userType: string): Promise<loginResponse> {
        const userToken = await token.getLoginToken(id);
        const refreshToken = await token.getRefreshToken(id);
        await userHandler.udpatRefreshToken(refreshToken, email);
        return {
        token: userToken,
        refreshToken: refreshToken,
        userType: userType,
        };
    }


}
