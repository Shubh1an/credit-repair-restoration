import axios, { CancelTokenSource } from "axios";
import { IFranchiseAgent, IFranchiseOffice, IFranchiseOutsourceService, IFranchisePayments } from "../models/interfaces/franchise";

import { APIConstants } from "../shared/constants";
import { CommonUtils } from '../utils/common-utils';


export const getFranchiseOffices = (source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.get(APIConstants.franchiseOffices, { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result?.data?.sort((a: any, b: any) => (b.isMain - a.isMain)));
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const getFranchiseOfficeDetails = (id: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.get(CommonUtils.formatString(APIConstants.getFranchiseOfficeDetails, id), { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const getFranchiseAgents = (id: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.get(CommonUtils.formatString(APIConstants.getFranchiseOfficeAgents, id), { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const getFranchiseOfficeServices = (id: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.get(CommonUtils.formatString(APIConstants.getFranchiseOfficeServices, id), { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const getFranchiseOfficePaymentMethods = (id: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.get(CommonUtils.formatString(APIConstants.getFranchiseOfficePayments, id), { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const createFranchiseOfficeDetails = (data: IFranchiseOffice, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.post(APIConstants.franchiseOffices, data, { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}
export const updateFranchiseOfficeDetails = (data: IFranchiseOffice, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.put(APIConstants.franchiseOffices, data, { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const deleteFranchiseOffice = (id: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.delete(APIConstants.franchiseOffices + `/${id}`, { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const deleteFranchiseAgent = (agent: IFranchiseAgent, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.delete(APIConstants.updateFranchiseAgent,
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


export const createUpdateFranchiseAgent = (payload: any, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.post(APIConstants.updateFranchiseAgent, payload, { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}
export const getFranchiseAgentRoles = (source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.get(APIConstants.getFranchiseAgentRoles, { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const getFranchiseAgentDetails = (agentId: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.get(CommonUtils.formatString(APIConstants.getFranchiseSingleAgentDetails, agentId), { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}


export const getFranchiseServices = (officeid: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.get(CommonUtils.formatString(APIConstants.getFranchiseOfficeServices, officeid), { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data || []);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}
export const createFranchiseService = (payload: any, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.post(APIConstants.createFranchiseOfficeServices, payload, { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const updateFranchiseService = (payload: any, officeid: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.put(CommonUtils.formatString(APIConstants.getFranchiseOfficeServices, officeid), payload,
                { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const deleteFranchiseService = (officeid: string, serviceid: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.delete(CommonUtils.formatString(APIConstants.deleteFranchiseOfficeServices, officeid, serviceid), { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}




export const getFranchisePaymentMethods = (officeid: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.get(CommonUtils.formatString(APIConstants.getFranchiseOfficePayments, officeid), { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data || []);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}
export const createFranchisePaymentMethod = (payload: any, officeid: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.post(CommonUtils.formatString(APIConstants.getFranchiseOfficePayments, officeid), payload,
                { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}
export const updateFranchisePaymentMethod = (payload: any, officeid: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.put(CommonUtils.formatString(APIConstants.getFranchiseOfficePayments, officeid), payload,
                { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}
export const deleteFranchisePaymentMethod = (officeid: string, payment: IFranchisePayments, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.delete(CommonUtils.formatString(APIConstants.deleteFranchiseOfficePayment, officeid, payment.id ?? ''),
                {
                    cancelToken: source.token,
                    data: {
                        ...payment
                    }
                }
            )
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}


export const getOutsourcedServices = (source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.get((APIConstants.allOutsourcedServices), { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}


export const getFranchOutsourcedServices = (source: CancelTokenSource, id?: string) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.get((APIConstants.outsourceFranchiseService + (id ? '/' + id : '')), { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}
export const createOutsourceFranchiseService = (payload: IFranchiseOutsourceService, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.post(APIConstants.outsourceFranchiseService, payload, { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const updateOutsourceFranchiseService = (payload: IFranchiseOutsourceService, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.put(APIConstants.outsourceFranchiseService, payload,
                { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const deleteOutsourceFranchiseService = (ofcid: string, mappingId: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.delete((APIConstants.outsourceFranchiseService + '/' + ofcid + '/' + mappingId),
                { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}
