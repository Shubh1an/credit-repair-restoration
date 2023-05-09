import { CancelTokenSource } from 'axios';
import { AccountTypes, CollectionEntryTypes, EnumBureausShorts, EnumComponentMode, EnumControlTypes, GlobalParams } from '../enums';
import { IDropdown } from './shared';

export interface IFastEditAccountView {
    list: string[];
}
export interface IFEAccountField {
    mode?: EnumComponentMode;
    label?: string;
    value?: string;
    checked?: boolean;
    options?: any[];
    type?: EnumControlTypes;
    autoCompleteType?: CollectionEntryTypes;
    onChange?: (prop: any) => any;
}
export interface IBureauInputModel {
    mode?: EnumComponentMode;
    data?: IBureauDetails;
    accountType?: string;
    onChange: (data: any) => any;
}
export interface IBureauDetails {
    accNum?: string;
    balance?: string;
    accStatus?: string;
    payStatus?: string;
    dateOpened?: string;
    highCredit?: string;
    dateOfInquiry?: string;
    currentOutcome?: string;
    currentDisputeReason?: string;
}
export interface IFullBureauInputModel extends IBureauInputModel {
    data?: IFullBureauDetails;
    names?: IDataItem[];
    addresses?: IDataItem[];
}
export interface IFullBureauDetails extends IBureauDetails {
    id?: string;
    isInserted?: boolean;
    originalCreditor?: string;
    courtOrPlaintiff?: string;
    dateLastActivity?: string;
    responsibility?: string;
    dateLastReported?: string;
    highCreditLimit?: string;
    monthlyPayment?: string;
    pastDueAmount?: string;
    payments30?: string;
    payments60?: string;
    payments90?: string;
    incorrectNames?: IDataItem[];
    incorrectAddreses?: IDataItem[];
    notes?: string;
    accountNotes?: string;
    newName?: string;
    newAddress?: string;
}
export interface IFEAddress {
    addressView: ICollectorAddress;
    onSave: (param: any) => any;
    onClose: () => any;
}
export interface IAccountdetails {
    round?: string;
    modifiedOn?: string;
    enteredOn?: string;
    by?: string;
    showLetterWarning?: boolean;
    ccid: string;
}
export interface ICollectorAddress {
    collectorName?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    collectorAddressId?: string;
    collectorId?: string;
    modifierAgentId?: string;
    ccaId?: string;
}
export interface IFEAccount {
    accountDetails?: IAccountdetails;
    collectorAddress?: ICollectorAddress;
    collectionAccountId?: string;
    transUnion?: IBureauDetails;
    experian?: IBureauDetails;
    equifax?: IBureauDetails;
    accountType?: string;
}
export interface IFEAddEditAccountModel {
    mode?: EnumComponentMode;
    transUnion?: IBureauDetails;
    experian?: IBureauDetails;
    equifax?: IBureauDetails;
    accountType?: string;
    onTUChange?: (param: any) => any;
    onEXPChange?: (param: any) => any;
    onEQChange?: (param: any) => any;
    onReasonChange?: (param: any) => any;
    onOutcomeChange?: (param: any) => any;
    onAccTypeChange?: (param: any) => any;
    onCopyClick?: (param: any, param2: any) => any;
    isTUAvailable?: boolean;
    isEXPAvailable?: boolean;
    isEQFAvailable?: boolean;
    allowCopy?: boolean;
}
export interface IFEFullAddEditAccountModel {
    mode?: EnumComponentMode;
    transUnion?: IFullBureauDetails | null;
    experian?: IFullBureauDetails | null;
    equifax?: IFullBureauDetails | null;
    accountType?: string;
    notes?: string;
    names?: IDataItem[];
    addresses?: IDataItem[];
    onTUChange?: (param: any) => any;
    onEXPChange?: (param: any) => any;
    onEQChange?: (param: any) => any;
    onAccountNotesChange?: (param: any, value: any) => any;
    onDelete?: (param: any, value: any) => any;
    onCopyClick?: (source: EnumBureausShorts, detination: EnumBureausShorts) => any;
}
export interface IFEFilterModel {
    sort?: string,
    filterBy: string,
    filterByText: string
}
export interface IFastEditAccountsParams {
    customerId: string;
    pageFrom: number;
    pageTo: number
    CCAID?: string;
    orderBy?: string;
    orderType?: string;
    accountName?: string;
    round?: number;
    accountType?: string;
    accountStatus?: string;
}
export interface IFastEditAccount {
    accountTypeName: AccountTypes.Inquiry;
    bureauDateEntered: string;
    bureauModifiedOnString: string;
    collectorAddressId: string;
    collectorAddresses: string;
    collectorCity: string;
    collectorId: string;
    collectorName: string;
    collectorState: string;
    collectorZipCode: string;
    currentEQFDisputeReason: string;
    currentEXPDisputeReason: string;
    currentTUDisputeReason: string;
    dateEntered: string;
    eqfAccountBureauId: string;
    eqfAccountNumber: string;
    eqfAccountStatus: string;
    eqfBalance: string;
    eqfBureauAccountName: string;
    eqfDateOpened: string;
    eqfHighCreditLimit: string;
    eqfInqDate?: string;
    eqfOutcome?: string;
    eqfPayStatus: string;
    expAccountBureauId: string;
    expAccountNumber: string;
    expAccountStatus: string;
    expBalance: string;
    expBureauAccountName: string;
    expDateOpened: string;
    expHighCreditLimit: string;
    expInqDate?: string;
    expOutcome: string;
    expPayStatus: string;
    id: string;
    isEquifax: boolean;
    isExperian: boolean;
    isFastTrack: boolean;
    isInsertedEQF: boolean;
    isInsertedEXP: boolean;
    isInsertedTU: boolean;
    isTransUnion: boolean;
    modifiedOn: string;
    modifierAgentId: string;
    modifierAgentName: string;
    notes: string;
    numberOfLetters: number;
    objeqfOutcome: string;
    objexpOutcome: string;
    objtuOutcome: string;
    scoringRound: string;
    topAccountNumber: string;
    tuAccountBureauId: string;
    tuAccountNumber: string;
    tuAccountStatus: string;
    tuBalance: string;
    tuBureauAccountName: '';
    tuDateOpened: string;
    tuHighCreditLimit: string;
    tuInqDate?: string;
    tuOutcome?: string;
    tuPayStatus?: string;
    updated?: string;
    isAddressEmpty?: boolean;
}

export interface IBureauChange {
    accNum?: string;
    accStatus?: string;
    balance?: string;
    currentDisputeReason?: string;
    currentOutcome?: string;
    dateOfInquiry?: string;
    dateOpened?: string;
    highCredit?: string;
    payStatus?: string;
}

export type FastEditSingleAccountModel = {
    [name in EnumBureausShorts]: IBureauChange;
}
    & {
        [name in GlobalParams]?: any;
    }
    & {
        isFastTrack?: boolean;

        /* for add new acc START */
        round?: string;
        accountName?: string;
        /* for add new acc END */
        accountNotes?: string; // for full acc update
        addresses?: IDataItem[];
        names?: IDataItem[];
        selectedAddresses?: string[];
        selectedNames?: string[];
    };

export interface IFEAccountHistoryModel {
    [name: string]: FastEditSingleAccountModel;
}
export interface IFEAccountSavedResponse {
    [name: string]: IFastEditAccount[];
}
export interface ISaveAccountModel {
    isFastTrack?: number; // 0(FALSE) or 1(TRUE)
    newAccountName?: string;
    accountNameId?: string;
    dboRounds?: string,
    EQFSelectAccount?: boolean;
    EXPSelectAccount?: boolean;
    TUSelectAccount?: boolean;
    modifierAgentId: string,
    constantReason?: string,
    constantOutcome?: string,
    accType?: string,
    accTypeValue?: string,
    accountId: string,
    customerId: string,
    newEQFAcctNumber?: string,
    newEQFBalance?: string,
    selectAccStatus?: boolean,
    newEQFAcctStatus?: string,
    newEQFAcctStatusValue?: string,
    newEQFPayStatus?: string,
    eqfBureauId?: string,
    changeEQFOutcome?: boolean,
    disputeReasonEQF?: string,
    disputeReasonEQFText?: string,
    grdEQFOutcome?: string,
    eqfTailEndDisputeRO?: string,
    newEQFDateOpened?: string,
    newEQFHighCreditLimit?: string,
    newEQFInqDate?: string,
    newEXPAcctNumber?: string,
    newEXPBalance?: string,
    editEXPAcctStatus?: boolean,
    newEXPAcctStatus?: string,
    newEXPAcctStatusValue?: string,
    newEXPPayStatus?: string,
    expBureauId?: string,
    changeEXPOutcome?: boolean,
    disputeReasonEXP?: string,
    disputeReasonEXPText?: string,
    grdEXPOutcome?: string,
    expTailEndDisputeRO?: string,
    newEXPDateOpened?: string,
    newEXPHighCreditLimit?: string,
    newEXPInqDate?: string,
    newTUAcctNumber?: string,
    newTUBalance?: string,
    editTUAccountStatus?: boolean,
    newTUAcctStatus?: string,
    newTUAcctStatusValue?: string,
    newTUPayStatus?: string,
    tuBureauId?: string,
    changeTUOutcome?: boolean,
    disputeReasonTU?: string,
    disputeReasonTUText?: string,
    grdTUOutcome?: string,
    tuTailEndDisputeRO?: string,
    newTUDateOpened?: string,
    newTUHighCreditLimit?: string,
    newTUInqDate?: string;
    expoutcomelist?: string;
    eqfoutcomelist?: string;
    tuoutcomelist?: string;
}
export interface ISaveFullAccountModel {
    isFastTrack?: number; // 0(FALSE) or 1(TRUE)
    customerId?: string;
    accountId?: string;
    eqfAllNew?: boolean;
    expAllNew?: boolean;
    tuAllNew?: boolean;
    bureauInfo?: ISaveFullBureauInfo[];
    accountInfo?: IAccountInfo;
}
export interface IAccountInfo {
    accountType?: IDataItem;
    notes?: string;
    scoringRound?: string;
    collector?: IDataItem;
}
export interface ISaveFullBureauInfo {
    modifierAgentId?: string;
    modifiedOn?: string;
    id?: string;
    bureau?: number;
    accountNumber?: string;
    status?: IDataItem;
    payStatus?: string;
    tailEndDisputeReason?: IDataItem;
    outcome?: IDataItem;
    originalCreditor?: string;
    courtPlaintiff?: string;
    dateOfInquiry?: string;
    dateEntered?: string;
    lastActivity?: string;
    responsibility?: string;
    dateOpened?: string;
    lastDateReported?: string;
    highCreditLimit?: string;
    balance?: string;
    monthlyPayment?: string;
    pastDueAmount?: string;
    payHistory30?: string;
    payHistory60?: string;
    payHistory90?: string;
    notes?: string;
    names?: IDataItem[];
    addresses?: IDataItem[];
    terms?: string;
    condition?: string;
    numberOfMonthsReported?: string;
    IsInsertedEQF?: boolean;
    IsInsertedEXP?: boolean;
    IsInsertedTU?: boolean;
}
export interface IDataItem {
    id?: string;
    value?: string;
}
export interface IFastFullDetailsRequest {
    changes: FastEditSingleAccountModel;
    cid: string;
    modifierAgentId: string;
    axiosSource: CancelTokenSource;
    account: any;
    ccid: string;
} 