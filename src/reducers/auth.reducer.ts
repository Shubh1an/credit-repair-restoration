import produce from "immer";

import { IPayLoad } from "../models/interfaces/shared";
import { AuthInitialState } from './auth.intialState';
import { AuthActionTypes } from '../actions/auth.action-types';

export const AuthReducer = (state = AuthInitialState, action: IPayLoad): any => {
    return produce(state, (draft) => {
        switch (action.type) {
            case AuthActionTypes.CHECK_LOGIN_SUCCESS:
                draft.auth = {
                    isLoggedIn: true,
                    loggedInUserDetails: null,
                    access_token: action.payload.access_token,
                    refresh_token: action.payload.refresh_token,
                    expires_in: action.payload.expires_in,
                    token_type: action.payload.token_type,
                    isGettingPublicToken: false,                    
                    isLocked: false,
                    lockedMessage: ''
                };
                break;
            case AuthActionTypes.CHECK_LOGIN_FAILURE:
                draft.auth = {
                    isLoggedIn: false,
                    loggedInUserDetails: null,
                    access_token: '',
                    refresh_token: '',
                    expires_in: 0,
                    token_type: '',
                    isGettingPublicToken: false,
                    isLocked: false,
                    lockedMessage: ''
                };
                break;
            case AuthActionTypes.SET_LOGOUT:
                return AuthInitialState;
            case AuthActionTypes.SET_LOGGED_IN_DETAILS:
                draft.auth.loggedInUserDetails = action.payload;
                break;
            case AuthActionTypes.SET_GETTING_GUEST_TOKEN:
                draft.auth.isGettingPublicToken = action.payload;
                break;
            case AuthActionTypes.PORTAL_LOCKED:
                draft.auth.isLocked = action.payload?.isLocked;
                draft.auth.lockedMessage = action.payload?.lockedMessage;
                break;
            default:
                break;
        }
    });
}