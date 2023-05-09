import React, { useState } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';

import { FileUploadButton } from '../../shared/components/file-upload-button';
import { IHTMLParserData, IImportAccountHistory, IImportCreditInquiry, IImportCreditScore, IImportCreditSummary, IImportPersonalDetails, IImportPublicRecords } from '../../models/interfaces/importer';

const mapStateToProps = (state: any) => {
    return {
        totalCustomers: state.dashboardModel?.customerCounts?.customersTotal,
        totalLeads: state.dashboardModel?.customerCounts?.customersQueue,
        franchiseAgents: state.dashboardModel?.franchises?.franchiseAgentsTotal,
        referralAgents: state.dashboardModel?.referrals?.referralAgentsTotal
    };
}

const HTMLReportPrserComponent = (props: any) => {
    const [htmlContent, setHtmlContent] = useState('' as string);
    const [loading, setLoading] = useState(false);

    const UploadFileToServer = async (file: any) => {
        return await new Promise((resolve, reject) => {
            if (file) {
                let reader = new FileReader();
                reader.readAsText(file, "UTF-8");
                reader.onload = (evt: any) => {
                    if (evt.target.result) {
                        // disable all Script,Links,Images
                        let html = evt.target.result.replace(/<script/g, '<dummy').replace(/<link/g, '<dummy').replace(/<img/g, '<dummy');

                        html = html.replace(/\\n/g, '').replace(/\\r/g, '').replace(/\\t/g, '');
                        setHtmlContent(html);
                        const p = CreatePersonalDetailsSection();
                        const cs = CreateCreditScoreSection();
                        const ah = CreateJSONAccountHistory();
                        const ci = CreateJSONCreditEnquiry();
                        const pr = CreateJSONPublicRecord();
                        const csum = CreateJSONCreditSummary();
                        resolve(
                            {
                                personalDetails: p,
                                creditScoreDetails: cs,
                                accountHistory: ah,
                                creditInquiries: ci,
                                publicRecords: pr,
                                creditSummaries: csum
                            });
                        setHtmlContent('');
                    }
                }
                reader.onerror = (evt) => {
                    reject(false);
                    alert("error reading file");
                };
            } else {
                reject(false);
                alert('No file selected.');
            }
        });
    }
    const postValuesToParent = (data: IHTMLParserData) => {
        window.parent.postMessage({ ...data, isParser: true } as IHTMLParserData, "*");
    }
    const CreatePersonalDetailsSection = (): IImportPersonalDetails => {
        const field = {
            CurrAddressTU: [],
            CurrAddressEQF: [],
            CurrAddressEXP: [],
            PrevAddressesEQF: [],
            PrevAddressesEXP: [],
            PrevAddressesTU: []
        } as IImportPersonalDetails;
        let personalDetailTable = $("#tempdiv1 div.rpt_fullReport_header:contains('Personal Information')").nextAll('table:eq(1)');
        personalDetailTable.find('tr').each((i: any, obj1: any) => {
            $(obj1).find("td").each((j: any, obj2: any) => {
                if (j !== 0) {
                    if ((i === 4) && (j === 1 || j === 2 || j === 3)) {// is an former
                        let arrayAddresses = '';
                        $(obj2).find('ng-repeat').each((index: any, elem: any) => {
                            let formerNames = $(elem).find('ng-include').text();
                            arrayAddresses += (arrayAddresses.length ? ',' : '') + formerNames.replace(/ /g, '').trim().replace(/\n/g, '');
                        });
                        if (arrayAddresses) {
                            setFieldValue(field, 'former', arrayAddresses, j);
                        }
                    } else if ((i === 6) && (j === 1 || j === 2 || j === 3)) {// is an current address
                        $(obj2).find('ng-repeat').each((index: any, elem: any) => {
                            let address = $(elem).find('ng-include').text().replace(/[ ]+/g, ' ').replace(/[\s]+/g, ' ').trim();
                            if (j === 1) {
                                field.CurrAddressTU?.push(address);
                            }
                            else if (j === 2) {
                                field.CurrAddressEXP?.push(address);
                            }
                            else if (j === 3) {
                                field.CurrAddressEQF?.push(address);
                            }
                        })
                    } else if ((i === 7) && (j === 1 || j === 2 || j === 3)) {// is an prev address
                        $(obj2).find('ng-repeat').each((index: any, elem: any) => {
                            let address = $(elem).find('ng-include').text().replace(/[ ]+/g, ' ').replace(/[\s]+/g, ' ').trim();
                            if (j === 1) {
                                field.PrevAddressesTU?.push(address);
                            }
                            else if (j === 2) {
                                field.PrevAddressesEXP?.push(address);
                            }
                            else if (j === 3) {
                                field.PrevAddressesEQF?.push(address);
                            }
                        })
                    }
                    else {
                        let replacedtd = $(obj2).text().trim().replace(/\n/g, " ").replace(/\<br\\?>/g, "\n").replace(/[&]nbsp[;]/gi, " ").trim();
                        if (i === 1 || i === 5) { // date
                            replacedtd = replacedtd.replace(/\s/g, '').replace(/[-]/g, ''); // valid date
                        } else if (i === 2) { // name
                            replacedtd = replacedtd.replace(/ /g, '').replace(/-/g, ''); // valid name             
                        } else if (i === 8) { // curr employer
                            replacedtd = replacedtd.trim().replace(/[ ]+/g, ' ').replace(/-/g, '').trim();
                        }
                        replacedtd = replacedtd.replace(/[\s]+/g, ' ');
                        switch (i) {
                            case 1:
                                setFieldValue(field, 'crDate', replacedtd, j);
                                break;
                            case 2:
                                setFieldValue(field, 'Name', replacedtd, j);
                                break;
                            case 3:
                                setFieldValue(field, 'KnownAs', replacedtd, j);
                                break;
                            case 5:
                                setFieldValue(field, 'DOB', replacedtd, j);
                                break;
                            case 8:
                                setFieldValue(field, 'CurrentEmployer', replacedtd, j);
                                break;
                            case 9:
                                setFieldValue(field, 'Alert', replacedtd, j);
                                break;
                            default:
                                break;
                        }
                    }
                }
            });
        });
        return field;
    }
    const setFieldValue = (field: any, fieldName: string, value: string, bureau: number) => {
        if (bureau === 1) { // tu
            field[fieldName + 'TU'] = value;
        }
        else if (bureau === 2) { // exp
            field[fieldName + 'EXP'] = value;
        }
        else if (bureau === 3) { //eqf
            field[fieldName + 'EQF'] = value;
        }
    }
    const CreateCreditScoreSection = (): IImportCreditScore => {
        const field = {} as IImportCreditScore;
        let creditScoreTable = $("#tempdiv1").find("div#CreditScore").parents(':first').find('table').has('th.headerTUC');
        creditScoreTable.find("tr").each((k, object1) => {
            $(object1).find("td").each((l, object2) => {
                let newtdText = $.trim($(object2).text());
                if (k === 1) {
                    setFieldValue(field, 'CreditScore', newtdText, l);
                } else if (k === 2) {
                    setFieldValue(field, 'Rank', newtdText, l);
                } else if (k === 3) {
                    setFieldValue(field, 'ScoreScale', newtdText, l);
                }
            });
        });
        return field;
    }
    const CreateJSONAccountHistory = (): IImportAccountHistory[] => {
        const _list = [] as IImportAccountHistory[];
        let ngRepeats = $("#tempdiv1").find("div#AccountHistory").parents(':first').find('address-history>div>ng-repeat');
        ngRepeats.each((index, elem) => {

            const JQAccount = GetAccountObject() as IImportAccountHistory;

            JQAccount.accountHeader = $(elem).find('div.sub_header')?.text()?.replace(/\s+/g, ' ')?.trim();

            $(elem).find('div.sub_header').parents(':first').find('table').children("tbody").children("tr").each((i, object1) => {
                if (i !== 0) {
                    const sumary = {
                        accountParam: $.trim($(object1).children("td:eq(0),th:eq(0)").text()),
                        accountParamValueTU: $.trim($(object1).children("td:eq(1),th:eq(1)").text().replace(/\s+/g, ' ')),
                        accountParamValueEXP: $.trim($(object1).children("td:eq(2),th:eq(2)").text().replace(/\s+/g, ' ')),
                        accountParamValueEQF: $.trim($(object1).children("td:eq(3),th:eq(3)").text().replace(/\s+/g, ' '))
                    };
                    JQAccount.Summary.push(sumary);
                    if (sumary.accountParam === ("Account Type:")) {/// insert an extra Global Dispute Reason
                        const sumary = {
                            accountParam: "Dispute Reason:",
                            accountParamValueEQF: "",
                            accountParamValueEXP: "",
                            accountParamValueTU: ""
                        };
                        JQAccount.Summary.push(sumary);
                    }
                }
            });
            $(elem).find('table.addr_hsrty').children("tbody").children("tr").each((ind, obj4) => {
                if (ind === 0) {
                    JQAccount.MonthNames = GetNextTDsText(obj4);
                } else if (ind === 1) {
                    JQAccount.Years = GetNextTDsText(obj4);
                } else if (ind === 2) {
                    JQAccount.TransUnions = GetNextTDsText(obj4);
                } else if (ind === 3) {
                    JQAccount.Experians = GetNextTDsText(obj4);
                } else if (ind === 4) {
                    JQAccount.Equifaxs = GetNextTDsText(obj4);
                }
            });
            _list.push(JQAccount);
        });
        return _list;
    }
    const GetAccountObject = () => {
        let JQAccountSummary = {
            accountHeader: ''
            , Summary: []
            , MonthNames: []
            , Years: []
            , Experians: []
            , Equifaxs: []
            , TransUnions: []
        } as IImportAccountHistory;

        return JQAccountSummary;
    }
    const GetNextTDsText = (trHTML: any) => {
        return $(trHTML).find('td').not(':first').map((tdIndex, tdHTML) => {
            return $(tdHTML).text().trim();
        }).toArray();
    }
    const CreateJSONCreditEnquiry = (): IImportCreditInquiry[] => {
        // draw JSON structure before using JSRender to create HTML from
        const _list = [] as IImportCreditInquiry[];
        $("#Inquiries table.rpt_content_contacts tr:first").remove();
        const $Table = $("#Inquiries table.rpt_content_contacts");

        $Table.children("tbody").children("tr").each((i, object1) => {
            let JQCreditEnquiry = GetCreditEnquiryObject();
            JQCreditEnquiry.BankName = $.trim($(object1).children("td:eq(0)").text().replace(/\s+/g, ' '));
            JQCreditEnquiry.CreditType = $.trim($(object1).children("td:eq(1)").text().replace(/\s+/g, ' '));
            JQCreditEnquiry.CreditDate = $.trim($(object1).children("td:eq(2)").text().replace(/\s+/g, ' '));

            let lastTdText = $(object1).children("td:last").text().replace(/\s+/g, ' ').trim().toLowerCase();

            JQCreditEnquiry.CheckedTU = lastTdText === 'transunion';
            JQCreditEnquiry.CheckedEXP = lastTdText === 'experian';
            JQCreditEnquiry.CheckedEQF = lastTdText === 'equifax';

            _list.push(JQCreditEnquiry);
        });

        $Table.remove();
        return _list;
    }
    const GetCreditEnquiryObject = () => {
        const JQCreditEnquiry = {
            BankName: ''
            , CheckedEXP: false
            , CheckedEQF: false
            , CheckedTU: false
            , CreditType: ''
            , CreditDate: ''
        };
        return JQCreditEnquiry;
    }
    const CreateJSONPublicRecord = (): IImportPublicRecords[] => {
        // draw JSON structure before using JSRender to create HTML from
        const _publicRecordlist = [] as IImportPublicRecords[];
        const $Table = $("#PublicInformation>ng[ng-repeat]");
        $Table.each(function (inn, div) {
            $(div).children("div:not(.ng-hide)").each(function (i, object1) {
                let JQPublicRecord = GetPublicRecordObject();
                JQPublicRecord.publicRecordHeader = $.trim($(object1).find(".sub_header").text().replace(/\s+/g, ' '));
                JQPublicRecord.publicRecordSummary = [];
                $(object1).children('table').children("tbody").children("tr").not(':first').each(function (index, tr) {
                    const publicRecordSummary = {
                        publicRecordParam: $.trim($(tr).find("td:eq(0)").text()),
                        publicRecordParamValueEXP: $.trim($(tr).find("td:eq(2)").text().replace(/\s+/g, ' ')),
                        publicRecordParamValueTU: $.trim($(tr).find("td:eq(1)").text().replace(/\s+/g, ' ')),
                        publicRecordParamValueEQF: $.trim($(tr).find("td:eq(3)").text().replace(/\s+/g, ' '))
                    };
                    JQPublicRecord.publicRecordSummary.push(publicRecordSummary);
                });
                _publicRecordlist.push(JQPublicRecord);
            });
        })
        $Table.remove();
        return _publicRecordlist;
    }
    const GetPublicRecordObject = (): IImportPublicRecords => {
        return { publicRecordHeader: '', publicRecordSummary: [] };
    }
    const CreateJSONCreditSummary = (): IImportCreditSummary[] => {
        // draw JSON structure before using JSRender to create HTML from
        const _creditlist = [] as IImportCreditSummary[];
        const $CreditTable = $("#tempdiv1").find("div#Summary").parents(':first').find('table').has('th.headerTUC');
        $CreditTable.children("tbody").children("tr").not(':first').each((i, object1) => {
            const creditsumary = {
                creditParam: $.trim($(object1).find("td:eq(0),th:eq(0)").text()),
                creditParamValueTU: $.trim($(object1).find("td:eq(1),th:eq(1)").text()),
                creditParamValueEXP: $.trim($(object1).find("td:eq(2),th:eq(2)").text()),
                creditParamValueEQF: $.trim($(object1).find("td:eq(3),th:eq(3)").text())
            };
            _creditlist.push(creditsumary);
        });
        $CreditTable.remove();
        return _creditlist;
    }
    const onFileUploadChange = async (e: any) => {
        if (e?.length) {
            setLoading(true);
            UploadFileToServer(e[0]).then((result: any) => {
                setLoading(false);
                postValuesToParent(result);
            }).catch(x => {
                setLoading(false);
            });
        }
    }
    const onFileClear = () => {
        window.parent.postMessage({ isParser: true } as IHTMLParserData, "*");
    }
    return (
        <div className="report-parser">
            <FileUploadButton onChange={onFileUploadChange} label="Choose File" onClose={onFileClear} />
            <div id="tempdiv1" className="d-none" dangerouslySetInnerHTML={{ __html: htmlContent }}>
            </div>
        </div>
    );
}

export default connect(mapStateToProps)(HTMLReportPrserComponent);