import { USER_ROLE } from "../../../enums/user";

export type TLoginUser = {
    email: string;
    password: string;
};

export type TLoginUserResponse = {
    accessToken: string;
    refreshToken?: string;
    needPasswordChange: boolean;
};

export type TRefreshTokenResponse = {
    accessToken: string;
};

export type TVerifiedLoginUser = {
    userId: string;
    role: USER_ROLE;
};

export type TChangePassword = {
    oldPassword: string;
    newPassword: string;
};