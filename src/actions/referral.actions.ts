import axios, { CancelTokenSource } from "axios";
import { ReferralCustomerTypes } from "../models/enums";
import { IFranchiseAgent, IFranchiseOffice, IFranchisePayments, IReferralOffice } from "../models/interfaces/franchise";
import { INameValue, INameValueMatch } from "../models/interfaces/shared";

import { APIConstants } from "../shared/constants";
import { CommonUtils } from '../utils/common-utils';


export const getReferralOffices = (source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.get(APIConstants.referralOffices, { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result?.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const getReferralOfficeDetails = (id: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.get(CommonUtils.formatString(APIConstants.getReferralOfficeDetails, id), { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const getReferralAgents = (id: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.get(CommonUtils.formatString(APIConstants.getReferralOfficeAgents, id), { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const addUpdateReferralOffice = (data: IReferralOffice, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.post(APIConstants.referralOffices, data, { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const deleteReferralOffice = (id: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.delete(APIConstants.referralOffices + `/${id}`, { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const deleteReferralAgent = (agent: IFranchiseAgent, officeId: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.delete(CommonUtils.formatString(APIConstants.getReferralOfficeAgents, officeId),
                {
                    cancelToken: source.token,
                    data: {
                        membershipId: agent.membershipId,
                        id: agent?.id
                    }
                })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}


export const createUpdateReferralAgent = (payload: any, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.post(APIConstants.updateReferralAgent, payload, { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}
export const getReferralAgentDetails = (agentId: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.get(CommonUtils.formatString(APIConstants.getReferralOfficeAgentDetails, agentId), { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const getCurrentOfficeAgents = (source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.get(APIConstants.getCurrentOfficeAgents, { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const reassignReferralOffices = (currentId: string, assignTo: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.put(CommonUtils.formatString(APIConstants.reassignReferralOffices, currentId, assignTo), { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}


export const changeReferralAgentPasword = (payload: any, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.put(APIConstants.referralAgentChangePassword, payload, { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const sendWelcomeEmailtoAgent = (agentId: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.put(CommonUtils.formatString(APIConstants.resendWelcomeAgentEmail, agentId), { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const resendFollowUpAgentEmail = (agentId: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.put(CommonUtils.formatString(APIConstants.resendFollowUpAgentEmail, agentId), { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}


export const getReferralAgentsList = (payload: INameValueMatch[], source: CancelTokenSource, query: string = '') => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            let url = APIConstants.getReferralAgentsList;
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

export const getReferralAgentCustomers = (agentId: string, type: ReferralCustomerTypes, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.get(CommonUtils.formatString(APIConstants.getReferralAgentCustomers, agentId, type?.toString()), { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}