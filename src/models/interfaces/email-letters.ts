import { ILetterType } from "./create-letter";
import { IDataItem } from "./fast-edit-accounts";

export interface IEmailLetters {
  bureau?: IDataItem;
  scoringRound?: number;
  id?: string;
  name?: string;
  template?: string;
  isActive?: boolean;
  isDefault?: boolean;
  dateEntered?: string;
  letterType?: ILetterType;
  officeId?: string;
  bcc?: string[];
  cc?: string[];
  sender?: string[];
}
export interface ServiceTempLetters {
  bureau?: IDataItem;
  scoringRound?: number;
  id?: string;
  name?: string;
  template?: string;
  isActive?: boolean;
  isDefault?: boolean;
  dateEntered?: string;
  serviceAgreementType?: ILetterType;
  officeId?: string;
  bcc?: string[];
  cc?: string[];
  sender?: string[];
}
export interface PostGridLetters {}
export interface ICreditCustomerViewItem {
  daysToPullScores: number;
  currentRoundCloseDate: string;
  currentRound: number;
  monthlyFee: string;
  setupFee: string;
  referralAgentName: string;
  referralAgentLastName: string;
  summaryAmount: number;
  referralAgentFirstName: string;
  franchiseAgentLastName: string;
  franchiseAgentFirstName: string;
  transactionType: string;
  monService: string;
  processingType: string;
  isLead: boolean;
  todoPending: boolean;
  franchiseAgentName: string;
  franchiseOfficeName: string;
  statusName: string;
}
export interface IEmailOption {
  firstName?: string;
  lastName?: string;
  emailId?: string;
  type?: string;
  id?: string;
}
