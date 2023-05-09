import axios, { CancelTokenSource } from "axios";
import { IMasterServiceAdOns } from "../models/interfaces/franchise";
import { IUpdateServiceRequest } from "../models/interfaces/shared";

import { APIConstants } from "../shared/constants";
import { CommonUtils } from "../utils/common-utils";


export const masterGetFranchiseServices = (source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.get(APIConstants.getFranchiseMasterServices, { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result?.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const getServicePricingMasterData = (serviceId: string, levels: any[], options: IMasterServiceAdOns[], source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.get(CommonUtils.formatString(APIConstants.getFranchiseMasterServiceCategories, serviceId), { cancelToken: source.token })
                .then((result: any) => {
                    let categories = [] as any[];
                    categories = result?.data?.map((x: any) => ({
                        category: x?.categoryName,
                        servicePricingId: x?.servicePricingId,
                        levels: x?.servicePricingLevels?.map((m: any) => ({
                            level: levels?.find(mm => mm?.serviceLevelId === m?.serviceLevelId),
                            options: m?.serviceAddOns?.map((n: any) => ({
                                description: n?.description,
                                serviceAddOnId: n?.serviceAddOnId,
                                cost: +n?.cost,
                                servicePricingAddOnId: n?.servicePricingAddOnId,
                                option: options?.find((xx: any) => xx?.serviceAddOnId === n?.serviceAddOnId),
                            })),
                            description: m?.description,
                            serviceLevelId: m?.serviceLevelId,
                            letterCount: +m?.letterCount,
                            cost: +m?.cost,
                            servicePricingLevelId: m?.servicePricingLevelId,
                        }))
                    })) || [];
                    let serviceId = result?.data?.length ? result?.data[0]?.serviceId : '';
                    console.log({ serviceId, categories });
                    resolve({ serviceId, categories });
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const masterCreateService = (payload: any, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.post(APIConstants.createFranchiseMasterServices, payload, { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result?.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const masterUpdateService = (payload: IUpdateServiceRequest, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.put(APIConstants.createFranchiseMasterServices, payload, { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result?.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}




export const masterGetFranchiseServiceLevels = (source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.get(APIConstants.franchiseMasterServiceLevel + '/getall', { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result?.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const masterCreateServiceLevel = (payload: any, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.post(APIConstants.franchiseMasterServiceLevel, payload, { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result?.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const masterUpdateServiceLevel = (payload: any, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.put(APIConstants.franchiseMasterServiceLevel, payload, { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result?.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}



export const masterGetFranchiseServiceOptions = (source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.get(APIConstants.franchiseMasterServiceAdons + '/getall', { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result?.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const masterCreateServiceOptions = (payload: any, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.post(APIConstants.franchiseMasterServiceAdons, payload, { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result?.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const masterUpdateServiceOptions = (payload: any, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.put(APIConstants.franchiseMasterServiceAdons, payload, { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result?.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}


export const saveServicePricingMasterData = (payload: any, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.post((APIConstants.saveFranchiseMasterServiceCategories), payload, { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result?.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const removeCategoryForMaster = (id: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.delete(CommonUtils.formatString(APIConstants.removeFranchiseServiceCategory, id), { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result?.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}
export const removeCategoryLevelForMaster = (id: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.delete(CommonUtils.formatString(APIConstants.removeFranchiseServiceCategoryLevel, id), { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result?.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const removeCategoryLevelOptionForMaster = (id: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.delete(CommonUtils.formatString(APIConstants.removeFranchiseServiceCategoryLevelOption, id), { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result?.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const getFranchiseOfficeAvailableServices = (source: CancelTokenSource, officeId: string) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.get(CommonUtils.formatString(APIConstants.getFranchiseOfficeAvailableServices, officeId || ''), { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result?.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const loadFranchiseOfficeCategories = (source: CancelTokenSource, officeId: string, masterServiceId: string) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.get(CommonUtils.formatString(APIConstants.getFranchiseOfficeAvailableCategories, officeId, masterServiceId), { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result?.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const saveCatogoryForFranchiseOffice = (payload: any, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.post((APIConstants.saveCatogoryForFranchiseOffice), payload, { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result?.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const removeCategoryFromOffice = (id: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.delete(CommonUtils.formatString(APIConstants.removeCategoryFromOffice, id), { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result?.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const removeLevelFromOffice = (id: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.delete(CommonUtils.formatString(APIConstants.removeLevelFromOffice, id), { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result?.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const removeAddOnFromOffice = (id: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.delete(CommonUtils.formatString(APIConstants.removeAddOnFromOffice, id), { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result?.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}


export const getFranchiseOfficeAllPricings = (officeId: string, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.get(CommonUtils.formatString(APIConstants.getFranchiseOfficeAllPricings, officeId), { cancelToken: source.token })
                .then((result: any) => {
                    resolve(result?.data);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}