import { IDataItem } from "./fast-edit-accounts";
import { IValueText } from "./shared";

export interface IFranchiseOffice {
    id: string;
    isMain?: boolean;
    isOrphanOffice?: boolean;
    name: string;
    numberOfAgents: number;
    ccWelcomeMessage?: boolean;
    officeHideTargetScore: boolean;
    roundDays: number;
    defaultAgentId?: string;
    defaultAgentName?: string;
    logoUrl?: string;
}
export interface IReferralOffice {
    id: string;
    agentName?: string;
    classification?: string;
    name: string;
    numberOfAgents: number;
    dateEntered?: string;
    fax?: string;
    telephone?: string;
    streetAddress?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    agent?: IFranchiseAgent;
}
export interface IFranchiseAgent {
    id?: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    userName?: string;
    role?: string;
    roleName?: string;
    telephone?: string;
    cellPhone?: string;
    email?: string;
    dateEntered?: string;
    membershipId?: string;
    fax?: string;
    webAddress?: string;
    officeId?: string;
    password?: string;
    confirmPassword?: string;
    notes?: string;
    agentCode?: string;
    lockOut?: boolean;
    isLockedOut?: boolean;
    sameCreditorsAccounts?: string;
    office?: IFranchiseOffice;
    onSave?: (param: any) => any;
    onEdit?: (param: any) => any;
    onDelete?: (param: any) => any;
    customerRole?: string;
    officeName?: string;
}
export interface IFranchiseService {
    id?: string;
    name?: string;
    officeName?: string;
    cost?: number;
    franchiseOfficeId?: string;
    serviceId?: string;
    baseCost?: number;
    dateEntered?: string;
    canOverride?: boolean;
    onSave: (param: any) => any;
    onEdit?: (param: any) => any;
    onDelete: (param: any) => any;
}
export interface IFranchisePayments {
    id?: string;
    name?: string;
    flatFee?: number;
    percentFee?: number;
    rawPercentFee?: number;
    franchiseOfficeId?: string;
    methodId?: string;
    onSave: (param: any) => any;
    onEdit?: (param: any) => any;
    onDelete: (param: any) => any;
}
export interface IFranchiseAgentNotes {
    id?: string;
    roleName?: string;
    note?: string;
    dateEntered?: string;
    membershipId?: string;
}
export interface IReferralPartner {
    agentName?: string;
    numberOfAgents?: number;
    classification?: string;
    id?: string;
    name?: string;
    telephone?: string;
    fax?: string;
    dateEntered?: string;
}
export interface IFormOptions {
    formOptionsId?: string;
    formType?: string;
    dateEntered?: string;
    defaultFAgentId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    emailData?: boolean;
    cellPhone?: string;
}

export interface IOutsourcedServices {
    description?: string;
    name?: string;
    serviceId?: string;
    serviceOptions?: IServiceOptionItem[];
    mappingId?: string;
}
export interface IServiceOptionItem {
    cost?: number;
    description?: string;
    id?: string;
    name?: string;
}
export interface IFranchiseOutsourceService {
    options: string[];
    removedOptions: string[];
    franchiseOfficeId: string;
    serviceId: string;
}

export interface IServiceCategory {
    category?: string;
    servicePricingId?: string;
    levels?: IServiceLevel[];
}
export interface IServiceLevel {
    level?: IMasterServiceLevel;
    letterCount?: number;
    cost?: number;
    description?: string;
    servicePricingLevelId?: string;
    options?: IMasterServiceAdOns[];
}
export interface IServiceOption {
    option: IMasterServiceAdOns;
    description?: string;
    cost?: number;
    servicePricingAddOnId?: string;
}
export interface IMasterService {
    serviceId?: string;
    name?: string;
    serviceName?: string;
    description?: string;
    isSelected?: boolean;
    servicePricingId?: string;
}
export interface IMasterServiceLevel {
    serviceLevelId?: string;
    name?: string;
    description?: string;
    cost?: number;
    letterCount?: number;
}

export interface IMasterServiceAdOns {
    serviceAddOnId?: string;
    name?: string;
    description?: string;
    cost?: number;
}
export interface IFranchCategory {
    franchiseOfficeServicePricingId?: string;
    masterServiceId: string;
    servicePricingId: string;
    categoryName: string;
    isSelected: string;
    servicePricingLevels?: IFranchLevel[];
}
export interface IFranchLevel {
    franchiseOfficeServicePricingLevelId?: string;
    name: string;
    description: string;
    letterCount: number;
    cost: number;
    servicePricingLevelId: string;
    serviceAddOns?: IFranchAddOn[];
}
export interface IFranchAddOn {
    franchiseOfficeServicePricingAddOnId?: string;
    name: string;
    description: string;
    cost: number;
    servicePricingAddOnId: string;

}
export interface IFranchiseOfficeGroup {
    name: string;
    agents: IFranchiseAgent[];
}