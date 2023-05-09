import axios, { CancelTokenSource } from "axios";

import { APIConstants } from "../shared/constants";


export const getCollectionEntries = (type: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.get(APIConstants.collectionEntry + '/' + type, { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result?.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const createCollectionEntry = (type: string, entryName: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.post(APIConstants.collectionEntry, { entryName, type }, { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result?.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const updateCollectionEntry = (type: string, entryName: string, id: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.put(APIConstants.collectionEntry, { entryName, type, id }, { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result?.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const deleteCollectionEntry = (id: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.delete(APIConstants.collectionEntry + '/' + id, { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result?.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}