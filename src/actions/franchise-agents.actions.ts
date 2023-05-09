import axios, { CancelTokenSource } from "axios"
import { INameValue, INameValueMatch } from "../models/interfaces/shared";
import { APIConstants } from "../shared/constants";
import { CommonUtils } from "../utils/common-utils";

export const getFranchseAgentsList = (payload: INameValueMatch[], source: CancelTokenSource, query: string = '') => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            let url = APIConstants.getFranchiseAgentsList;
            if (query) {
                url += '?query=' + query;
            }
            await axios.post(url, payload, { cancelToken: source?.token })
                .then((result: any) => {
                    const res = {
                        agents: result?.data?.agents,
                        offices: result?.data?.offices?.map((x: string) => ({ Name: x, Value: x } as INameValue)) as INameValue[],
                        roles: result?.data?.roles?.map((x: string) => ({ Name: x, Value: x } as INameValue)) as INameValue[]
                    }
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}


export const getFranchiseAgentNotes = (membershipId: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.get(CommonUtils.formatString(APIConstants.getFranchiseAgentNotes, membershipId), { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const AddFranchiseAgentNotes = (payload: any, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.post(APIConstants.addFranchiseAgentNote, payload, { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const deleteFranchiseAgentNote = (noteid: any, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.delete(CommonUtils.formatString(APIConstants.getFranchiseAgentNotes, noteid), { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const getFranchiseAgentCustomers = (agentId: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.get(CommonUtils.formatString(APIConstants.getFranchiseAgentCustomers, agentId), { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const getFranchiseAgentReferrals = (agentId: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.get(CommonUtils.formatString(APIConstants.getFranchiseAgentReferrals, agentId), { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}


export const resedWelcomeEmailFranchAgent = (agentId: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.get(CommonUtils.formatString(APIConstants.franchAgentWelcomeEmail, agentId), { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}