import produce from "immer";
import { isMobile } from 'react-device-detect';

import { AuthActionTypes } from "../actions/auth.action-types";
import { IPayLoad, ISharedState } from "../models/interfaces/shared";
import { SharedActionTypes } from "./actions/action-types";

const initialState = {
    logoChangedKey: 1,
    todos: [],
    toggleToDo: false,
    passwordNotStrong: false,
    leftMenuOpened: !isMobile
};

export function SharedReducer(state = initialState, action: IPayLoad): any {
    return produce(state, (draft: ISharedState) => {
        switch (action.type) {
            case SharedActionTypes.SET_AUTH_RULES:
                draft.AuthRules = action.payload;
                break;
            case SharedActionTypes.SET_ACCESSIBLE_SCREENS:
                draft.currentAccessibleScreens = action.payload;
                break;
            case SharedActionTypes.SHOW_INNER_SPINNER:
                draft.isLoaderShownInner = action.payload?.loading;
                draft.loaderInnerMessage = action.payload?.message;
                break;
            case SharedActionTypes.LOGO_CHANGED:
                draft.logoChangedKey = (draft.logoChangedKey || 1) + 1;
                break;
            case SharedActionTypes.USER_TODOS:
                draft.todos = action.payload;
                break;
            case SharedActionTypes.TOGGLE_TODOS:
                draft.toggleToDo = !draft.toggleToDo;
                break;
            case SharedActionTypes.PASSWORD_NOT_STRONG:
                draft.passwordNotStrong = action.payload;
                break;                
            case SharedActionTypes.LEFT_MENU_OPEN:
                draft.leftMenuOpened = action.payload;
                break;
            case AuthActionTypes.SET_LOGOUT:
                return initialState;
        }
    })
};
