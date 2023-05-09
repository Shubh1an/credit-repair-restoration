import { ICheckboxList } from "../../../models/interfaces/shared";
import { IImportSection } from '../../../models/interfaces/importer';
import { ImportPersonaldetailsComponent } from "./components/report-sections/import-personal-details";
import { ImportCreditScoreComponent } from "./components/report-sections/import-credit-score";
import { ImportCreditSummaryComponent } from "./components/report-sections/import-credit-summary";
import { ImportAccountHistoryComponent } from "./components/report-sections/import-account-history";
import { ImportCreditInquiriesComponent } from "./components/report-sections/import-credit-inquiries";
import { ImportPublicRecordsComponent } from "./components/report-sections/import-public-records";

export enum ReportType {
    MyIQReport = 'MyIQReport',
    CB = 'CB',
    Array = 'Array'
};
export enum EnumImportSection {
    Personal = 'Personal',
    CreditScore = 'CreditScore',
    AccountHistory = 'AccountHistory',
    CreditSummary = 'CreditSummary',
    CreditInquiry = 'CreditInquiry',
    PublicRecords = 'PublicRecords'
};
export const ReportTypesList: ICheckboxList[] = [
    {
        text: 'Identity IQ',
        value: ReportType.MyIQReport,
    },
    {
        text: 'CreditBliss Report',
        value: ReportType.CB,
    },
    {
        text: 'ID Theft Defender',
        value: ReportType.Array,
    }
];

export const ImporterSections: IImportSection[] = [
    {
        component: ImportPersonaldetailsComponent,
        title: 'Personal Profile',
        iconClass: '',
        key: EnumImportSection.Personal,
        subTitle: 'Below is your personal information as it appears in your credit file. This information includes your legel name, current and previous addresses, employement information and other details.'
    },
    {
        component: ImportCreditScoreComponent,
        title: 'Credit Score',
        iconClass: '',
        key: EnumImportSection.CreditScore,
        subTitle: 'Your Credit Score is a representation of your overall credit health. Most lenders utilize some form of credit scoring to help determine your credit worthiness.'
    },
    {
        component: ImportCreditSummaryComponent,
        title: 'Credit Summary',
        iconClass: '',
        key: EnumImportSection.CreditSummary,
        subTitle: 'Below is an overview of your present and past credit status including open and closed accounts and balance information.'
    },
    {
        component: ImportAccountHistoryComponent,
        title: 'Account History',
        iconClass: '',
        key: EnumImportSection.AccountHistory,
        subTitle: 'Information on accounts you have opened in the past is displayed below.'
    },
    {
        component: ImportCreditInquiriesComponent,
        title: 'Credit Inquiries',
        iconClass: '',
        key: EnumImportSection.CreditInquiry,
        subTitle: 'Below are the names of people and/or organizations who have obtained a copy of your Credit Report. Inquiries such as these can remain on your credit file for up to two years.'
    },
    {
        component: ImportPublicRecordsComponent,
        title: 'Public Records',
        iconClass: '',
        key: EnumImportSection.PublicRecords,
        subTitle: 'Below is an overview of your public records and can include details of bankruptcy filings, court records, tax liens and other monetary judgments. Public records typically remain on your Credit Report for 7 - 10 years.'
    }
];