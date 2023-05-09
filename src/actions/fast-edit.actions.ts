
import axios, { CancelTokenSource } from 'axios';

import { APIConstants, Variables } from '../shared/constants';
import { CommonUtils } from '../utils/common-utils';
import { FastEditSingleAccountModel, ICollectorAddress, IDataItem, IFastEditAccount, IFastEditAccountsParams, IFastFullDetailsRequest, IFEAccountHistoryModel, ISaveAccountModel, ISaveFullAccountModel } from '../models/interfaces/fast-edit-accounts';
import { CollectionEntryTypes } from '../models/enums';
import { IDropdown } from '../models/interfaces/shared';
import { ICustomerFullDetails } from '../models/interfaces/customer-view';


export const getFastccounts = (payload: IFastEditAccountsParams, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.post(APIConstants.fastEditAccounts, payload, { cancelToken: source.token })
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

export const searchCollectionEntries = (searchType: CollectionEntryTypes, searchText: string, limit: number, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.get(
                CommonUtils.formatString(
                    APIConstants.searchCollection,
                    searchType, searchText, limit?.toString()
                ), { cancelToken: source.token })
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

export const updateCollectorAddress = (data: ICollectorAddress, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.put(APIConstants.updateCollectorAddress, data, { cancelToken: source.token })
                .then((result: any) => result?.data)
                .then((result: any[]) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(null);
                    }
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

export const saveFEAccount = async (data: IFEAccountHistoryModel, customer: ICustomerFullDetails | null, modifierAgentId: string, source: CancelTokenSource, oldAccounts: IFastEditAccount[], ccid: string) => {
    const payload = getFastEditSaveModel(data, customer, modifierAgentId, oldAccounts, ccid);
    return await axios.post(APIConstants.saveFEAccounts, payload, { cancelToken: source.token })
        .then((result: any) => result?.data);
}

export const saveFEFullAccount = async ({ account, cid, ccid, modifierAgentId, changes: data, axiosSource: source }: IFastFullDetailsRequest) => {
    const payload = getFullAccountData(data, modifierAgentId, cid, ccid, account);
    return await axios.post(APIConstants.saveFullAccountDetails, payload, { cancelToken: source.token })
        .then((result: any) => result?.data);
}
export const createNewAccount = async (data: FastEditSingleAccountModel, customer: ICustomerFullDetails | null, modifierAgentId: string, source: CancelTokenSource) => {
    const payload = getAccountData(data, modifierAgentId, customer?.id, '');
    return await axios.post(APIConstants.addNewAccount, payload, { cancelToken: source.token })
        .then((result: any) => result?.data);
}
export const updateYellowAccount = async (ccid: string, source: CancelTokenSource) => {
    return await axios.put(CommonUtils.formatString(APIConstants.updateYellowAccount, ccid),
        { cancelToken: source.token })
        .then((result: any) => result?.data);
}

function getFastEditSaveModel(data: IFEAccountHistoryModel, customer: ICustomerFullDetails | null, modifierAgentId: string, oldAccounts: IFastEditAccount[], ccid?: string): ISaveAccountModel[] {
    let body: ISaveAccountModel[] = [];
    Object.getOwnPropertyNames(data).filter(x => ccid ? x === ccid : true).forEach((key: string) => {
        const account = oldAccounts?.find(x => x.id === key);
        const d = getAccountData(data[key], modifierAgentId, customer?.id, key, account);
        body.push(d);
    });
    return body;
}
function getAccountData({ globalReason, globalAccType, globalOutcome, EQF, EXP, TU, isFastTrack, accountName, round }: FastEditSingleAccountModel, modifierAgentId: string, cid?: string, ccid?: string, account?: IFastEditAccount): ISaveAccountModel {
    let d: ISaveAccountModel = {
        newAccountName: accountName ? (accountName as IDropdown)?.name ?? accountName?.toString() : undefined,
        // accountNameId: accountName ? (accountName as IDropdown)?.abbreviation ?? accountName?.toString() : undefined,
        dboRounds: round,
        modifierAgentId,
        customerId: cid ?? '',
        accountId: ccid ?? '',
        accType: globalAccType ? (globalAccType as IDropdown)?.name ?? globalAccType?.toString() : undefined,
        constantOutcome: globalOutcome ? (globalOutcome as IDropdown)?.name ?? globalOutcome?.toString() : undefined,
        constantReason: globalReason ? (globalReason as IDropdown)?.name ?? globalReason?.toString() : undefined,
        isFastTrack: isFastTrack ? 1 : 0,
        tuBureauId: account?.tuAccountBureauId,
        expBureauId: account?.expAccountBureauId,
        eqfBureauId: account?.eqfAccountBureauId,
        grdEQFOutcome: account?.eqfOutcome,
        grdEXPOutcome: account?.expOutcome,
        grdTUOutcome: account?.tuOutcome,
        tuTailEndDisputeRO: account?.currentTUDisputeReason,
        expTailEndDisputeRO: account?.currentEXPDisputeReason,
        eqfTailEndDisputeRO: account?.currentEQFDisputeReason
    }
    if (TU) {
        d.TUSelectAccount = account?.currentTUDisputeReason !== TU.currentDisputeReason;
        d.disputeReasonTU = TU.currentDisputeReason ? (TU.currentDisputeReason as IDropdown)?.abbreviation : undefined;
        d.disputeReasonTUText = TU.currentDisputeReason ? (TU.currentDisputeReason as IDropdown)?.name || TU.currentDisputeReason : undefined;
        d.changeTUOutcome = account?.tuOutcome !== TU.currentOutcome;
        d.grdTUOutcome = TU?.currentOutcome ? (TU.currentOutcome as IDropdown)?.name || TU?.currentOutcome : undefined;
        d.tuoutcomelist = TU?.currentOutcome ? (TU.currentOutcome as IDropdown)?.name || TU?.currentOutcome : undefined;
        d.editTUAccountStatus = account?.tuAccountStatus !== TU.accStatus;
        d.newTUAcctNumber = TU.accNum;
        d.newTUAcctStatus = TU.accStatus ? (TU.accStatus as IDropdown)?.name || TU.accStatus : undefined;
        d.newTUAcctStatusValue = TU.accStatus ? (TU.accStatus as IDropdown)?.abbreviation : undefined;
        d.newTUBalance = TU.balance;
        d.newTUAcctNumber = TU.accNum;
        d.newTUDateOpened = TU.dateOpened;
        d.newTUHighCreditLimit = TU.highCredit;
        d.newTUInqDate = TU.dateOfInquiry;
        d.newTUPayStatus = TU.payStatus ? (TU.payStatus as IDropdown)?.name || TU.payStatus : undefined;
    }
    if (EXP) {
        d.EXPSelectAccount = account?.currentEXPDisputeReason !== EXP.currentDisputeReason;
        d.disputeReasonEXP = EXP.currentDisputeReason ? (EXP.currentDisputeReason as IDropdown)?.abbreviation : undefined;
        d.disputeReasonEXPText = EXP.currentDisputeReason ? (EXP.currentDisputeReason as IDropdown)?.name || EXP.currentDisputeReason : undefined;
        d.changeEXPOutcome = account?.expOutcome !== EXP.currentOutcome;
        d.grdEXPOutcome = EXP?.currentOutcome ? (EXP.currentOutcome as IDropdown)?.name || EXP?.currentOutcome : undefined;
        d.expoutcomelist = EXP?.currentOutcome ? (EXP.currentOutcome as IDropdown)?.name || EXP?.currentOutcome : undefined;
        d.editEXPAcctStatus = account?.expAccountStatus !== EXP.accStatus;
        d.newEXPAcctNumber = EXP.accNum;
        d.newEXPAcctStatus = EXP.accStatus ? (EXP.accStatus as IDropdown)?.name || EXP.accStatus : undefined;
        d.newEXPAcctStatusValue = EXP.accStatus ? (EXP.accStatus as IDropdown)?.abbreviation : undefined;
        d.newEXPBalance = EXP.balance;
        d.newEXPAcctNumber = EXP.accNum;
        d.newEXPDateOpened = EXP.dateOpened;
        d.newEXPHighCreditLimit = EXP.highCredit;
        d.newEXPInqDate = EXP.dateOfInquiry;
        d.newEXPPayStatus = EXP.payStatus ? (EXP.payStatus as IDropdown)?.name || EXP.payStatus : undefined;
    }
    if (EQF) {
        d.EQFSelectAccount = account?.currentEQFDisputeReason !== EQF.currentDisputeReason;
        d.disputeReasonEQF = EQF.currentDisputeReason ? (EQF.currentDisputeReason as IDropdown)?.abbreviation : undefined;
        d.disputeReasonEQFText = EQF.currentDisputeReason ? (EQF.currentDisputeReason as IDropdown)?.name || EQF.currentDisputeReason : undefined;
        d.changeEQFOutcome = account?.eqfOutcome !== EQF.currentOutcome;
        d.grdEQFOutcome = EQF?.currentOutcome ? (EQF.currentOutcome as IDropdown)?.name || EQF?.currentOutcome : undefined;
        d.eqfoutcomelist = EQF?.currentOutcome ? (EQF.currentOutcome as IDropdown)?.name || EQF?.currentOutcome : undefined;
        d.selectAccStatus = account?.eqfAccountStatus !== EQF.accStatus;
        d.newEQFAcctNumber = EQF.accNum;
        d.newEQFAcctStatus = EQF.accStatus ? (EQF.accStatus as IDropdown)?.name || EQF.accStatus : undefined;
        d.newEQFAcctStatusValue = EQF.accStatus ? (EQF.accStatus as IDropdown)?.abbreviation : undefined;
        d.newEQFBalance = EQF.balance;
        d.newEQFAcctNumber = EQF.accNum;
        d.newEQFDateOpened = EQF.dateOpened;
        d.newEQFHighCreditLimit = EQF.highCredit;
        d.newEQFInqDate = EQF.dateOfInquiry;
        d.newEQFPayStatus = EQF.payStatus ? (EQF.payStatus as IDropdown)?.name || EQF.payStatus : undefined;
    }
    return d;
}

function getFullAccountData({ globalAccType, EQF, EXP, TU, isFastTrack, accountName, round, accountNotes, names, addresses }: FastEditSingleAccountModel, modifierAgentId: string, cid?: string, ccid?: string, account?: any): ISaveFullAccountModel {
    const tuData = getOldBureauData(3, account?.bureauData);
    const expData = getOldBureauData(2, account?.bureauData);
    const eqfData = getOldBureauData(1, account?.bureauData);
    let d: ISaveFullAccountModel = {
        accountId: ccid,
        customerId: cid,
        isFastTrack: isFastTrack ? 1 : 0,
        tuAllNew: !!TU?.accNum && (!tuData?.id || tuData?.id === Variables.EMPTY_GUID),
        expAllNew: !!EXP?.accNum && (!expData?.id || expData?.id === Variables.EMPTY_GUID),
        eqfAllNew: !!EQF?.accNum && (!eqfData?.id || eqfData?.id === Variables.EMPTY_GUID),
        accountInfo: {
            accountType: { value: (globalAccType ? ((globalAccType as IDropdown)?.name || globalAccType?.toString()) : globalAccType) },
            scoringRound: round,
            notes: accountNotes,
            collector: { value: (accountName ? ((accountName as IDropdown)?.name || accountName?.toString()) : accountName) },
        }
    }
    d.bureauInfo = [];
    if (TU) {
        getFullBureauData(TU, d, modifierAgentId, account, 3, names, addresses);
    }
    if (EXP) {
        getFullBureauData(EXP, d, modifierAgentId, account, 2, names, addresses);
    }
    if (EQF) {
        getFullBureauData(EQF, d, modifierAgentId, account, 1, names, addresses);
    }
    return d;
}
const getFullBureauData = (bureau: any, d: ISaveFullAccountModel, modifierAgentId: string, account?: any, type?: number, names?: IDataItem[], addresses?: IDataItem[]) => {
    const oldBureau = getOldBureauData(type, account?.bureauData);
    d.bureauInfo?.push({
        modifierAgentId: modifierAgentId,
        id: oldBureau?.id || '',
        bureau: type,
        accountNumber: bureau?.accNum,
        payStatus: bureau?.payStatus ? (bureau?.payStatus as IDropdown)?.name || bureau?.payStatus : undefined,
        status: { value: bureau?.accStatus ? (bureau?.accStatus as IDropdown)?.name || bureau?.accStatus : undefined },
        tailEndDisputeReason: { value: bureau?.currentDisputeReason ? (bureau?.currentDisputeReason as IDropdown)?.name || bureau?.currentDisputeReason : undefined },
        outcome: { value: bureau?.currentOutcome ? (bureau?.currentOutcome as IDropdown)?.name || bureau?.currentOutcome : undefined },
        originalCreditor: bureau?.originalCreditor,
        courtPlaintiff: bureau?.courtOrPlaintiff,
        dateOfInquiry: bureau?.dateOfInquiry || Variables.EMPTY_DATE2,
        dateEntered: bureau?.dateOpened || Variables.EMPTY_DATE2,
        lastActivity: bureau?.dateLastActivity || Variables.EMPTY_DATE2,
        responsibility: bureau?.responsibility,
        dateOpened: bureau?.dateOpened || Variables.EMPTY_DATE2,
        lastDateReported: bureau?.dateLastReported || Variables.EMPTY_DATE2,
        highCreditLimit: bureau?.highCreditLimit,
        balance: bureau?.balance,
        monthlyPayment: bureau?.monthlyPayment,
        pastDueAmount: bureau?.pastDueAmount,
        payHistory30: bureau?.payments30,
        payHistory60: bureau?.payments60,
        payHistory90: bureau?.payments90,
        notes: bureau?.notes,
        names: getNamesAddress(bureau?.selectedNames, bureau?.newName, names),
        addresses: getNamesAddress(bureau?.selectedAddresses, bureau?.newAddress, addresses),
        terms: bureau?.terms,
        condition: bureau?.condition,
        numberOfMonthsReported: bureau?.numberOfMonthsReported,
        IsInsertedEQF: type === 1 ? bureau?.isInserted : false,
        IsInsertedEXP: type === 2 ? bureau?.isInserted : false,
        IsInsertedTU: type === 3 ? bureau?.isInserted : false
    });
}
const getNamesAddress = (selectedValues: string[], filledValue: string, addressesORNames?: IDataItem[]): IDataItem[] => {
    let list = addressesORNames?.filter(x => selectedValues?.some(m => m === x.id)) || [];
    if (filledValue) {
        list.push({ value: filledValue, id: Variables.EMPTY_GUID });
    }
    return list;
}
const getOldBureauData = (type?: number, bureauData?: any) => {
    return bureauData?.find((x: any) => x.bureau === type);
}
export const getFEFullAccountDetails = async (ccid: string, source: CancelTokenSource) => {
    return await axios.get(CommonUtils.formatString(APIConstants.getFEFullAccountDetails, ccid), { cancelToken: source.token })
        .then((result: any) => result?.data);
}

export const getFELetterData = async (cid: string, source: CancelTokenSource) => {
    return await axios.get(CommonUtils.formatString(APIConstants.getFELetterData, cid), { cancelToken: source.token })
        .then((result: any) => result?.data);
}
export const deleteBureauDetail = async (cabid: string, ccid: string, source: CancelTokenSource) => {
    return await axios.delete(CommonUtils.formatString(APIConstants.deleteBureauDetail, cabid, ccid), { cancelToken: source.token })
        .then((result: any) => result?.data);
}

export const updateAccountMini = (data: any, source: CancelTokenSource) => {
    return (dispatch: any) => {
        return new Promise(async (resolve, reject) => {
            await axios.put(APIConstants.saveFEAccountsMini, data, { cancelToken: source.token })
                .then((result: any) => result?.data)
                .then((result: any[]) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(null);
                    }
                })
                .catch((err: any) => {
                    debugger
                    reject(err);
                });
        });
    }
}