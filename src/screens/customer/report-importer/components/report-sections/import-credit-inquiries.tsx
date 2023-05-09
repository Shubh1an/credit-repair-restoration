import React, { Fragment, useEffect, useState } from 'react';
import { CollectionEntryTypes, EnumBureausShorts } from '../../../../../models/enums';

import { IHTMLParserData, IImportCreditInquiry } from '../../../../../models/interfaces/importer';
import { BureauLogoComponent } from '../../../../../shared/components/bureau-logo';
import { Checkbox } from '../../../../../shared/components/checkbox';
import { SearchCollectionEntries } from '../../../../../shared/components/search-collection-entries';


export const ImportCreditInquiriesComponent = (props: { data: IHTMLParserData | null, onChange: any, onGlobalReasonChange: any }) => {
    const [formData, setformData] = useState(props?.data?.creditInquiries as IImportCreditInquiry[] || []);
    const [globalReason, setGlobalReason] = useState('' as string);
    const [checkAll, setCheckAll] = useState(false);

    useEffect(() => {
        setformData(props?.data?.creditInquiries || []);
        if (props?.onChange && props?.data?.creditInquiries) {
            props?.onChange(props?.data?.creditInquiries || []);
        }
        setCheckAll(false);
    }, [props?.data]);

    const onReasonChange = (value: any) => {
        setGlobalReason(value);
        props?.onGlobalReasonChange(value?.name);
    }
    const onChkChange = (value: any, index: number, bureau: string) => {
        const accounts = (JSON.parse(JSON.stringify(formData)) as IImportCreditInquiry[]);
        const acc = accounts[index];
        const newRowData = {
            ...acc,
            ['Checked' + bureau]: value?.checked
        } as IImportCreditInquiry;
        accounts.splice(index, 1, newRowData);
        setformData(accounts);
        if (props?.onChange) {
            props?.onChange(accounts);
        }
    }
    const onCheckAll = (value: any) => {
        setCheckAll(value?.checked);
        let accounts = (JSON.parse(JSON.stringify(formData)) as IImportCreditInquiry[]);
        accounts = accounts?.map((item, index) => ({
            ...item,
            CheckedEQF: value?.checked,
            CheckedEXP: value?.checked,
            CheckedTU: value?.checked,
        }));
        setformData(accounts);
        if (props?.onChange) {
            props?.onChange(accounts);
        }
    }
    return (
        <div className="credit-inquiries">
            <div className="row">
                <div className="col-12 col-sm-3 pl-4">
                    <Checkbox checked={checkAll} onChange={onCheckAll} text="Check Inquiries" />
                </div>
                <div className="col-3 d-block d-sm-none"></div>
                <div className="col-3 tu-head">
                    <BureauLogoComponent type={EnumBureausShorts.TU} size={'md'} />
                </div>
                <div className="col-3 exp-head">
                    <BureauLogoComponent type={EnumBureausShorts.EXP} size={'md'} />
                </div>
                <div className="col-3 eq-head">
                    <BureauLogoComponent type={EnumBureausShorts.EQF} size={'md'} />
                </div>
            </div>
            <div className="row mb-1">
                <div className="col-3 text-right d-flex align-items-start justify-content-end f-13 pt-2">
                    Global Dispute Reason:
                </div>
                <div className="col-9">
                    <SearchCollectionEntries isTextArea={true} type={CollectionEntryTypes.Reason} onChange={(e: any) => onReasonChange(e)} placeholder="Type to search..." />
                </div>
            </div>
            <table cellSpacing="0" cellPadding="0" id="tblCreditEnquiries">
                <tbody>
                    {
                        formData?.map((x, i) => (
                            <Fragment key={i}>
                                <tr className="clsCreditEnquiriesMain">
                                    <td className="clssummaryRowHeader">{x?.BankName}</td>
                                    <td rowSpan={3} align="center">
                                        <Checkbox
                                            value={x?.CheckedTU?.toString()}
                                            checked={x?.CheckedTU}
                                            onChange={e => onChkChange(e, i, 'TU')} />
                                    </td>
                                    <td rowSpan={3} align="center">
                                        <Checkbox
                                            value={x?.CheckedEXP?.toString()}
                                            checked={x?.CheckedEXP}
                                            onChange={e => onChkChange(e, i, 'EXP')} />
                                    </td>
                                    <td rowSpan={3} align="center">
                                        <Checkbox
                                            value={x?.CheckedEQF?.toString()}
                                            checked={x?.CheckedEQF}
                                            onChange={e => onChkChange(e, i, 'EQF')} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className="leftHeader">{x?.CreditType}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className="leftHeader">{x?.CreditDate}</span>
                                    </td>
                                </tr>
                            </Fragment>
                        ))
                    }

                </tbody>

            </table>
        </div>
    );

}