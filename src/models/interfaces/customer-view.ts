import { NotesTypes } from '../enums';
import { IFranchiseAgentNotes } from './franchise';
import { IDropdown, INameValueMatch } from './shared';

export interface ICustomerView {
    isLoading: boolean;
    reloadComplete: (isError?: boolean) => void;
}
export interface ICustomerFilter {
    MembershipId?: string,
    SiteId?: string,
    ExcludeComplete?: boolean,
    ExcludeOnHold?: boolean,
    ExcludeCancelled?: boolean;
    allMustMatch?: boolean;
    searchCriteria?: INameValueMatch[];
}
export interface ICustomerShort {
    cellPhone?: string;
    currentRound?: number;
    currentRoundCloseDate?: string;
    dateEntered?: string;
    daysToPullScores?: number;
    email?: string;
    firstName?: string;
    leadType?: string;
    franchiseAgentFirstName?: string;
    franchiseAgentLastName?: string;
    franchiseAgentName?: string;
    franchiseOfficeName?: string;
    fullName?: string;
    id: string;
    isLockedOut?: boolean;
    lastName?: string;
    lockOut?: boolean
    membershipId?: string;
    monService?: string;
    monthlyFee?: string;
    processingType?: string;
    referralAgentFirstName?: string;
    referralAgentLastName?: string;
    referralAgentName?: string;
    sameCreditorsAccounts?: string;
    setupFee?: string;
    statusName?: string;
    summaryAmount?: number;
    telephone?: string;
    transactionType?: string;
    todoPending?: boolean;
    isLead?: boolean;
}
export interface INotes {
    title: string;
    type: NotesTypes;
    notes: INotesHistory[] | IProcessingNotesHistory[] | IFranchiseAgentNotes[];
    agents: IDropdown[];
    onSave: (param: any) => any;
    onEdit?: (param: any) => any;
    onDelete: (param: any) => any;
    onOpenCannedNotes: (param: any) => any;
    isProcessingNotes?: boolean;
    isSaving?: boolean;
    saving?: boolean;
    deleting?: boolean;
    updating?: boolean;
    content?: string;
    customer?: any;
    loading?: boolean;
    allowAddNotes?: boolean;
    allowEditNotes?: boolean;
    allowRemoveNotes?: boolean;
}
export interface INotesHistory {
    id: string;
    dateEntered: string;
    note: string;
    roleName: string;
}
export interface IProcessingNotesHistory {
    emailed: boolean;
    internalNoteId: number;
    internalNotes: string;
    internalNotesDateEntered: string;
    sentFrom: string;
    sentTo: string;
}

export interface ICannedNotes {
    type: NotesTypes;
    onSelect: (param: any) => any;
    onClose: (param: any) => any;
    getCannedNotes: (param: any, param2: any) => any;
    deleteCannedNotes: (param: any, param2: any) => any;
    createCannedNotes: (param: any, param2: any, param3: any) => any;
}
export interface ICannedNotesHistory {
    id: string;
    dateEntered: string;
    note: string;
    noteType: string;
}
export interface ISelectCustomer {
    onSelect: (param: any) => any;
    onClose: (param: any) => any;
    getCustomers?: any;
}
export interface IRoundsView {
    id: string;
    round: number;
    equifax: number;
    experian: number;
    transunion: number;
    derogatories: number;
    late: number;
    inquiries: number;
    startDate: string;
    counter: string;
    endDate: string;
    status: string;
}
export interface ICustomerCounts {
    customersTotal: number,
    customersToday: number,
    customersThisWeek: number,
    customersQueue: number
}
export interface IReferralCounts {
    referralOfficesTotal: number,
    referralOfficesToday: number,
    referralOfficesThisWeek: number,
    referralAgentsTotal: number,
    referralAgentsToday: number,
    referralAgentsThisWeek: number
}
export interface IFranchiseCounts {
    franchiseOfficesTotal: number,
    franchiseAgentsTotal: number,
    franchiseAgentsToday: number,
    franchiseAgentsThisWeek: number
}
export interface ILetterCounts {
    bureau: { id: string, value: string },
    scoringRound: number,
    id: string,
    name: string,
    template: string,
    isActive: boolean,
    isDefault: boolean,
    dateEntered: Date,
    letterType: { typeId: string, type: string }
}
export interface IRoleCounts {
    'administrator': number,
    'credit Agent': number,
    'customer': number,
    'lead': number,
    'office Manager': number,
    'referral Agent': number,
    'referral Manager': number
}
export interface ICustomersState {
    statuses?: IStatus[];
    apiActive: boolean;
    states?: IDropdown[];
    hasPartneryKey: false;
    s3Files: any[];
    adminSettings?: any;
    disputeStats: any[];
    disputeStatsLoading?: boolean;
}
export interface IAdminSettings {
    hideTargetScore?: boolean;
    hideServicesPaymentsTab?: boolean;
}
export interface ICustomerFullDetails {
    cbGuid: string,
    generalNote: string,
    outsourcingActive: boolean,
    bureauAddress: string,
    bureauName: string,
    middleName: string,
    suffix: string,
    agent: IAgent,
    referrer: IReferrer,
    streetAddress: string,
    address2: string,
    secondaryAddress?: string,
    apartmentNumber?: string,
    city: string,
    stateCode: string,
    zipCode: string,
    cellPhone: string,
    dateOfBirth: string,
    ssn: string,
    statusName: string,
    targetScore: number,
    midScore?: number;
    creditCardType: string,
    creditCardNumber: string,
    creditCardExpiration: string | Date,
    bankName: string,
    bankAccountNumber: string,
    bankRoutingNumber: string,
    transactionType: string,
    monitoringService: string,
    monitoringLink: string,
    monitoringUserName: string,
    monitoringPassword: string,
    monitoringSecretWord: string,
    reportPullDate: string,
    setupFee: string,
    monthlyFee: string,
    monthlyDueDate: string,
    lastLoginDate: string,
    processingType: string,
    scoringRounds: IScoringRound[],
    spouse: any,
    historicalNotes: IHistoricalNote[],
    historicalInternalNotes: IHistoricalInternalNote[],
    additionalReferrers: any[],
    files: IFile[],
    disputeLetterFiles: IDisputeLetterFile[],
    collectionAccountItems: ICollectionAccountItem[],
    printPreviewAccountItems: any,
    disputeLetters: any,
    submittedToProcessing: boolean,
    userName: string,
    password: string,
    isLead: boolean,
    notes: string,
    noteDate: string,
    roleName: string,
    internalNotes: string,
    internalNoteDate: string,
    sameCreditorsAccounts: string,
    id: string,
    membershipId: string,
    lockOut: boolean,
    isLockedOut: boolean,
    firstName: string,
    lastName: string,
    fullName: string,
    telephone: string,
    email: string,
    dateEntered: string;
    websiteId?: string;
    referralAgent?: string | { id: string };
    franchiseAgent?: string | { id: string };
    bestTimeToCall?: string;
    leadType?: string;
    notifyAgent?: boolean;
    emailToAgent?: boolean;
    submitToProcessingBy?: string;
    submitToProcessingByUserId?: string;
    submitToProcessingOn?: string;
    isSubmitToProcessing?: boolean;
}
export interface IAgent {
    agentCode: number,
    fax: string,
    webAddress: string,
    office: IOffice,
    role: string,
    userName: string,
    password: string,
    isEnrolled: string,
    isResellerAgent: boolean,
    notes: string,
    noteDate: string,
    roleName: string,
    internalNotes: string,
    internalNoteDate: string,
    sameCreditorsAccounts: string,
    id: string,
    membershipId: string,
    lockOut: boolean,
    isLockedOut: boolean,
    firstName: string,
    lastName: string,
    fullName: string,
    telephone: string,
    cellPhone: string,
    email: string,
    dateEntered: string
}
export interface IOffice {
    id: string,
    isMain: boolean,
    name: string,
    officeHideTargetScore: boolean,
    ccWelcomeMessage: boolean,
    isOrphanOffice: boolean;
    defaultAgentName: string;
    defaultAgentId: string
}
export interface IReferrer {
    fax: string,
    office: IReferrerOffice,
    userName: string,
    password: string,
    notes: string,
    noteDate: string,
    roleName: string,
    internalNotes: string,
    internalNoteDate: string,
    sameCreditorsAccounts: string,
    id: string,
    membershipId: string,
    lockOut: boolean,
    isLockedOut: boolean,
    firstName: string,
    lastName: string,
    fullName: string,
    telephone: string,
    cellPhone: string,
    email: string,
    dateEntered: string,
}
export interface IReferrerOffice {
    agent: IAgent,
    streetAddress: string,
    city: string,
    state: string,
    zipCode: string,
    id: string,
    name: string,
    classification: string,
    telephone: string,
    fax: string,
    dateEntered: string
}
export interface IScoringRound {
    id: string,
    statusName: string,
    experianScore: number,
    equifaxScore: number,
    transUnionScore: number,
    derogatories: number,
    inquiries: number,
    slowPays: number,
    closeDate: string,
    isClosed: boolean,
    daysToClose: number,
    dateEntered: string,
    roundEndDate: string,
    currentRound: number,
    isComplete: boolean
}
export interface IHistoricalNote {
    id: number,
    roleName: string,
    note: string,
    dateEntered: string
}
export interface IHistoricalInternalNote {
    internalNoteId: number,
    internalNotes: string,
    internalNotesDateEntered: string,
    emailed: boolean,
    sentTo: string,
    sentFrom: string
}
export interface IAdditionalReferrer {

}
export interface IFile {
    type: string;
    id: string;
    name: string;
    pathLocation: string;
    description: string;
    dateEntered: string;

    checked?: boolean;
}
export interface IDisputeLetterFile {
    type: string;
    letterFileId: string;
    customerId: string;
    name: string;
    pathLocation: string;
    dateEntered: string;
    accounts: string[];

    checked?: boolean;
}
export interface ICollectionAccountItem {
    eqfInqDate: string,
    expInqDate: string,
    tuInqDate: string,
    eqfBureauAccountName: string,
    expBureauAccountName: string,
    tuBureauAccountName: string,
    collectorId: string,
    collectorAddressId: string,
    collectorAddresses: string,
    collectorCity: string,
    collectorState: string,
    collectorZipCode: string,
    modifierAgentId: string,
    modifierAgentName: string,
    modifiedOn: string,
    isFastTrack: boolean,
    bureauDateEntered: string,
    bureauModifiedOnString: string,
    updated: string,
    isInsertedEQF: boolean,
    isInsertedEXP: boolean,
    isInsertedTU: boolean,
    eqfAccountStatus: string,
    expAccountStatus: string,
    tuAccountStatus: string,
    eqfAccountBureauId: string,
    expAccountBureauId: string,
    tuAccountBureauId: string,
    isExperian: boolean,
    isEquifax: boolean,
    isTransUnion: boolean,
    collectorName: string,
    accountTypeName: string,
    eqfOutcome: string,
    expOutcome: string,
    tuOutcome: string,
    objeqfOutcome: string,
    objexpOutcome: string,
    objtuOutcome: string,
    eqfAccountNumber: string,
    expAccountNumber: string,
    tuAccountNumber: string,
    topAccountNumber: string,
    currentEQFDisputeReason: string,
    currentEXPDisputeReason: string,
    currentTUDisputeReason: string,
    eqfPayStatus: string,
    expPayStatus: string,
    tuPayStatus: string,
    eqfBalance: string,
    expBalance: string,
    tuBalance: string,
    eqfDateOpened: string,
    expDateOpened: string,
    tuDateOpened: string,
    eqfHighCreditLimit: string,
    expHighCreditLimit: string,
    tuHighCreditLimit: string,
    id: string,
    notes: string,
    scoringRound: string,
    numberOfLetters: number,
    dateEntered: string;

    checked?: boolean;
}
export interface IStatus {
    creditCustomerStatusId?: string;
    statusName?: string;
}
export interface IMailChimpSubscriber {
    id: string;
    name: string;
    web_id: number;
}
export interface IMailChimpList {
    apiName: string;
    apiActive: boolean;
    apiKey: string;
    id: string;
}
export interface IUpdateCustomerModel {
    creditCustomer: ICustomerFullDetails;
    whoLeft?: string;
    isSendMail?: string; // "1" or "2" etc
    newSpouseId?: string;
}
export interface IUpdateLeadModel {
    lead: ICustomerFullDetails;
    SendAgentEmail?: boolean;
}
export interface IToDo {
    toDoId: number;
    toDoText: string;
    dueDate: string;
    isCompleted: boolean;
    targetId: string;
    completedOn?: string;
    createdOn: string;
}