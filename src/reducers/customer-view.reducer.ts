import produce from "immer";

import { IPayLoad } from "../models/interfaces/shared";
import { CustomersListInitialState } from './customer-view.initial-state';
import { CustomerActionTypes } from '../actions/customers.action-types';
import { AuthActionTypes } from "../actions/auth.action-types";

export function CustomerViewReducer(state = CustomersListInitialState, action: IPayLoad): any {
    return produce(state, (draft) => {
        switch (action.type) {
            case CustomerActionTypes.SET_STATUSES:
                draft.statuses = action.payload;
                break;
            case CustomerActionTypes.SET_API_ACTIVE:
                draft.apiActive = action.payload;
                break;
            case CustomerActionTypes.SET_STATES:
                draft.states = action.payload;
                break;
            case CustomerActionTypes.SET_PARTNER_KEY:
                draft.hasPartneryKey = action.payload;
                break;
            case CustomerActionTypes.SET_S3_FILES:
                draft.s3Files = action.payload;
                break;
            case CustomerActionTypes.SET_ADMIN_SETTINGS:
                draft.adminSettings = action.payload;
                break;

            case CustomerActionTypes.SET_DISPUTE_STATS:
                draft.disputeStats = action.payload;
                break;
            case CustomerActionTypes.SET_DISPUTE_STATS_LOADING:
                draft.disputeStatsLoading = action.payload;
                break;
            case AuthActionTypes.SET_LOGOUT:
                return CustomersListInitialState;
            default:
                break;
        }
    })
}