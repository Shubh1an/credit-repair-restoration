import axios, { CancelTokenSource } from "axios";
import { ICustomerFullDetails } from "../models/interfaces/customer-view";
import { ICreditMonitoring } from "../models/interfaces/leads";
import { INameValue, INameValueMatch } from "../models/interfaces/shared";

import { APIConstants } from "../shared/constants";
import { CommonUtils } from '../utils/common-utils';


export const getLeads = (payload: INameValueMatch[], source: CancelTokenSource, query: string = '') => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            let url = APIConstants.getLeads;
            if (query) {
                url += '?query=' + query;
            }
            await axios.post(url, payload, { cancelToken: source?.token })
                .then((result: any) => {
                    const res = {
                        leads: result?.data?.leads,
                        referralAgents: Object.getOwnPropertyNames(result?.data?.referralAgents || {})
                            ?.map((key: string) => ({
                                Name: result?.data?.referralAgents[key],
                                Value: key
                            } as INameValue)),
                        franchiseAgents: Object.getOwnPropertyNames(result?.data?.franchiseAgents || {})
                            ?.map((key: string) => ({
                                Name: result?.data?.franchiseAgents[key],
                                Value: key
                            } as INameValue)),
                        statusNames: result?.data?.statusNames,
                        tranactionTypes: result?.data?.tranactionTypes,
                    }
                    resolve(res);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const getLeadDetails = (leadId: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.get(CommonUtils.formatString(APIConstants.getSingleLeads, leadId), { cancelToken: source?.token })
                .then((result: any) => {
                    const { lead, creditMonitoring } = result?.data;
                    resolve({
                        lead,
                        creditMonitoring: {
                            monitoringService: creditMonitoring?.service,
                            monitoringLink: creditMonitoring?.link,
                            monitoringUserName: creditMonitoring?.userName,
                            monitoringPassword: creditMonitoring?.password,
                            monitoringSecretWord: creditMonitoring?.secretWord,
                            reportPullDate: creditMonitoring?.reportPullDate,
                            cbRefreshTok: lead?.cbRefreshTok,
                            id: lead?.id,
                            email: lead?.email
                        } as ICreditMonitoring
                    });
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const updateLead = (leadPayload: ICustomerFullDetails, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.put(APIConstants.addLead, leadPayload, { cancelToken: source?.token })
                .then((result: any) => {
                    resolve(result?.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const addLead = (leadPayload: ICustomerFullDetails, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.post(APIConstants.addLead, leadPayload, { cancelToken: source?.token })
                .then((result: any) => {
                    resolve(result?.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}


export const deleteLead = (id: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.delete(APIConstants.addLead + '/' + id, { cancelToken: source?.token })
                .then((result: any) => {
                    resolve(result?.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}
export const leadMonitoring = (payload: any, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.put(APIConstants.leadCreditMonitoring, payload, { cancelToken: source?.token })
                .then((result: any) => {
                    resolve(result?.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}


export const convertToCustomer = (id: string, notifyAgent: boolean, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.put(CommonUtils.formatString(APIConstants.convertToCustomer, id, notifyAgent?.toString()), null, { cancelToken: source?.token })
                .then((result: any) => {
                    resolve(result?.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}
export const updateLeadAgent = (customerId: string, franchiseAgent: string, referralAgent: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.put(APIConstants.leadAgentUpdate,
                { customerId, franchiseAgent, referralAgent }, { cancelToken: source.token })
                .then((result: any) => result?.data)
                .then((result: any[]) => {
                    resolve(result);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}
export const resedLeadWelcomeEmail = (cid: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.post(CommonUtils.formatString(APIConstants.resendLeadWelcomeEmail, cid), null, { cancelToken: source.token })
                .then((result: any) => result?.data)
                .then((result: any) => {
                    resolve(result);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}


export const subscribeToArrayLead = (customerId: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.put(CommonUtils.formatString(APIConstants.submitToArrayReport, customerId) + '/true/true', { cancelToken: source.token })
                .then((result: any) => result?.data)
                .then((result: any) => {
                    resolve(result);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const getSubscribeToArrayLead = (customerId: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.get(CommonUtils.formatString(APIConstants.submitToArrayReport, customerId) + '/true', { cancelToken: source.token })
                .then((result: any) => result?.data)
                .then((result: any) => {
                    resolve(result);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const subscribeToCMLead = (customerId: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.put(CommonUtils.formatString(APIConstants.creditmonitoringsubscription, customerId) + '/true/true', { cancelToken: source.token })
                .then((result: any) => result?.data)
                .then((result: any) => {
                    resolve(result);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const getSubscribeToCMLead = (customerId: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.get(CommonUtils.formatString(APIConstants.creditmonitoringsubscription, customerId) + '/true', { cancelToken: source.token })
                .then((result: any) => result?.data)
                .then((result: any) => {
                    resolve(result);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}
