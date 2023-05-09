import React, { useEffect, useState } from 'react';
import { EnumBureausShorts } from '../../../../models/enums';
import { BureauLogoComponent } from '../../../../shared/components/bureau-logo';


export const CBAccountHistory = (props: any) => {
    const [records, setRecords] = useState([] as any[]);
    useEffect(() => {
        if (props?.history) {
            const list = getList(props.history);
            setRecords(list);
        }
    }, [props?.history]);

    const getList = (history: any[]) => {
        let list: any[] = [];
        history?.forEach((item, index) => {
            let JQAccount = GetAccountObject();

            let TUHistory = item.tradeline && item.tradeline.find((x: any) => x.source.bureau.symbol === 'TUC');
            let EXPHistory = item.tradeline && item.tradeline.find((x: any) => x.source.bureau.symbol === 'EXP');
            let EQFHistory = item.tradeline && item.tradeline.find((x: any) => x.source.bureau.symbol === 'EQF');

            JQAccount.accountHeader = (TUHistory && TUHistory.creditorName) || (EXPHistory && EXPHistory.creditorName)
                || (EQFHistory && EQFHistory.creditorName);


            // START adding all fields for account history
            let sumary: any = getParam('', '', '', ''); // problem tacking row

            sumary = getParam('Account #', TUHistory && TUHistory.accountNumber, EXPHistory && EXPHistory.accountNumber, EQFHistory && EQFHistory.accountNumber);
            JQAccount.Summary.push(sumary);

            //sumary = getParam('Account Name', TUHistory && TUHistory.creditorName, EXPHistory && EXPHistory.creditorName, EQFHistory && EQFHistory.creditorName);
            //JQAccount.Summary.push(sumary);

            sumary = getParam('Account Type:', TUHistory && TUHistory.grantedTrade.accountType.description, EXPHistory && EXPHistory.grantedTrade.accountType.description, EQFHistory && EQFHistory.grantedTrade.accountType.description);
            JQAccount.Summary.push(sumary);

            sumary = getParam('Dispute Reason:', '', '', '');
            JQAccount.Summary.push(sumary);

            sumary = getParam('Account Type - Detail:', TUHistory && TUHistory.grantedTrade.creditType.description, EXPHistory && EXPHistory.grantedTrade.creditType.description, EQFHistory && EQFHistory.grantedTrade.creditType.description);
            JQAccount.Summary.push(sumary);

            sumary = getParam('Bureau Code:', TUHistory && TUHistory.accountDesignator.description, EXPHistory && EXPHistory.accountDesignator.description, EQFHistory && EQFHistory.accountDesignator.description);
            JQAccount.Summary.push(sumary);

            sumary = getParam('Account Status:', TUHistory && TUHistory.openClosed.description, EXPHistory && EXPHistory.openClosed.description, EQFHistory && EQFHistory.openClosed.description);
            JQAccount.Summary.push(sumary);

            sumary = getParam('Monthly Payment:', TUHistory && TUHistory.grantedTrade.monthlyPayment, EXPHistory && EXPHistory.grantedTrade.monthlyPayment, EQFHistory && EQFHistory.grantedTrade.monthlyPayment);
            JQAccount.Summary.push(sumary);

            sumary = getParam('Date Opened:', TUHistory && getDateInMMDDYYYY(TUHistory.dateOpened), EXPHistory && getDateInMMDDYYYY(EXPHistory.dateOpened), EQFHistory && getDateInMMDDYYYY(EQFHistory.dateOpened));
            JQAccount.Summary.push(sumary);

            sumary = getParam('Balance:', '$' + (TUHistory && TUHistory.currentBalance || '0'), '$' + (EXPHistory && EXPHistory.currentBalance || '0'), '$' + (EQFHistory && EQFHistory.currentBalance || '0'));
            JQAccount.Summary.push(sumary);

            sumary = getParam('No. of Months (terms):', TUHistory && TUHistory.grantedTrade.termMonths, EXPHistory && EXPHistory.grantedTrade.termMonths, EQFHistory && EQFHistory.grantedTrade.termMonths);
            JQAccount.Summary.push(sumary);

            sumary = getParam('High Credit:', '$' + (TUHistory && TUHistory.highBalance || '0'), '$' + (EXPHistory && EXPHistory.highBalance || '0'), '$' + (EQFHistory && EQFHistory.highBalance || '0'));
            JQAccount.Summary.push(sumary);


            sumary = getParam('Credit Limit:', TUHistory && TUHistory.grantedTrade.creditLimit, EXPHistory && EXPHistory.grantedTrade.creditLimit, EQFHistory && EQFHistory.grantedTrade.creditLimit);
            JQAccount.Summary.push(sumary);

            sumary = getParam('Past Due:', '$' + (TUHistory && TUHistory.grantedTrade.amountPastDue || '0'), '$' + (EXPHistory && EXPHistory.grantedTrade.amountPastDue || '0'), '$' + (EQFHistory && EQFHistory.grantedTrade.amountPastDue || '0'));
            JQAccount.Summary.push(sumary);

            sumary = getParam('Payment Status:', TUHistory && TUHistory.payStatus.description, EXPHistory && EXPHistory.payStatus.description, EQFHistory && EQFHistory.payStatus.description);
            JQAccount.Summary.push(sumary);

            sumary = getParam('Last Reported:', TUHistory && getDateInMMDDYYYY(TUHistory.dateReported), EXPHistory && getDateInMMDDYYYY(EXPHistory.dateReported), EQFHistory && getDateInMMDDYYYY(EQFHistory.dateReported));
            JQAccount.Summary.push(sumary);

            sumary = getParam('Comments:', TUHistory && getComments(TUHistory.remark), EXPHistory && getComments(EXPHistory.remark), EQFHistory && getComments(EQFHistory.remark));
            JQAccount.Summary.push(sumary);

            sumary = getParam('Date Last Active:', TUHistory && getDateInMMDDYYYY(TUHistory.dateAccountStatus), EXPHistory && getDateInMMDDYYYY(EXPHistory.dateAccountStatus), EQFHistory && getDateInMMDDYYYY(EQFHistory.dateAccountStatus));
            JQAccount.Summary.push(sumary);

            sumary = getParam('Date of Last Payment:', TUHistory && getDateInMMDDYYYY(TUHistory.grantedTrade.dateLastPayment), EXPHistory && getDateInMMDDYYYY(EXPHistory.grantedTrade.dateLastPayment), EQFHistory && getDateInMMDDYYYY(EQFHistory.grantedTrade.dateLastPayment));
            JQAccount.Summary.push(sumary);

            list.push(JQAccount);
        });
        return list;
    }
    const GetAccountObject = () => {
        var JQAccountSummary: any = {
            accountHeader: undefined
            , Summary: []     //[{ accountParam: "", accountParamValueEQF: "", accountParamValueEXP: "", accountParamValueTU: "" }]
            , MonthNames: []  //[{ MonthName: "" }],
            , Years: []       //[{ Year: "" }]
            , Experians: []   //[{ EXPs: "" }]
            , Equifaxs: []    // [{ EQFs: "" }]
            , TransUnions: [] //[{ TUs: "" }]
        };

        return JQAccountSummary;
    }
    const getDateInMMDDYYYY = (date: string) => {
        if (date && date.indexOf('-') != -1) {
            let arr = date.split('-');
            return (arr[1] + '/' + arr[2] + '/' + arr[0]);
        }
    }
    const getParam = (text: any, tu: any, exp: any, eqf: any): any => {
        return {
            accountParam: text,
            accountParamValueTU: tu,
            accountParamValueEXP: exp,
            accountParamValueEQF: eqf
        };
    }
    const getComments = (list: any[]) => {
        return list?.map((x: any) => x?.remarkCode?.description)?.join(', ');
    }
    return (
        <div className="clsAccountHistory">
            <div className="headerSection">
                <i className="fa mr-2 fa-history"></i>
                <span>Account History</span>
            </div>
            <div className="DetailsSection">
                <div className="headerDescription">
                    <span>Information on accounts you have opened in the past is displayed below.</span>
                </div>
                {
                    records?.map((rec: any, index: number) => {
                        return (
                            <div key={index} className="clsAccountHistoryMain">
                                <div className="clssummaryRowHeader bold accountHistorySinglerow">
                                    {
                                        rec?.accountHeader
                                    }
                                </div>
                                <table cellSpacing="0" cellPadding="0" className="tblAccountHistory">
                                    <tbody>
                                        <tr className="accountHistoryHeader">
                                            <th className="class1">   </th>
                                            <th className="classTH3">
                                                <BureauLogoComponent type={EnumBureausShorts.TU} size={'md'} />
                                            </th>
                                            <th className="classTH1">
                                                <BureauLogoComponent type={EnumBureausShorts.EXP} size={'md'} />
                                            </th>
                                            <th className="classTH2">
                                                <BureauLogoComponent type={EnumBureausShorts.EQF} size={'md'} />
                                            </th>
                                        </tr>
                                        {
                                            rec?.Summary?.map((item: any, ind: number) => {
                                                return (
                                                    <tr key={ind}>
                                                        <td>
                                                            <span className="leftHeader">
                                                                {item?.accountParam}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {item?.accountParamValueTU}
                                                        </td>
                                                        <td>
                                                            {item?.accountParamValueEXP}
                                                        </td>
                                                        <td>
                                                            {item?.accountParamValueEQF}
                                                        </td>
                                                    </tr>

                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>

                        )
                    })
                }
            </div>
        </div>
    );
}