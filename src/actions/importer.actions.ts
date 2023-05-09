import axios, { CancelTokenSource } from 'axios';

import { IImporterSaveModel } from '../models/interfaces/importer';
import { APIConstants } from '../shared/constants';
import { CommonUtils } from '../utils/common-utils';
import { UrlUtils } from '../utils/http-url.util';
import { getAction } from './action';
import { SharedActionTypes } from '../shared/actions/action-types';

export const importerSave = (payload: IImporterSaveModel, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            dispatch(getAction(SharedActionTypes.SHOW_INNER_SPINNER, { loading: true }));
            axios.post(UrlUtils.getBaseUrl() + APIConstants.importSave, payload, { cancelToken: source.token })
                .then((result: any) => result?.data)
                .then((result: any) => {
                    resolve(result);
                    dispatch(getAction(SharedActionTypes.SHOW_INNER_SPINNER, { loading: false }));
                })
                .catch((err: any) => {
                    dispatch(getAction(SharedActionTypes.SHOW_INNER_SPINNER, { loading: false }));
                    reject(err);
                });
        });
    }
}

export const getS3JSONFileData = (filename: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            axios.get(CommonUtils.formatString(UrlUtils.getBaseUrl() + APIConstants.getS3JSONFileData, filename), { cancelToken: source.token })
                .then((result: any) => result?.data)
                .then((result: any) => {
                    resolve(result);
                })
                .catch((err: any) => {
                    reject(null);
                });
        });
    }
}

export const GetFreeTrialCredit = (source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise((resolve, reject) => {
            axios.get((UrlUtils.getBaseUrl() + APIConstants.freeTrialImporter), { cancelToken: source.token })
                .then((result: any) => result?.data)
                .then((result: any) => {
                    resolve(result);
                })
                .catch((err: any) => {
                    reject(null);
                });
        });
    }
}
