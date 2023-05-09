import axios, { CancelTokenSource } from "axios";

import { IMediaPayload } from "../models/interfaces/shared";
import { SharedActionTypes } from "../shared/actions/action-types";
import { APIConstants } from "../shared/constants";
import { CommonUtils } from "../utils/common-utils";
import { getAction } from "./action";


export const getSiteLogos = (source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.get(APIConstants.getSiteLogos, { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result?.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}


export const uploadLogo = (payload: IMediaPayload, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.post(APIConstants.uploadLogo, payload, { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const updateKey = () => {
    return (dispatch: any) => {
        dispatch(getAction(SharedActionTypes.LOGO_CHANGED));
    }
}
export const removeOfficeLogo = (ofcId: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.delete(CommonUtils.formatString(APIConstants.removeLogo, ofcId), { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}