import React, { useEffect, useState } from 'react';
// @ts-ignore
import confirm from 'reactstrap-confirm';

import { CollectionEntryTypes, EnumBureausShorts, EnumComponentMode, EnumControlTypes } from '../../../../../models/enums';
import { IHTMLParserData, IImportPublicRecords } from '../../../../../models/interfaces/importer';
import { BureauLogoComponent } from '../../../../../shared/components/bureau-logo';
import { FEAccountField } from '../../../../../shared/components/fe-account-field';
import { SearchCollectionEntries } from '../../../../../shared/components/search-collection-entries';


export const ImportPublicRecordsComponent = (props: { data: IHTMLParserData | null, onChange: any }) => {
    const [formData, setformData] = useState(props?.data?.publicRecords as IImportPublicRecords[] || []);

    useEffect(() => {
        setformData(props?.data?.publicRecords || []);
        if (props?.onChange && props?.data?.publicRecords) {
            props?.onChange(props?.data?.publicRecords || []);
        }
    }, [props?.data]);

    const deleteAccount = async (index: number) => {
        let result = await confirm({
            title: 'Discard Account',
            message: "Are you sure you want to discard this Account?",
            confirmText: "YES",
            confirmColor: "danger",
            cancelColor: "link text-secondary"
        });
        if (result) {
            const accounts = (JSON.parse(JSON.stringify(formData)) as IImportPublicRecords[]);
            accounts.splice(index, 1);
            setformData(accounts);
            if (props?.onChange) {
                props?.onChange(accounts);
            }
        }
    }
    const onReasonChange = (value: any, index: number) => {
        const accounts = (JSON.parse(JSON.stringify(formData)) as IImportPublicRecords[]);
        const acc = accounts[index];
        const newRowData = {
            ...acc,
            globalReason: value?.name
        } as IImportPublicRecords;
        accounts.splice(index, 1, newRowData);
        setformData(accounts);
        if (props?.onChange) {
            props?.onChange(accounts);
        }
    }
    const onFieldChange = (fieldName: string, value: any, i: number, j: number) => {
        const accounts = (JSON.parse(JSON.stringify(formData)) as IImportPublicRecords[]);
        const summaryRow = accounts[i]?.publicRecordSummary[j];
        const newRowData = {
            ...summaryRow,
            [fieldName]: value
        };
        accounts[i].publicRecordSummary?.splice(j, 1, newRowData);
        setformData(accounts);
        if (props?.onChange) {
            props?.onChange(accounts);
        }
    }
    return (
        <div className="public-records">
            {
                formData?.map((x, i) => (
                    <div className="public-record-main" key={i}>
                        <div className="clssummaryRowHeader font-weight-bold">{x?.publicRecordHeader}</div>
                        <div id="tblPublicRecords">
                            <div className="row">
                                <div className="col-3 pl-4">
                                    <button className="btn btn-sm btn-danger f-12" onClick={() => deleteAccount(i)}>
                                        <i className="fa fa-trash mr-1"></i>
                                        Discard
                                    </button>
                                </div>
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
                                    <SearchCollectionEntries isTextArea={true} type={CollectionEntryTypes.Reason} onChange={(e: any) => onReasonChange(e, i)} placeholder="Type to search..." />
                                </div>
                            </div>
                            {
                                x?.publicRecordSummary?.map((m, j) => (
                                    <div className="row mb-1" key={j}>
                                        <div className="col-3 text-right d-flex align-items-start justify-content-end f-13 pt-2">
                                            {m?.publicRecordParam}
                                        </div>
                                        <div className="col-3">
                                            <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.TextBox} value={m?.publicRecordParamValueTU} onChange={(e) => onFieldChange('publicRecordParamValueTU', e, i, j)} />
                                        </div>
                                        <div className="col-3">
                                            <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.TextBox} value={m?.publicRecordParamValueEXP} onChange={(e) => onFieldChange('publicRecordParamValueEXP', e, i, j)} />
                                        </div>
                                        <div className="col-3">
                                            <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.TextBox} value={m?.publicRecordParamValueEQF} onChange={(e) => onFieldChange('publicRecordParamValueEQF', e, i, j)} />
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                ))
            }
        </div>
    );

}