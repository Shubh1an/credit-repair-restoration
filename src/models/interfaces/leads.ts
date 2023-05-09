import { ICustomerShort, IStatus } from "./customer-view";
import { IFranchiseAgent } from "./franchise";
import { INameValue } from "./shared";

export interface ILeadsResponse {
    leads: ICustomerShort[];
    referralAgents: INameValue[];
    franchiseAgents: INameValue[];
    statusNames: string[];
    tranactionTypes: string[];
}
export interface ILeadDetails {
    lead: ICustomerShort;
    creditMonitoring: ICreditMonitoring;
}

export interface ICreditMonitoring {
    monitoringService: string,
    monitoringLink: string,
    monitoringUserName: string,
    monitoringPassword: string,
    monitoringSecretWord: string,
    cbRefreshTok?: string;
    id?: string;
    email?: string;
    reportPullDate?: string;
}
export enum SearchMatch {
    Complete, Contains, StartsWith
}
export interface ISearchField {
    name?: string;
    match?: SearchMatch;
    value?: string;
}