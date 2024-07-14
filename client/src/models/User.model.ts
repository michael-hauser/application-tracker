export interface IUser {
    name: string;
    email: string;
}

export interface IAuthModel {
    error: string;
    user?: IUser;
    token?: undefined;
    csrfToken?: string;
}