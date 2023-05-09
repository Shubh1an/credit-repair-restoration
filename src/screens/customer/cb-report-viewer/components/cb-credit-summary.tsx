import React, { useEffect, useState } from 'react';
import { EnumBureausShorts } from '../../../../models/enums';
import { BureauLogoComponent } from '../../../../shared/components/bureau-logo';

export const CBCreditSummary = (props: any) => {
    const [list, setList] = useState([] as any[]);
    useEffect(() => {
        if (props?.summary) {
            const list = getnormalisedList(props.summary);
            setList(list);
        }
    }, [props?.summary]);
    const getnormalisedList = (summ: any) => {
        let summary = summ?.tradelineSummary;
        let inquirySummary = summ?.inquirySummary;
        let publicRecordSummary = summ?.publicRecordSummary;
        let _creditlist = [];
        if (summary) {
            let expSummary = summary?.experian;
            let eqfSummary = summary?.equifax;
            let tuSummary = summary?.transUnion;
            let creditsumary = {
                creditParam: 'Total Accounts:',
                creditParamValueTU: tuSummary?.totalAccounts,
                creditParamValueEXP: expSummary?.totalAccounts,
                creditParamValueEQF: eqfSummary?.totalAccounts
            };
            _creditlist.push(creditsumary);
            creditsumary = {
                creditParam: 'Open Accounts:',
                creditParamValueTU: tuSummary?.openAccounts,
                creditParamValueEXP: expSummary?.openAccounts,
                creditParamValueEQF: eqfSummary?.openAccounts
            };
            _creditlist.push(creditsumary);
            creditsumary = {
                creditParam: 'Closed Accounts:',
                creditParamValueTU: tuSummary?.closeAccounts,
                creditParamValueEXP: expSummary?.closeAccounts,
                creditParamValueEQF: eqfSummary?.closeAccounts
            };
            _creditlist.push(creditsumary);
            creditsumary = {
                creditParam: 'Delinquent:',
                creditParamValueTU: tuSummary?.delinquentAccounts,
                creditParamValueEXP: expSummary?.delinquentAccounts,
                creditParamValueEQF: eqfSummary?.delinquentAccounts
            };
            _creditlist.push(creditsumary);
            creditsumary = {
                creditParam: 'Derogatory:',
                creditParamValueTU: tuSummary?.derogatoryAccounts,
                creditParamValueEXP: expSummary?.derogatoryAccounts,
                creditParamValueEQF: eqfSummary?.derogatoryAccounts
            };
            _creditlist.push(creditsumary);
            creditsumary = {
                creditParam: 'Collection:',
                creditParamValueTU: '',
                creditParamValueEXP: '',
                creditParamValueEQF: ''
            };
            _creditlist.push(creditsumary);
            creditsumary = {
                creditParam: 'Balances:',
                creditParamValueTU: '$' + (tuSummary?.totalBalances || 0),
                creditParamValueEXP: '$' + (expSummary?.totalBalances || 0),
                creditParamValueEQF: '$' + (eqfSummary?.totalBalances || 0)
            };
            _creditlist.push(creditsumary);
            creditsumary = {
                creditParam: 'Payments:',
                creditParamValueTU: '$' + (tuSummary?.totalMonthlyPayments || 0),
                creditParamValueEXP: '$' + (expSummary?.totalMonthlyPayments || 0),
                creditParamValueEQF: '$' + (eqfSummary?.totalMonthlyPayments || 0)
            };
            _creditlist.push(creditsumary);
            creditsumary = {
                creditParam: 'Public Records:',
                creditParamValueTU: publicRecordSummary?.transUnion?.numberOfRecords,
                creditParamValueEXP: publicRecordSummary?.experian?.numberOfRecords,
                creditParamValueEQF: publicRecordSummary?.equifax?.numberOfRecords
            };
            _creditlist.push(creditsumary);
            creditsumary = {
                creditParam: 'Inquiries(2 years):',
                creditParamValueTU: inquirySummary?.transUnion?.numberInLast2Years,
                creditParamValueEXP: inquirySummary?.experian?.numberInLast2Years,
                creditParamValueEQF: inquirySummary?.equifax?.numberInLast2Years
            };
            _creditlist.push(creditsumary);
        }
        return _creditlist;
    }
    return (
        <div className="clsCreditSummary">
            <div className="headerSection">
                <i className="fa mr-2 fa-line-chart"></i>
                <span>Credit Summary</span>
            </div>
            <div className="DetailsSection">
                <div className="headerDescription">
                    <span>Below is an overview of your present and past credit status including open and closed accounts and balance information.</span>
                </div>
                <table cellSpacing="0" cellPadding="0" id="tblCreditSummary">
                    <tbody>
                        <tr>
                            <th className="class1"></th>
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
                            list?.map(((item: any, index: number) => {
                                return (
                                    <tr key={index} className="clssummaryDataRow">
                                        <td>
                                            <span className="leftHeader">{item?.creditParam}</span>
                                        </td>
                                        <td>
                                            <input type="text" className="creditSummaryTU" disabled={true} value={item?.creditParamValueTU} />
                                        </td>
                                        <td>
                                            <input type="text" className="creditSummaryEXP" disabled={true} value={item?.creditParamValueEXP} />
                                        </td>
                                        <td>
                                            <input type="text" className="creditSummaryEQF" disabled={true} value={item?.creditParamValueEQF} />
                                        </td>
                                    </tr>
                                )
                            }))
                        }

                    </tbody>
                </table>
            </div>
        </div>
    );
}
