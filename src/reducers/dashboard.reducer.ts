import produce from "immer";

import { IPayLoad } from "../models/interfaces/shared";
import { DashboardActionTypes } from '../actions/dashboard.action-types';
import { DashboardInitialState } from './dashboard.initial-state';
import { AuthActionTypes } from "../actions/auth.action-types";

export const DashboardReducer = (state = DashboardInitialState, action: IPayLoad): any => {
    return produce(state, (draft) => {
        switch (action.type) {
            case DashboardActionTypes.SET_CUSTOMER_COUNTS:
                draft.customerCounts = action.payload;
                break;
            case DashboardActionTypes.SET_LETTER_COUNTS:
                draft.customerLetters = action.payload;
                break;
            case DashboardActionTypes.SET_ROLE_COUNTS:
                draft.dashboardRoles = action.payload;
                break;
            case DashboardActionTypes.SET_REFERRAL_COUNTS:
                draft.referrals = action.payload;
                break;
            case DashboardActionTypes.SET_FRANCHISE_COUNTS:
                draft.franchises = action.payload;
                break;
            case AuthActionTypes.SET_LOGOUT:
                return DashboardInitialState;
            default:
                break;
        }
    });
}