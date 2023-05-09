import React, { useState, useEffect, FC } from 'react';
import { useParams } from 'react-router-dom';
import axios, { CancelTokenSource } from 'axios';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Spinner } from 'reactstrap';
// @ts-ignore
import confirm from 'reactstrap-confirm';

import { ICheckboxList } from '../../../../models/interfaces/shared';
import { ReportType, ReportTypesList } from '../import-constants';
import { UploadCreditReport } from './upload-select-file';
import { SearchCustomersComponent } from '../../../../shared/components/search-customers';
import { ICustomerShort } from '../../../../models/interfaces/customer-view';
import { ReportSections } from './report-sections/';
import { ClientRoutesConstants, Messages } from '../../../../shared/constants';
import { UrlUtils } from '../../../../utils/http-url.util';
import { ImporterUtils } from '../../../../utils/importer-utils';
import { IHTMLParserData, IImportAccountHistory, IImportCreditInquiry, IImportCreditScore, IImportCreditSummary, IImporterSaveModel, IImportPersonalDetails, IImportPublicRecords } from '../../../../models/interfaces/importer';
import { ButtonComponent } from '../../../../shared/components/button';
import { getCustomerMinimal } from '../../../../actions/customers.actions';
import AuthService from '../../../../core/services/auth.service';
import { AutoCompleteSearchTypes, EnumBureausShorts } from '../../../../models/enums';
import { importerSave, getS3JSONFileData } from '../../../../actions/importer.actions';
import { ModalComponent } from '../../../../shared/components/modal';
import { RecentS3FilesComponent } from './recent-s3-files';
import { ReportStatsComponent } from './report-stats';
import { setInnerSpinner } from '../../../../shared/actions/shared.actions';


const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getCustomerMinimal,
        importerSave,
        getS3JSONFileData,
        setInnerSpinner
    }, dispatch);
}


export const ImportReportComponent = connect(null, mapDispatchToProps)((props: any) => {


    const params = useParams() as { cid?: string, type?: string };
    const [selectedCustomer, setSelectedCustomer] = useState(null as ICustomerShort | null);
    const [loadingCust, setloadingCust] = useState(false);
    const [uploadControlLoaded, setuploadControlLoaded] = useState(false);
    const [reportType, setreportType] = useState((params?.type ? ReportTypesList?.find(x => x.value === params.type) : ReportTypesList[0]) as ICheckboxList);
    const [showDetails, setShowDetails] = useState(false);
    const [parsedFields, setParsedFields] = useState(null as IHTMLParserData | null);
    const [partnerKey] = useState(UrlUtils.getPartnerKey());
    const [profileData, setProfileData] = useState(null as IImportPersonalDetails | null);
    const [scoreData, setScoreData] = useState(null as IImportCreditScore | null);
    const [summaryData, setSummaryData] = useState(null as IImportCreditSummary[] | null);
    const [historyData, setHistoryData] = useState(null as IImportAccountHistory[] | null);
    const [inquiriesData, setInquiriesData] = useState(null as IImportCreditInquiry[] | null);
    const [inquiryGlobalReason, setinquiryGlobalReason] = useState('' as string);
    const [publicRecordData, setPublicRecordData] = useState(null as IImportPublicRecords[] | null);
    const [showS3FilesList, setShowS3FilesList] = useState(false);
    const [axiosSource, setAxiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);

    useEffect(() => {
        if (params?.cid) {
            loadCustomer();
        }
        return () => {
            if (axiosSource.cancel) {
                axiosSource.cancel(Messages.APIAborted);
            }
        }
    }, [params?.cid]);

    const loadCustomer = () => {
        setloadingCust(true);
        props?.getCustomerMinimal(params?.cid, false, axiosSource)
            .then((res: any) => {
                setloadingCust(false);
                onCustomerSelect(res?.customer);
            }).catch((err: any) => {
                setloadingCust(false);
            })
    }

    useEffect(() => {
        const onMessageReceivedFromIframe = (param: any) => receiveHTMLParserData(selectedCustomer, param);
        window.addEventListener("message", onMessageReceivedFromIframe, false);
        return () => {
            window.removeEventListener("message", onMessageReceivedFromIframe);
            if (axiosSource?.cancel)
                axiosSource?.cancel(Messages.APIAborted);
        }
    }, [selectedCustomer]);
    const receiveHTMLParserData = (cust: ICustomerShort | null, param: any) => {
        if ((param.data as IHTMLParserData)?.isParser) {
            setParsedFields(param?.data);
            showIncorrectCustomerAlert(cust, param?.data?.personalDetails);
        }
    }
    const onFileTypeSelect = (item: ICheckboxList) => {
        setreportType(item);
        setShowS3FilesList(item.value === ReportType.CB || item.value === ReportType.Array);
        setSelectedCustomer(null);
        setShowDetails(false);
    }
    const onCustomerSelect = (data?: ICustomerShort | null) => {
        if (selectedCustomer?.id && selectedCustomer?.id !== data?.id) {
            setShowDetails(false);
        }
        setSelectedCustomer(data ?? null);
        setShowS3FilesList((reportType.value === ReportType.CB || reportType.value === ReportType.Array) && !!data);
    }
    const onIframeLoad = (ev: any) => {
        ev.target.contentDocument.body.style.backgroundColor = 'transparent';
        setTimeout((ee: any) => {
            if (ee?.target?.contentDocument?.getElementById('freshworks-container'))
                ee.target.contentDocument.getElementById('freshworks-container').style.display = 'none';
            setuploadControlLoaded(true);
        }, 500, ev);
    }
    const saveReportData = async () => {
        const payload = createSerialisedObject();
        if (!payload?.CreditCustomerId) {
            showAlertMessage("Please select Client Name", null);
            return;
        }
        const saveQuery = await confirm({
            title: "Save all Data ?",
            message: ("Are you sure that you would like to save all information for accounts, inquiries, and public records listed?"),
            confirmText: 'Yes, Save Data',
            confirmColor: 'primary',
            cancelText: 'Cancel',
            cancelColor: 'link'
        });
        if (!saveQuery) {
            showAlertMessage("Data save aborted successfully!", "Save Aborted!");
            return;
        }
        const reportName = (payload?.Personal?.TUProfile?.Name || payload?.Personal?.EXPProfile?.Name || payload?.Personal?.EQFProfile?.Name)?.trim();
        const iscorrect = reportName ? EnsureCorrectCustomerReport(reportName) : true;


        if (!iscorrect) {
            const result = await confirm({
                title: "Are you sure to save report with different client name?",
                bodyComponent: () => (<>This report is not the selected client to use's report. Selected client is: <b>{selectedCustomer?.fullName}</b> and the report uploaded is for: <b>{reportName}</b> Are you absolutely sure you wish to save data to <b>{selectedCustomer?.fullName}</b>?</>),
                confirmText: 'Yes, Save the Data',
                confirmColor: 'primary',
                cancelText: 'Cancel',
                cancelColor: 'link',
                className: 'import-confirm2'
            });
            if (result) {
                finalSaveData(payload);
            } else {
                showAlertMessage("Data save aborted successfully!", "Save Aborted!");
                return;
            }
        }
        else {
            finalSaveData(payload);
        }

    }
    const finalSaveData = async (payload: any) => {
        const source = axios.CancelToken.source();
        setAxiosSource(source);
        props?.importerSave(payload, source).then((result: { status: boolean, message: string }) => {
            if (result.status) {
                showAlertMessage("Data saved successfully!", "Data Saved!");
            } else {
                showAlertMessage(result.message, "Data Not Saved!", true);
            }
        }).catch(async (err: any) => {
            await confirm({
                title: 'Error!! Data not saved!',
                message: 'Apologies!! There was some error while processing the records! Please try again later.',
                confirmText: "OK",
                confirmColor: "danger",
                cancelText: null
            });
        })
    }
    const showAlertMessage = async (message: string | FC<any>, title: string | null, isError = false) => {
        const config = {
            title,
            confirmText: "OK",
            confirmColor: "primary",
            cancelText: null
        } as any;
        if (isError) {
            config.bodyComponent = () => <div className="text-danger">{message}</div>;
        } else {
            config.message = message;
        }
        await confirm(config);
    }
    const showAlertMessage2 = async (message: FC<any>, title: string | null) => {
        await confirm({
            title,
            confirmText: "OK",
            confirmColor: "primary",
            cancelText: null,
            bodyComponent: message
        });
    }
    const createSerialisedObject = (): IImporterSaveModel => {
        const payload = AuthService.getCurrentJWTPayload();
        return {
            Personal: createProfileObject(),
            CreditScore: createCreditScoreObject(),
            CreditSummary: createCreditSummaryObject(),
            AccountHistory: createAccountHistoryObject(),
            CreditEnquiries: createCreditEnquiriesObject(),
            PublicRecords: createPublicRecordsObject(),
            CreditCustomerId: selectedCustomer?.id,
            SiteId: payload.siteId,
            CurrentLoggedInuser: payload.membershipId,
            ReportType: reportType.value
        };
    }
    const createProfileObject = () => {
        const TUProfile = {
            BuearuName: EnumBureausShorts.TU,
            CreditReportDate: profileData?.crDateTU ?? '',
            Name: profileData?.NameTU ?? '',
            KnownAs: profileData?.KnownAsTU ?? '',
            Former: profileData?.formerTU?.replace(/-/g, '') ?? '',
            DOB: profileData?.DOBTU?.replace(/-/g, '')?.replace(/\s/g, '') ?? '',
            Addresses: MakeAddressString(profileData?.CurrAddressTU) ?? '',
            PrevAddresses: MakeAddressString(profileData?.PrevAddressesTU) ?? '',
            Employers: profileData?.CurrentEmployerTU?.trim() ?? '',
            Comments: '',
            Alert: profileData?.AlertTU ?? ''
        };
        const EXPProfile = {
            BuearuName: EnumBureausShorts.EXP,
            CreditReportDate: profileData?.crDateEXP ?? '',
            Name: profileData?.NameEXP ?? '',
            KnownAs: profileData?.KnownAsEXP ?? '',
            Former: profileData?.formerEXP?.replace(/-/g, '') ?? '',
            DOB: profileData?.DOBEXP?.replace(/-/g, '')?.replace(/\s/g, '') ?? '',
            Addresses: MakeAddressString(profileData?.CurrAddressEXP) ?? '',
            PrevAddresses: MakeAddressString(profileData?.PrevAddressesEXP) ?? '',
            Employers: profileData?.CurrentEmployerEXP?.trim() ?? '',
            Comments: '',
            Alert: profileData?.AlertEXP ?? ''
        };
        const EQFProfile = {
            BuearuName: EnumBureausShorts.EQF,
            CreditReportDate: profileData?.crDateEQF ?? '',
            Name: profileData?.NameEQF ?? '',
            KnownAs: profileData?.KnownAsEQF ?? '',
            Former: profileData?.formerEQF?.replace(/-/g, '') ?? '',
            DOB: profileData?.DOBEQF?.replace(/-/g, '')?.replace(/\s/g, '') ?? '',
            Addresses: MakeAddressString(profileData?.CurrAddressEQF) ?? '',
            PrevAddresses: MakeAddressString(profileData?.PrevAddressesEQF) ?? '',
            Employers: profileData?.CurrentEmployerEQF?.trim() ?? '',
            Comments: '',
            Alert: profileData?.AlertEQF ?? ''
        };
        return { EXPProfile, EQFProfile, TUProfile };
    }
    const MakeAddressString = (addresses?: string[]): string => {
        let str = "";
        addresses?.forEach((add, i) => {
            str += (str == "" ? "" : "anuj") + add;
        });
        return str?.trim();
    }
    const createCreditScoreObject = () => {
        const TUCreditScore = {
            BuearuName: EnumBureausShorts.TU,
            CreditScore: scoreData?.CreditScoreTU ?? '',
            Rank: scoreData?.RankTU?.trim() ?? '',
            ScoreScale: scoreData?.ScoreScaleTU?.trim() ?? ''
        };
        const EXPCreditScore = {
            BuearuName: EnumBureausShorts.EXP ?? '',
            CreditScore: scoreData?.CreditScoreEXP ?? '',
            Rank: scoreData?.RankEXP?.trim() ?? '',
            ScoreScale: scoreData?.ScoreScaleEXP?.trim() ?? ''
        };

        const EQFCreditScore = {
            BuearuName: EnumBureausShorts.EQF,
            CreditScore: scoreData?.CreditScoreEQF ?? '',
            Rank: scoreData?.RankEQF?.trim() ?? '',
            ScoreScale: scoreData?.ScoreScaleEQF?.trim() ?? ''
        };

        return {
            EXPCreditScore,
            EQFCreditScore,
            TUCreditScore
        };
    }
    const createCreditSummaryObject = () => {
        const TUBankModel = {
            BuearuName: EnumBureausShorts.TU,
            TotalAccounts: ImporterUtils.getSummaryFieldValue(summaryData, 'total', EnumBureausShorts.TU) ?? '',
            OpenAccounts: ImporterUtils.getSummaryFieldValue(summaryData, 'open', EnumBureausShorts.TU) ?? '',
            ClosedAccounts: ImporterUtils.getSummaryFieldValue(summaryData, 'closed', EnumBureausShorts.TU) ?? '',
            Delinquent: ImporterUtils.getSummaryFieldValue(summaryData, 'delinquent', EnumBureausShorts.TU) ?? '',
            Derogatory: ImporterUtils.getSummaryFieldValue(summaryData, 'derogatory', EnumBureausShorts.TU) ?? '',
            Collection: ImporterUtils.getSummaryFieldValue(summaryData, 'collection', EnumBureausShorts.TU) ?? '',
            Balances: ImporterUtils.getSummaryFieldValue(summaryData, 'balances', EnumBureausShorts.TU) ?? '',
            Payments: ImporterUtils.getSummaryFieldValue(summaryData, 'payments', EnumBureausShorts.TU) ?? '',
            PublicRecords: ImporterUtils.getSummaryFieldValue(summaryData, 'public', EnumBureausShorts.TU) ?? '',
            InquiriesinLast2Years: ImporterUtils.getSummaryFieldValue(summaryData, 'inquiries', EnumBureausShorts.TU) ?? ''
        };

        const EXPBankModel = {
            BuearuName: EnumBureausShorts.EXP,
            TotalAccounts: ImporterUtils.getSummaryFieldValue(summaryData, 'total', EnumBureausShorts.EXP) ?? '',
            OpenAccounts: ImporterUtils.getSummaryFieldValue(summaryData, 'open', EnumBureausShorts.EXP) ?? '',
            ClosedAccounts: ImporterUtils.getSummaryFieldValue(summaryData, 'closed', EnumBureausShorts.EXP) ?? '',
            Delinquent: ImporterUtils.getSummaryFieldValue(summaryData, 'delinquent', EnumBureausShorts.EXP) ?? '',
            Derogatory: ImporterUtils.getSummaryFieldValue(summaryData, 'derogatory', EnumBureausShorts.EXP) ?? '',
            Collection: ImporterUtils.getSummaryFieldValue(summaryData, 'collection', EnumBureausShorts.EXP) ?? '',
            Balances: ImporterUtils.getSummaryFieldValue(summaryData, 'balances', EnumBureausShorts.EXP) ?? '',
            Payments: ImporterUtils.getSummaryFieldValue(summaryData, 'payments', EnumBureausShorts.EXP) ?? '',
            PublicRecords: ImporterUtils.getSummaryFieldValue(summaryData, 'public', EnumBureausShorts.EXP) ?? '',
            InquiriesinLast2Years: ImporterUtils.getSummaryFieldValue(summaryData, 'inquiries', EnumBureausShorts.EXP) ?? ''
        };

        const EQFBankModel = {
            BuearuName: EnumBureausShorts.EQF,
            TotalAccounts: ImporterUtils.getSummaryFieldValue(summaryData, 'total', EnumBureausShorts.EQF) ?? '',
            OpenAccounts: ImporterUtils.getSummaryFieldValue(summaryData, 'open', EnumBureausShorts.EQF) ?? '',
            ClosedAccounts: ImporterUtils.getSummaryFieldValue(summaryData, 'closed', EnumBureausShorts.EQF) ?? '',
            Delinquent: ImporterUtils.getSummaryFieldValue(summaryData, 'delinquent', EnumBureausShorts.EQF) ?? '',
            Derogatory: ImporterUtils.getSummaryFieldValue(summaryData, 'derogatory', EnumBureausShorts.EQF) ?? '',
            Collection: ImporterUtils.getSummaryFieldValue(summaryData, 'collection', EnumBureausShorts.EQF) ?? '',
            Balances: ImporterUtils.getSummaryFieldValue(summaryData, 'balances', EnumBureausShorts.EQF) ?? '',
            Payments: ImporterUtils.getSummaryFieldValue(summaryData, 'payments', EnumBureausShorts.EQF) ?? '',
            PublicRecords: ImporterUtils.getSummaryFieldValue(summaryData, 'public', EnumBureausShorts.EQF) ?? '',
            InquiriesinLast2Years: ImporterUtils.getSummaryFieldValue(summaryData, 'inquiries', EnumBureausShorts.EQF) ?? ''
        };

        return {
            EXPBankModel,
            EQFBankModel,
            TUBankModel
        };
    }
    const createAccountHistoryObject = () => {
        return historyData?.map((hist, ind) => {
            return {
                EXPBankModel: getHistoryModel(hist, EnumBureausShorts.EXP),
                EQFBankModel: getHistoryModel(hist, EnumBureausShorts.EQF),
                TUBankModel: getHistoryModel(hist, EnumBureausShorts.TU),
                History: create24MonthHistory(hist),
                collectorAddress: hist?.collectorAddress,
                extraFields: hist?.extraFields,
            };
        })

    }
    const getHistoryModel = (history: IImportAccountHistory, bureauShort: string) => {
        const GlabalDispute = history?.globalReason;
        const dispute = (GlabalDispute || ImporterUtils.getHistoryFieldValue(history, 'dispute', bureauShort));
        return {
            BuearuName: bureauShort,
            HistoryName: history?.accountHeader?.replace(/\s+/g, ' ')?.trim(),
            AccountNumber: ImporterUtils.getHistoryFieldValue(history, 'account #', bureauShort),
            AccountName: '',
            AccountType: ImporterUtils.getHistoryFieldValue(history, 'account type', bureauShort),
            GlobalDisputeReason: dispute,
            AccountTypeDetail: ImporterUtils.getHistoryFieldValue(history, 'type - detail', bureauShort),
            BuearuCode: ImporterUtils.getHistoryFieldValue(history, 'bureau', bureauShort),
            AccountStatus: ImporterUtils.getHistoryFieldValue(history, 'account status', bureauShort),
            MonthlyPayment: ImporterUtils.getHistoryFieldValue(history, 'monthly payment', bureauShort).replace(/\$/g, '').replace(/\,/g, '').replace(/-/g, ''),
            DateOpened: ImporterUtils.getHistoryFieldValue(history, 'date opened', bureauShort),
            Balance: ImporterUtils.getHistoryFieldValue(history, 'balance', bureauShort).replace(/\$/g, '').replace(/\,/g, '').replace(/-/g, ''),
            NoofMonth: ImporterUtils.getHistoryFieldValue(history, '(terms)', bureauShort),
            HighCredit: ImporterUtils.getHistoryFieldValue(history, 'high credit', bureauShort).replace(/\,/g, '').replace(/-/g, ''),
            CreditLimit: ImporterUtils.getHistoryFieldValue(history, 'credit limit', bureauShort).replace(/\$/g, '').replace(/\,/g, '').replace(/-/g, ''),
            PastDue: ImporterUtils.getHistoryFieldValue(history, 'past due', bureauShort).replace(/\$/g, '').replace(/\,/g, '').replace(/-/g, ''),
            PaymentStatus: ImporterUtils.getHistoryFieldValue(history, 'payment status', bureauShort),
            LastReported: ImporterUtils.getHistoryFieldValue(history, 'last reported', bureauShort),
            Comments: ImporterUtils.getHistoryFieldValue(history, 'comment', bureauShort),
            lastDateActive: ImporterUtils.getHistoryFieldValue(history, 'date last active', bureauShort),
            lastPaymentDate: ImporterUtils.getHistoryFieldValue(history, 'last payment', bureauShort)
        };
    }
    const create24MonthHistory = (history: IImportAccountHistory) => {
        return {
            MonthsList: history?.MonthNames?.map(x => x?.trim()) ?? [],
            YearsList: history?.Years?.map(x => x?.trim()) ?? [],
            TransUnionList: history?.TransUnions?.map(x => x?.trim()) ?? [],
            ExperiansList: history?.Experians?.map(x => x?.trim()) ?? [],
            EquifaxList: history?.Equifaxs?.map(x => x?.trim()) ?? []
        };
    }
    const createCreditEnquiriesObject = () => {
        return inquiriesData?.map((inq) => {
            return {
                BankName: inq?.BankName ?? '',
                EnquiryType: inq?.CreditType ?? '',
                EnquiryDate: inq?.CreditDate ?? '',
                DoneForTU: inq?.CheckedTU ?? '',
                DoneForEXP: inq?.CheckedEXP ?? '',
                DoneForEQF: inq?.CheckedEQF ?? '',
                GlobalDisputeReason: inquiryGlobalReason ?? ''
            };
        })?.filter((inq) => (inq?.DoneForTU || inq?.DoneForEXP || inq?.DoneForEQF));
    }
    const createPublicRecordsObject = () => {
        return publicRecordData?.map((pub, ind) => {
            return {
                EXPRecord: getPublicModel(pub, EnumBureausShorts.EXP),
                EQFRecord: getPublicModel(pub, EnumBureausShorts.EQF),
                TURecord: getPublicModel(pub, EnumBureausShorts.TU)
            };
        })

    }
    const getPublicModel = (pub: IImportPublicRecords, bureauShort: string) => {
        return {
            BuearuName: bureauShort,
            BankName: pub?.publicRecordHeader?.trim() ?? '',
            Type: ImporterUtils.getPublicFieldValue(pub, 'type', bureauShort),
            Status: ImporterUtils.getPublicFieldValue(pub, 'status', bureauShort),
            DateFiled: ImporterUtils.getPublicFieldValue(pub, 'filed/reported', bureauShort),
            Reference: ImporterUtils.getPublicFieldValue(pub, 'reference', bureauShort),
            ClosingDate: ImporterUtils.getPublicFieldValue(pub, 'closing date', bureauShort),
            Amount: ImporterUtils.getPublicFieldValue(pub, 'asset amount', bureauShort),
            Court: ImporterUtils.getPublicFieldValue(pub, 'court', bureauShort),
            Liability: ImporterUtils.getPublicFieldValue(pub, 'liability', bureauShort),
            ExemptAmount: ImporterUtils.getPublicFieldValue(pub, 'exempt amount', bureauShort),
            Remarks: ImporterUtils.getPublicFieldValue(pub, 'remarks', bureauShort),
            GlobalDisputeReason: pub?.globalReason
        };
    }
    const onS3FileSelect = (data: IHTMLParserData) => {
        if (data?.personalDetails && params?.type === ReportType.CB) {
            data.personalDetails.NameEQF = data.personalDetails.NameTU = data.personalDetails.NameEXP = selectedCustomer?.fullName;
        }
        setParsedFields(data);
        setShowDetails(!!data);
    }
    const showIncorrectCustomerAlert = (cust: ICustomerShort | null, personalDetails: IImportPersonalDetails) => {
        setShowDetails(!!personalDetails);
        const reportName = (personalDetails?.NameEQF || personalDetails?.NameEXP || personalDetails?.NameTU)?.trim();
        if (!!selectedCustomer?.fullName?.trim() && !!reportName && reportName?.toLowerCase() !== selectedCustomer?.fullName?.trim()?.toLowerCase()) {
            const custName = cust?.fullName?.toString();
            showAlertMessage2(() => <>This report may not be the selected client to use report. Selected client is: <b>{custName}</b> and the report uploaded is for:<b>{reportName}</b></>, 'Client details mismatch');
        }
    }
    const EnsureCorrectCustomerReport = (reportName: string): boolean => {
        return selectedCustomer?.fullName?.trim()?.toLowerCase() === reportName?.trim()?.toLowerCase();
    }
    return (
        <div className='import-upload-file '>
            {/* <ImporterFreeTrial cid={selectedCustomer?.id} /> */}
            <div className="row">
                <div className="col-12 col-sm-7">
                    <div className="row">
                        <div className="col-12">
                            <br />
                            <UploadCreditReport selected={reportType} onSelect={onFileTypeSelect} />
                            <br />
                            <div className="form-group form-inline">
                                <h6 className="import-label pr-3 w-100 w-sm-auto">Select Client:</h6>
                                {
                                    loadingCust ? <Spinner size="sm" color="secondary" />
                                        :
                                        <div className="pl-0 pl-sm-5 flex-1">
                                            <SearchCustomersComponent minSearchLength={3}
                                                onChange={(e: any) => !e ? onCustomerSelect(null) : ''}
                                                searchTypes={AutoCompleteSearchTypes.CUSTOMER_LEAD}
                                                onSelectedData={onCustomerSelect} placeholder="search clients ..." defaultValue={selectedCustomer?.fullName} />
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                    {
                        !!selectedCustomer?.fullName && reportType?.value === ReportType.MyIQReport &&
                        <div className="row mb-1 mt-4">
                            <div className="col-12 form-group form-inline">
                                <div className="w-20">
                                    <h6 className="import-label mb-0">Upload Credit Report:</h6>
                                    <span className="f-10">(.html only)</span>
                                </div>
                                <div className={"flex-1 pl-4 pr-2" + (uploadControlLoaded ? '' : 'd-none')}>
                                    <iframe scrolling="no" onLoad={(a: any) => onIframeLoad(a)} src={'/' + partnerKey + ClientRoutesConstants.htmlParser} style={{ border: '0', width: '100%', height: '23px' }}></iframe>
                                </div>
                            </div>
                        </div>
                    }
                </div>
                <div className="col-12 col-sm-5">
                    {
                        !!selectedCustomer?.fullName && showDetails &&
                        <ReportStatsComponent historyData={historyData} inquiriesData={inquiriesData} publicRecordData={publicRecordData} />
                    }
                </div>
            </div>

            {
                showDetails &&
                <>
                    <div className="h-line mt-5 position-relative">
                        <span className="impt-report-label">Client Report</span>
                    </div>
                    <div className="row mt-5">
                        <div className="col-12 col-sm-10">
                            <div className="text-success">
                                The report for <b>{selectedCustomer?.fullName}</b> has been loaded successfully. Click "Save Report Data" button to import entire report, or click discard for any account you do not wish to import.
                            </div>
                        </div>
                        <div className="col-12 col-sm-2 text-right">
                            <ButtonComponent text="Save Report Data" loading={props?.loading} onClick={saveReportData} className="btn-primary shadow rounded " >
                                <i className="fa fa-floppy-o mr-2"></i>
                            </ButtonComponent>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <ReportSections data={parsedFields}
                                onProfileChange={setProfileData}
                                onScoreChange={setScoreData}
                                onSummaryChange={setSummaryData}
                                onHistoryChange={setHistoryData}
                                onInquiriesChange={setInquiriesData}
                                onPublicRecordChange={setPublicRecordData}
                                onGlobalReasonChange={setinquiryGlobalReason}
                                reportType={reportType?.value}
                            />
                        </div>
                    </div>
                </>
            }
            <>
                <ModalComponent title={'Recent S3 Files for ' + selectedCustomer?.fullName} hideClose={true} isVisible={showS3FilesList && !!selectedCustomer?.id} onClose={() => setShowS3FilesList(false)}>
                    {
                        showS3FilesList && !!selectedCustomer?.id &&
                        <RecentS3FilesComponent
                            onSuccess={onS3FileSelect} onClose={() => setShowS3FilesList(false)}
                            cid={selectedCustomer?.id} size={3} fileFolder={''} reportType={(reportType?.value || params?.type) as ReportType} />
                    }
                </ModalComponent>
            </>
        </div>
    );
});
