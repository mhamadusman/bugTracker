import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/custome_variables.json';
import { User } from '../models/users.model';
import { token } from '../helpers/token';
import { errorCodes } from '../constants/errorCodes';
import { Exception } from '../helpers/exception';
import { UserErrorMessages } from '../constants/userErrorMessag';
import { createUser, loginResponse, UserTypes } from '../types/types';
import { userHandler } from '../handlers/userHandler';
import { UserUtil } from './userUtil';

export class AuthUtils {

    static async validateUserDataForSignUp(data: createUser) {
        const { name, email, password, userType, phoneNumber } = data;
        const types = Object.values(UserTypes);
        if (!name?.trim() || !email?.trim() || !userType?.trim() || !phoneNumber || !password?.trim() || !types.includes(userType)) {
        throw new Exception(UserErrorMessages.USER_DATA_INCOMPLETE, errorCodes.BAD_REQUEST);
        }
        await this.checkEmail(email);
        this.validatePasswordLength(password);
        this.validateEmail(email)
    }

    static validatePasswordLength(password: string) {
        if (password.trim().length < 8) {
        throw new Exception(UserErrorMessages.PASSWORD_TOO_SHORT, errorCodes.BAD_REQUEST);
        }
    }

    static validateEmail(email: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
        throw new Exception(UserErrorMessages.INVALID_EMAIL_FORMAT , errorCodes.BAD_REQUEST)
        }
    }

    static async createHashedPassword(password: string): Promise<string> {
        password = await bcrypt.hash(password, 10);
        return password;
    }

    static async checkEmail(email: string) {
        const user = await userHandler.findUserByEmail(email);
        if (user) {
            throw new Exception(UserErrorMessages.USER_ALREADY_EXISTS, errorCodes.CONFLICT_WITH_CURRENT_STATE);
        }
    }

    static async validateLoginReqeust(email: string, password: string): Promise<loginResponse> {
        const user = await userHandler.findUserByEmail(email);
        if (!user) {
        throw new Exception(UserErrorMessages.INVALID_CREDENTIALS, errorCodes.UNAUTHORIZED);
        }
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
        throw new Exception(UserErrorMessages.INVALID_CREDENTIALS, errorCodes.UNAUTHORIZED);
        }
        const userToken = await token.getLoginToken(user.id);
        const refreshToken = await token.getRefreshToken(user.id);
        return {
        token: userToken,
        userType: user.userType,
        refreshToken: refreshToken,
        };
    }

    static validateRefreshTokenSTR(refreshToken: string){
        console.log('refresh token value is :: ', refreshToken)
    if(!refreshToken){
        
        throw new Exception(UserErrorMessages.REFRESH_TOKEN_EXPIRED , errorCodes.UNAUTHORIZED)
    }
  }

  static async validateUserAndRefreshtoken(id: number , refreshToken: string): Promise<User>{
    const user  = await UserUtil.findUserByid(id)
    console.log('we are inside validateuser and refresh token  throwing error and user details are :: ', user)
    if(user.refreshToken !== refreshToken){
        console.log('refresh token are different ... ')
    }else{
        console.log('refresh tokens are same.... ')
    }
    if(!user || user.refreshToken !== refreshToken){
        throw new Exception(UserErrorMessages.REFRESH_TOKEN_EXPIRED, errorCodes.UNAUTHORIZED)
    }
    return user
  }
}
