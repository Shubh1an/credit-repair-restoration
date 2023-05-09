import produce from "immer";
import { IPayLoad } from "../models/interfaces/shared";
import { FastEditstate } from './fast-edit.initial-state';
import { FastEditActionTypes } from '../actions/fast-edit.action-types';
import { AuthActionTypes } from "../actions/auth.action-types";

export function FastEditReducer(state = FastEditstate, action: IPayLoad): any {
    return produce(state, (draft) => {
        switch (action.type) {
            case FastEditActionTypes.SET_DATA:
                draft.data = action.payload;
                break;
            case AuthActionTypes.SET_LOGOUT:
                return FastEditstate;
            default: {
                break;
            }
        }
    })
}