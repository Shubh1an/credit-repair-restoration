import produce from "immer";

import { ICheckboxList, IPayLoad } from "../models/interfaces/shared";
import { CreateLetterInitialState } from "./create-letter.initial-state";
import { CreateLetterActionTypes } from './../actions/create-letter.action-types';
import { EnumBureausShorts, LetterSearchTypes } from "../models/enums";
import { Variables } from "../shared/constants";
import { ISelectedAccounts } from "../models/interfaces/create-letter";
import { CommonUtils } from "../utils/common-utils";
import { AuthActionTypes } from "../actions/auth.action-types";
import { CustomersListInitialState } from "./customer-view.initial-state";

export function CreateLetterReducer(state = CreateLetterInitialState, action: IPayLoad): any {
    return produce(state, (draft) => {
        switch (action.type) {
            case CreateLetterActionTypes.SET_LETTER_SOURCE:
                draft.letterSource = action.payload;
                draft.advanced = false;
                resetFields(draft);
                break;
            case CreateLetterActionTypes.SET_LETTER_OPTIONS:
                draft.letterOptions = action.payload;
                break;
            case CreateLetterActionTypes.SET_SELECTED_ACCOUNTS: // acc list checkbox change
                draft.selectedAccounts = action.payload;
                break;
            case CreateLetterActionTypes.SET_LETTER_ACCOUNTS: // page load
                draft.accounts = action.payload;
                break;
            case CreateLetterActionTypes.SET_LETTER_TEMPLATE: // letter template search 
                draft[action.payload.bureau as LetterSearchTypes] = action.payload?.value;
                if (draft.accounts?.length && action.payload?.value) {
                    switch (action.payload.bureau) {
                        case LetterSearchTypes.TransUnion:
                            {
                                let tus = draft?.accounts?.filter(x => x && x.tuAccountBureauId !== Variables.EMPTY_GUID)
                                    ?.map(x => ({
                                        [x.id]: [
                                            ...(draft?.selectedAccounts && draft?.selectedAccounts[x.id]
                                                ? draft.selectedAccounts[x.id]?.filter(m => m && m.text !== EnumBureausShorts.TU) : []),
                                            !isDisabled(x.tuOutcome) ? { value: x.tuAccountBureauId, text: EnumBureausShorts.TU, disabled: false, checked: true } : null]
                                    } as ISelectedAccounts));

                                if (tus?.length) {
                                    tus.forEach((x) => {
                                        draft.selectedAccounts = {
                                            ...draft.selectedAccounts,
                                            ...x
                                        };
                                    });
                                }
                            }
                            break;
                        case LetterSearchTypes.Experian:
                            {
                                let exps = draft?.accounts?.filter(x => x && x.expAccountBureauId !== Variables.EMPTY_GUID)
                                    ?.map(x => ({
                                        [x.id]: [...(draft?.selectedAccounts && draft?.selectedAccounts[x.id]
                                            ? draft.selectedAccounts[x.id]?.filter(m => m && m.text !== EnumBureausShorts.EXP) : [])
                                            ,
                                        !isDisabled(x.expOutcome) ? { value: x.expAccountBureauId, text: EnumBureausShorts.EXP, disabled: false, checked: true } : null]
                                    } as ISelectedAccounts));

                                if (exps?.length) {
                                    exps.forEach((x) => {
                                        draft.selectedAccounts = {
                                            ...draft.selectedAccounts,
                                            ...x
                                        };
                                    });
                                }
                            }
                            break;
                        case LetterSearchTypes.Equifax:
                            {
                                let eqfs = draft?.accounts?.filter(x => x && x.eqfAccountBureauId !== Variables.EMPTY_GUID)
                                    ?.map(x => ({
                                        [x.id]: [
                                            ...(draft?.selectedAccounts && draft?.selectedAccounts[x.id]
                                                ? draft.selectedAccounts[x.id]?.filter(m => m && m.text !== EnumBureausShorts.EQF) : []),
                                            !isDisabled(x.eqfOutcome) ? { value: x.eqfAccountBureauId, text: EnumBureausShorts.EQF, disabled: false, checked: true } : null]
                                    } as ISelectedAccounts));

                                if (eqfs?.length) {
                                    eqfs.forEach((x) => {
                                        draft.selectedAccounts = {
                                            ...draft.selectedAccounts,
                                            ...x
                                        };
                                    });
                                }
                            }
                            break;
                        case LetterSearchTypes.CRA:
                            {
                                let availableAccs = draft?.accounts?.filter(x => x && x.eqfAccountBureauId !== Variables.EMPTY_GUID || x.expAccountBureauId !== Variables.EMPTY_GUID || x.tuAccountBureauId !== Variables.EMPTY_GUID);
                                let buearus = {} as ISelectedAccounts;
                                const isTU = !!draft.letterSource?.sources?.find(x => x === EnumBureausShorts.TU);
                                const isEXP = !!draft.letterSource?.sources?.find(x => x === EnumBureausShorts.EXP);
                                const isEQF = !!draft.letterSource?.sources?.find(x => x === EnumBureausShorts.EQF);
                                availableAccs?.forEach(x => {
                                    if (x?.tuAccountBureauId !== Variables.EMPTY_GUID && isTU) {
                                        buearus = {
                                            ...buearus,
                                            [x.id]: [...(buearus[x.id] || []), !isDisabled(x.tuOutcome) ? { value: x?.tuAccountBureauId, text: EnumBureausShorts.TU, disabled: false, checked: true } : null]
                                        } as ISelectedAccounts;
                                    }
                                    if (x?.expAccountBureauId !== Variables.EMPTY_GUID && isEXP) {
                                        buearus = {
                                            ...buearus,
                                            [x.id]: [...(buearus[x.id] || []), !isDisabled(x.expOutcome) ? { value: x?.expAccountBureauId, text: EnumBureausShorts.EXP, disabled: false, checked: true } : null]
                                        } as ISelectedAccounts;
                                    }
                                    if (x?.eqfAccountBureauId !== Variables.EMPTY_GUID && isEQF) {
                                        buearus = {
                                            ...buearus,
                                            [x.id]: [...(buearus[x.id] || []), !isDisabled(x.eqfOutcome) ? { value: x?.eqfAccountBureauId, text: EnumBureausShorts.EQF, disabled: false, checked: true } : null]
                                        } as ISelectedAccounts;
                                    }
                                });
                                if (buearus) {
                                    draft.selectedAccounts = {
                                        ...draft.selectedAccounts,
                                        ...buearus
                                    };
                                }
                            }
                            break;
                        case LetterSearchTypes.Creditor:
                        case LetterSearchTypes.BCC:
                        case LetterSearchTypes.CC:
                            {
                                let accs = draft?.accounts?.filter(x => x && x.eqfAccountBureauId !== Variables.EMPTY_GUID || x.expAccountBureauId !== Variables.EMPTY_GUID || x.tuAccountBureauId !== Variables.EMPTY_GUID);
                                let allbuearus = {} as ISelectedAccounts;
                                accs?.forEach(x => {
                                    allbuearus = {
                                        ...allbuearus,
                                        [x.id]: [
                                            ...(draft?.selectedAccounts && draft?.selectedAccounts[x.id]
                                                ? draft.selectedAccounts[x.id]?.filter(m => m && m?.text !== mapBureauToShort(action.payload.bureau)) : []),
                                            {
                                                value: action.payload.bureau,
                                                text: (
                                                    action.payload.bureau === LetterSearchTypes.Creditor
                                                        ? EnumBureausShorts.CREDITOR
                                                        : action.payload.bureau === LetterSearchTypes.BCC
                                                            ? EnumBureausShorts.BCC : EnumBureausShorts.CC
                                                ),
                                                disabled: false, checked: true
                                            }]
                                    } as ISelectedAccounts;
                                });
                                if (allbuearus) {
                                    draft.selectedAccounts = {
                                        ...draft.selectedAccounts,
                                        ...allbuearus
                                    };
                                }
                            }
                            break;
                    }
                } else {
                    if (draft.selectedAccounts) {
                        let newData = draft.selectedAccounts;
                        Object.getOwnPropertyNames(draft.selectedAccounts).forEach(key => {
                            newData = {
                                ...newData,
                                [key]: draft.selectedAccounts && draft?.selectedAccounts[key]
                                    ? draft?.selectedAccounts[key].filter((x: ICheckboxList) => x?.text !== mapBureauToShort(action.payload.bureau))
                                    : []
                            };
                        });
                        draft.selectedAccounts = newData;
                    }
                }
                if (action.payload?.value) {
                    draft.activeTab = 1;
                }
                break;
            case CreateLetterActionTypes.SET_LETTER_ADVANCED:
                draft.advanced = action.payload;
                resetFields(draft);
                break;
            case CreateLetterActionTypes.SET_LETTER_ACTIVETAB:
                draft.activeTab = action.payload;
                break;
            case CreateLetterActionTypes.SET_TEMP_LETTER_RELOAD:
                draft.letterSource = { sources: [], isShowMore: true };
                draft.advanced = false;
                resetFields(draft);
                draft.reloadTempLetter = action.payload;
                break;
            case CreateLetterActionTypes.SET_DISPUTE_LETTERS_RELOAD:
                draft.reloadDisputeLetters = action.payload;
                break;
            case CreateLetterActionTypes.SET_CUSTOMER_ROUND_INFO:
                draft.roundInfo = action.payload;
                break;
            case CreateLetterActionTypes.SET_TEMP_LETTERS:
                draft.tempLetters = action.payload;
                resetFields(draft);
                break;
            case CreateLetterActionTypes.SET_LETTERS_CREATED:
                draft.lettersCreated = action.payload;
                break;
            case AuthActionTypes.SET_LOGOUT:
                return CustomersListInitialState;
            default:
                break;
        }
    })
}
function isDisabled(outcome?: string) {
    const isAvailable = CommonUtils.isAvailableToSelect(outcome);
    if (!isAvailable) return true;
    return false;
}
function resetFields(draft: any) {
    draft.selectedAccounts = null;
    draft[LetterSearchTypes.CRA] = null;
    draft[LetterSearchTypes.TransUnion] = null;
    draft[LetterSearchTypes.Experian] = null;
    draft[LetterSearchTypes.Equifax] = null;
    draft[LetterSearchTypes.Creditor] = null;
    draft[LetterSearchTypes.CC] = null;
    draft[LetterSearchTypes.BCC] = null;
}
function mapBureauToShort(search: LetterSearchTypes): EnumBureausShorts {
    switch (search) {
        case LetterSearchTypes.TransUnion:
            return EnumBureausShorts.TU;
        case LetterSearchTypes.Experian:
            return EnumBureausShorts.EXP;
        case LetterSearchTypes.Equifax:
            return EnumBureausShorts.EQF;
        case LetterSearchTypes.Creditor:
            return EnumBureausShorts.CREDITOR;
        case LetterSearchTypes.BCC:
            return EnumBureausShorts.BCC;
        case LetterSearchTypes.CC:
            return EnumBureausShorts.CC;
        case LetterSearchTypes.CRA:
            return EnumBureausShorts.CRA;
    }
    return EnumBureausShorts.CRA;
}