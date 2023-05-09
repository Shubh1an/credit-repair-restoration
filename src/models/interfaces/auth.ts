import { CancelTokenSource } from "axios";
import { GrantType } from "../enums";

export interface ILogin {

}
export interface IAuthPayload {
    password?: string;
    username?: string;
    refreshToken?: string;
    grant_type: GrantType;
}
export interface ILoginState {
    isLoading: boolean;
    isError: boolean;
    password: string;
    username: string
    noValues: boolean;
    viewPass?: boolean,
    redirectToReferrer: boolean;
    axiousSource: CancelTokenSource;
    isLoginFromRemoteSite?: boolean;
}
export interface ILoginResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}