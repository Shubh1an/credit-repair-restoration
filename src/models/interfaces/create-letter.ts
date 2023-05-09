import { LetterSearchTypes } from "../enums";
import { IFastEditAccount } from "./fast-edit-accounts";
import { ICheckboxList, IDropdown, IValueText } from "./shared";

export interface ICreateLetterSource {
  sources?: string[];
  isShowMore?: boolean;
}

export type ICreateLetterInitialState = {
  [name in LetterSearchTypes]?: LetterSearchResponse | null;
} & {
  letterSource: ICreateLetterSource;
  letterOptions: any[];
  selectedAccounts: ISelectedAccounts | null;
  accounts?: IFastEditAccount[];
  advanced?: boolean;
  activeTab: number;
  reloadTempLetter?: boolean;
  reloadDisputeLetters?: boolean;
  roundInfo?: any;
  tempLetters?: ITempLetterQueue[];
  lettersCreated?: boolean;
};
export interface ICreateLetter {
  letterSource: ICreateLetterSource;
  onSave: (param1: any, param2: any) => void;
}

export interface ISearchForLetter {
  onSubmit?: (param: any) => any;
  saveAdvanceOption: (param: any) => any;
  saveSearchedLetter: (value: IDropdown, bureaus: LetterSearchTypes) => any;
  model: any;
  cid?: string;
  createCRALetter: (payload: any, source: any) => any;
  createBureauLetter: (payload: any, source: any) => any;
  createCredBCCLetter: (payload: any, source: any) => any;
  saveActiveTabNumber: (tabNumber: any) => any;
  reloadTempLetter: (payload: boolean) => any;
}

export interface IPDFDisputeLetters {
  accounts?: any[];
  customerId?: string;
  dateEntered?: string;
  letterFileId?: string;
  name?: string;
  pathLocation: string;
  type?: string;
  checked?: boolean;
}
export interface IPDFAgreementLetters {
  dateEntered?: string;
  pathLocation: string;
  eSignatureBase64?: string;
  eSignedDate?: string;
  eSignedIPAddress?: string;
  id?: string;
  isDefault?: boolean;
  isSigned?: boolean;
  name?: string;
  template?: string;
  userId?: string;
  checked?: boolean;
}

export interface ITempLetterQueue {
  accounts?: any[];
  bureauCreated?: string;
  bureauName?: string;
  creditCustomerId?: string;
  disputeLetterId?: string;
  letterContent?: string;
  letterName?: string;
  letterType?: string;
  tempLetterPreviewId?: number;

  checked?: boolean;
}
export interface LetterSearchResponse {
  id?: string;
  scoringRound?: string;
  name?: string;
  template?: string;
  isActive?: boolean;
  isDefault?: boolean;
  dateEntered?: string;
  letterType?: ILetterType;
}
export interface ILetterType {
  typeId?: string;
  type?: string;
}
export interface ICustomerRoundInfo {
  score?: { eqf?: string; tu?: string; exp?: string };
  finalRound?: number;
  roundStarted?: string;
  date?: string;
}
export interface ISelectedAccounts {
  [ccid: string]: ICheckboxListNew[];
}
export interface ICheckboxListNew extends ICheckboxList {
  checked?: boolean;
}
export interface ICreateSingleTempLetterRequest {
  createEQF: boolean;
  createEXP: boolean;
  createTU: boolean;
  customerId: string;
  letterId: string;
  accountIdsEQF: string[];
  accountIdsEXP: string[];
  accountIdsTU: string[];
}

export interface ICreateCredCCBCCTempLetterRequest {
  letterId: string;
  customerId: string;
  accounts: ICustomerAccount[];
}
export interface ICustomerAccount {
  accountID: string;
  accountNameLowered: string;
  accountName: string;
  bureau: string;
}
export interface ICreateTempLetterRequest {
  customerId: string;
  createEQF?: boolean;
  createEXP?: boolean;
  createTU?: boolean;
  accountIdsEQF?: string[];
  accountIdsEXP?: string[];
  accountIdsTU?: string[];
  letterIdTU?: string;
  letterIdEXP?: string;
  letterIdEQF?: string;
}
export interface ICCList {
  id: string;
  cellPhone: string;
  dateEntered: string;
  email: string;
  firstName: string;
  fullName: string;
  isLockedOut: boolean;
  lastName: string;
  lockOut: boolean;
  membershipId: string;
  sameCreditorsAccounts: string;
  telephone: string;
  roleName: string;
}
export interface ICreatePDFLetterPayload {
  customerId?: string;
  letterId?: string;
  accountIds?: string[];
  createWithIds: boolean;
  letterName?: string;
  letterType?: string;
  letterContent?: string;
  letterSource?: string;
}
export interface IRestartRoundPayload {
  customerId?: string;
  startRound: boolean;
  operation?: string;
  sendRoundEmail?: boolean;
  EQFScore?: string;
  EXPScore?: string;
  TUScore?: string;
}
export interface ISetRoundsPayload {
  customerId?: string;
  setRounds: boolean;
  accountIds?: string[];
}

export interface ISendNoticePayload {
  customerId: string;
  emailNotice: boolean;
  saveNotice: boolean;
  notifyAgent: boolean;
  CCList: string;
  BCCList: string;
}
