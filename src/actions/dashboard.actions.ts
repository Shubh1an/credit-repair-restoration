import axios, { CancelTokenSource } from 'axios';

import { getAction } from "./action";
import { ICustomerCounts, IFranchiseCounts, ILetterCounts, IReferralCounts, IRoleCounts } from '../models/interfaces/customer-view';
import { DashboardActionTypes } from './dashboard.action-types';
import AuthService from '../core/services/auth.service';
import { APIConstants } from '../shared/constants';

export const getCustomerCounts = (axiosSource: CancelTokenSource) => {
    const { membershipId, siteId } = AuthService.getCurrentJWTPayload() ?? {};
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            axios.get(APIConstants.getCustomersCount, { params: { membershipId, siteId }, cancelToken: axiosSource.token })
                .then((result: any) => result?.data)
                .then((result: ICustomerCounts) => {
                    if (result) {
                        dispatch(getAction(DashboardActionTypes.SET_CUSTOMER_COUNTS, result));
                        resolve(result);
                    } else {
                        dispatch(getAction(DashboardActionTypes.SET_CUSTOMER_COUNTS, null));
                        reject(null);
                    }
                })
                .catch((err: any) => {
                    dispatch(getAction(DashboardActionTypes.SET_CUSTOMER_COUNTS, null));
                    reject(null);
                });
        });
    }
}

export const getLettersCounts = (axiosSource: CancelTokenSource) => {
    const { membershipId, siteId } = AuthService.getCurrentJWTPayload() ?? {};
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            axios.get(APIConstants.getCustomerLettersCount, { params: { membershipId, siteId }, cancelToken: axiosSource.token })
                .then((result: any) => result?.data)
                .then((result: ILetterCounts[]) => {
                    if (result) {
                        dispatch(getAction(DashboardActionTypes.SET_LETTER_COUNTS, result));
                        resolve(result);
                    } else {
                        dispatch(getAction(DashboardActionTypes.SET_LETTER_COUNTS, null));
                        reject(null);
                    }
                })
                .catch((err: any) => {
                    dispatch(getAction(DashboardActionTypes.SET_LETTER_COUNTS, null));
                    reject(null);
                });
        });
    }
}

export const getRolesCounts = (axiosSource: CancelTokenSource) => {
    const { membershipId, siteId } = AuthService.getCurrentJWTPayload() ?? {};
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            axios.get(APIConstants.getRolesCount, { params: { membershipId, siteId }, cancelToken: axiosSource.token })
                .then((result: any) => result?.data)
                .then((result: IRoleCounts) => {
                    if (result) {
                        dispatch(getAction(DashboardActionTypes.SET_ROLE_COUNTS, result));
                        resolve(result);
                    } else {
                        dispatch(getAction(DashboardActionTypes.SET_ROLE_COUNTS, null));
                        reject(null);
                    }
                })
                .catch((err: any) => {
                    dispatch(getAction(DashboardActionTypes.SET_ROLE_COUNTS, null));
                    reject(null);
                });
        });
    }
}

export const getReferralCounts = (axiosSource: CancelTokenSource) => {
    const { membershipId, siteId } = AuthService.getCurrentJWTPayload() ?? {};
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            axios.get(APIConstants.getReferralAgentsCount, { params: { membershipId, siteId }, cancelToken: axiosSource.token })
                .then((result: any) => result?.data)
                .then((result: IReferralCounts) => {
                    if (result) {
                        dispatch(getAction(DashboardActionTypes.SET_REFERRAL_COUNTS, result));
                        resolve(result);
                    } else {
                        dispatch(getAction(DashboardActionTypes.SET_REFERRAL_COUNTS, null));
                        reject(null);
                    }
                })
                .catch((err: any) => {
                    dispatch(getAction(DashboardActionTypes.SET_REFERRAL_COUNTS, null));
                    reject(null);
                });
        });
    }
}

export const getFranchiseCounts = (axiosSource: CancelTokenSource) => {
    const { membershipId, siteId } = AuthService.getCurrentJWTPayload() ?? {};
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            axios.get(APIConstants.getFranchiseAgentsCount, { params: { membershipId, siteId }, cancelToken: axiosSource.token })
                .then((result: any) => result?.data)
                .then((result: IFranchiseCounts) => {
                    if (result) {
                        dispatch(getAction(DashboardActionTypes.SET_FRANCHISE_COUNTS, result));
                        resolve(result);
                    } else {
                        dispatch(getAction(DashboardActionTypes.SET_FRANCHISE_COUNTS, null));
                        reject(null);
                    }
                })
                .catch((err: any) => {
                    dispatch(getAction(DashboardActionTypes.SET_FRANCHISE_COUNTS, null));
                    reject(null);
                });
        });
    }
}