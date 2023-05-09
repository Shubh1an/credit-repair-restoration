import { FC } from "react";
import { EnumImportSection, ReportType } from "../../screens/customer/report-importer/import-constants";
import { ICollectorAddress } from "./fast-edit-accounts";
import { IDropdown } from "./shared";

export interface IImportSection {
    component: FC<{ onChange: any, data: IHTMLParserData | null, onGlobalReasonChange: any, reportType: ReportType }>;
    title: string;
    subTitle: string;
    iconClass?: string;
    key: EnumImportSection;
}

export interface IImportPersonalDetails {
    crDateTU?: string;
    crDateEXP?: string;
    crDateEQF?: string;
    NameTU?: string;
    NameEXP?: string;
    NameEQF?: string;
    KnownAsTU?: string;
    KnownAsEXP?: string;
    KnownAsEQF?: string;
    formerTU?: string;
    formerEXP?: string;
    formerEQF?: string;
    DOBTU?: string;
    DOBEXP?: string;
    DOBEQF?: string;
    CurrAddressTU?: string[];
    CurrAddressEXP?: string[];
    CurrAddressEQF?: string[];
    PrevAddressesTU?: string[];
    PrevAddressesEXP?: string[];
    PrevAddressesEQF?: string[];
    CurrentEmployerTU?: string;
    CurrentEmployerEXP?: string;
    CurrentEmployerEQF?: string;
    AlertTU?: string;
    AlertEXP?: string;
    AlertEQF?: string;
}
export interface IImportCreditScore {
    CreditScoreTU?: string;
    CreditScoreEXP?: string;
    CreditScoreEQF?: string;
    RankTU?: string;
    RankEXP?: string;
    RankEQF?: string;
    ScoreScaleTU?: string;
    ScoreScaleEXP?: string;
    ScoreScaleEQF?: string;
}
export interface IImportAccountHistory {
    accountHeader?: string;
    Summary: ISummary[];
    MonthNames: string[];
    Years: string[];
    Experians: string[];
    Equifaxs: string[];
    TransUnions: string[];
    globalReason?: string | IDropdown;
    checked?: boolean;
    collectorAddress?: ICollectorAddress;
    extraFields?: IAccountsExtraFields;
}

export interface IAccountsExtraFields {
    isChargeoffIndicator?: boolean;
    isClosedIndicator?: boolean;
    isCollectionIndicator?: boolean;
    isMortgageIndicator?: boolean;
    isDerogatoryDataIndicator?: boolean;
}
export interface ISummary {
    accountParam?: string;
    accountParamValueEQF?: string;
    accountParamValueEXP?: string;
    accountParamValueTU?: string;
}
export interface IImportCreditInquiry {
    BankName?: string;
    CheckedEXP?: boolean;
    CheckedEQF?: boolean;
    CheckedTU?: boolean;
    CreditType?: string;
    CreditDate?: string;
    InqueryDate?: Date;
}
export interface IImportPublicRecords {
    publicRecordHeader: string;
    publicRecordSummary: IPublicRecordSummary[];
    globalReason?: string;
}
export interface IPublicRecordSummary {
    publicRecordParam: string,
    publicRecordParamValueEQF: string,
    publicRecordParamValueEXP: string,
    publicRecordParamValueTU: string
}

export interface IImportCreditSummary {
    creditParam?: string;
    creditParamValueTU?: string;
    creditParamValueEXP?: string;
    creditParamValueEQF?: string;
}
export interface IHTMLParserData {
    isParser?: boolean;
    personalDetails?: IImportPersonalDetails;
    creditScoreDetails?: IImportCreditScore;
    accountHistory?: IImportAccountHistory[];
    creditInquiries?: IImportCreditInquiry[];
    creditSummaries?: IImportCreditSummary[];
    publicRecords?: IImportPublicRecords[];
}
export interface IImporterSaveModel {
    Personal?: any;
    CreditScore: any;
    CreditSummary: any;
    AccountHistory: any;
    CreditEnquiries: any;
    PublicRecords: any;
    CreditCustomerId?: string;
    SiteId: string;
    CurrentLoggedInuser: string;
    ReportType: string;
}

export interface IImportReportStats {
    numexpinquiriestoimport: number;
    numeqfinquiriestoimport: number;
    numtuinquiriestoimport: number;
    numexpaccountstoimport: number;
    numeqfaccountstoimport: number;
    numtuaccountstoimport: number;
    numexppubrecstoimport: number;
    numeqfpubrecstoimport: number;
    numtupubrecstoimport: number;
    numexpneg: number;
    numeqfneg: number;
    numtuneg: number;
    numexpquest: number;
    numeqfquest: number;
    numtuquest: number;
}