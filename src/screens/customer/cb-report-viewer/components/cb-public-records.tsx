import React, { Fragment, useEffect, useState } from 'react';
import { EnumBureausShorts } from '../../../../models/enums';
import { BureauLogoComponent } from '../../../../shared/components/bureau-logo';


export const CBPublicRecords = (props: any) => {
    const [list, setList] = useState([] as any[]);
    useEffect(() => {
        if (props?.records) {
            setList(getList());
        }
    }, [props])
    const GetPublicRecordObject = () => {
        var JQPublicRecord = {
            publicRecordHeader: undefined
            , publicRecordSummary: []     //[{ publicRecordParam: "", publicRecordParamValueEQF: "", publicRecordParamValueEXP: "", publicRecordParamValueTU: "" }]
        } as any;

        return JQPublicRecord;
    }
    const getList = () => {
        var _list = [] as any[];
        props?.records?.forEach((item: any, index: number) => {

            let TUHistory = item && item.publicRecord && item.publicRecord.find((x: any) => x.source.bureau.symbol === 'TUC');
            let EXPHistory = item && item.publicRecord && item.publicRecord.find((x: any) => x.source.bureau.symbol === 'EXP');
            let EQFHistory = item && item.publicRecord && item.publicRecord.find((x: any) => x.source.bureau.symbol === 'EQF');

            let JQPublicRecord = GetPublicRecordObject();

            JQPublicRecord.publicRecordHeader = (TUHistory && TUHistory.classification && TUHistory.classification.description)
                || (EXPHistory && EXPHistory.classification && EXPHistory.classification.description)
                || (EQFHistory && EQFHistory.classification && EQFHistory.classification.description);

            JQPublicRecord.publicRecordSummary = [];

            let publicRecordSummary = {
                publicRecordParam: 'Type:',
                publicRecordParamValueEXP: EXPHistory && EXPHistory.type && EXPHistory.type.description,
                publicRecordParamValueTU: TUHistory && TUHistory.type && TUHistory.type.description,
                publicRecordParamValueEQF: EQFHistory && EQFHistory.type && EQFHistory.type.description
            };
            JQPublicRecord.publicRecordSummary.push(publicRecordSummary);

            publicRecordSummary = {
                publicRecordParam: 'Status:',
                publicRecordParamValueEXP: EXPHistory && EXPHistory.status && EXPHistory.status.description,
                publicRecordParamValueTU: TUHistory && TUHistory.status && TUHistory.status.description,
                publicRecordParamValueEQF: EQFHistory && EQFHistory.status && EQFHistory.status.description
            };
            JQPublicRecord.publicRecordSummary.push(publicRecordSummary);

            publicRecordSummary = {
                publicRecordParam: 'Date Filed/Reported:',
                publicRecordParamValueEXP: EXPHistory && getDateInMMDDYYYY(EXPHistory.dateFiled),
                publicRecordParamValueTU: TUHistory && getDateInMMDDYYYY(TUHistory.dateFiled),
                publicRecordParamValueEQF: EQFHistory && getDateInMMDDYYYY(EQFHistory.dateFiled)
            };
            JQPublicRecord.publicRecordSummary.push(publicRecordSummary);

            publicRecordSummary = {
                publicRecordParam: 'Reference#:',
                publicRecordParamValueEXP: EXPHistory && EXPHistory.referenceNumber,
                publicRecordParamValueTU: TUHistory && TUHistory.referenceNumber,
                publicRecordParamValueEQF: EQFHistory && EQFHistory.referenceNumber
            };
            JQPublicRecord.publicRecordSummary.push(publicRecordSummary);

            publicRecordSummary = {
                publicRecordParam: 'Closing Date:',
                publicRecordParamValueEXP: EXPHistory && EXPHistory.bankruptcy && getDateInMMDDYYYY(EXPHistory.bankruptcy.dateResolved),
                publicRecordParamValueTU: TUHistory && TUHistory.bankruptcy && getDateInMMDDYYYY(TUHistory.bankruptcy.dateResolved),
                publicRecordParamValueEQF: EQFHistory && EQFHistory.bankruptcy && getDateInMMDDYYYY(EQFHistory.bankruptcy.dateResolved)
            };
            JQPublicRecord.publicRecordSummary.push(publicRecordSummary);

            publicRecordSummary = {
                publicRecordParam: 'Asset Amount:',
                publicRecordParamValueEXP: EXPHistory && EXPHistory.bankruptcy && EXPHistory.bankruptcy.assetAmount,
                publicRecordParamValueTU: TUHistory && TUHistory.bankruptcy && TUHistory.bankruptcy.assetAmount,
                publicRecordParamValueEQF: EQFHistory && EQFHistory.bankruptcy && EQFHistory.bankruptcy.assetAmount
            };
            JQPublicRecord.publicRecordSummary.push(publicRecordSummary);

            publicRecordSummary = {
                publicRecordParam: 'Court:',
                publicRecordParamValueEXP: EXPHistory && EXPHistory.courtName,
                publicRecordParamValueTU: TUHistory && TUHistory.courtName,
                publicRecordParamValueEQF: EQFHistory && EQFHistory.courtName
            };
            JQPublicRecord.publicRecordSummary.push(publicRecordSummary);

            publicRecordSummary = {
                publicRecordParam: 'Liability:',
                publicRecordParamValueEXP: EXPHistory && EXPHistory.bankruptcy && EXPHistory.bankruptcy.liabilityAmount,
                publicRecordParamValueTU: TUHistory && TUHistory.bankruptcy && TUHistory.bankruptcy.liabilityAmount,
                publicRecordParamValueEQF: EQFHistory && EQFHistory.bankruptcy && EQFHistory.bankruptcy.liabilityAmount
            };
            JQPublicRecord.publicRecordSummary.push(publicRecordSummary);


            publicRecordSummary = {
                publicRecordParam: 'Exempt Amount:',
                publicRecordParamValueEXP: EXPHistory && EXPHistory.bankruptcy && EXPHistory.bankruptcy.exemptAmount,
                publicRecordParamValueTU: TUHistory && TUHistory.bankruptcy && TUHistory.bankruptcy.exemptAmount,
                publicRecordParamValueEQF: EQFHistory && EQFHistory.bankruptcy && EQFHistory.bankruptcy.exemptAmount
            };
            JQPublicRecord.publicRecordSummary.push(publicRecordSummary);

            publicRecordSummary = {
                publicRecordParam: 'Remarks:	',
                publicRecordParamValueEXP: EXPHistory && EXPHistory.remark && EXPHistory.remark.join(", "),
                publicRecordParamValueTU: TUHistory && TUHistory.remark && TUHistory.remark.join(", "),
                publicRecordParamValueEQF: EQFHistory && EQFHistory.remark && EQFHistory.remark.join(", ")
            };
            JQPublicRecord.publicRecordSummary.push(publicRecordSummary);

            _list.push(JQPublicRecord);
        });
        return _list;
    }
    const getDateInMMDDYYYY = (date: string) => {
        if (date && date.indexOf('-') != -1) {
            let arr = date.split('-');
            return (arr[1] + '/' + arr[2] + '/' + arr[0]);
        }
    }
    return (
        <div className="clsPublicRecords">
            <div className="headerSection">
                <i className="fa mr-2 fa-globe"></i>
                <span>Public Records</span>
            </div>
            <div className="DetailsSection">
                <div className="headerDescription">
                    <span>
                        Below is an overview of your public records and can include details of bankruptcy filings, court
                        records, tax liens and other monetary judgments. Public records typically remain on your Credit Report for 7 - 10 years.</span>
                </div>

                <table cellSpacing="0" cellPadding="0" id="tblPublicRecords">
                    <tbody>
                        <tr className="publicrecordsHistoryHeader">
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
                            list?.map((item: any, index: number) => {
                                return (
                                    <Fragment key={index}>
                                        <tr className="clsPublicRecordsMain">
                                            <td colSpan={4} className="clssummaryRowHeader">
                                                {item?.publicRecordHeader}
                                            </td>
                                        </tr>
                                        {
                                            item?.publicRecordSummary?.map((rec: any, ind: number) => <tr key={ind}>
                                                <td>
                                                    <span className="leftHeader">
                                                        {rec?.publicRecordParam}
                                                    </span>
                                                </td>
                                                <td>
                                                    {
                                                        rec?.publicRecordParamValueTU
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        rec?.publicRecordParamValueEXP
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        rec?.publicRecordParamValueEQF
                                                    }
                                                </td>
                                            </tr>)
                                        }
                                    </Fragment>
                                )
                            })
                        }
                    </tbody>
                </table>

            </div>
        </div>
    );

}