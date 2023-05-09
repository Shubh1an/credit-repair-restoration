import React, { useEffect, useState } from 'react';
// @ts-ignore
import confirm from 'reactstrap-confirm';

import { CollectionEntryTypes, EnumBureausShorts, EnumComponentMode, EnumControlTypes } from '../../../../../models/enums';
import { IHTMLParserData, IImportAccountHistory, ISummary } from '../../../../../models/interfaces/importer';
import { BureauLogoComponent } from '../../../../../shared/components/bureau-logo';
import { ButtonComponent } from '../../../../../shared/components/button';
import { Checkbox } from '../../../../../shared/components/checkbox';
import { FEAccountField } from '../../../../../shared/components/fe-account-field';
import { SearchCollectionEntries } from '../../../../../shared/components/search-collection-entries';
import { ImporterUtils } from '../../../../../utils/importer-utils';
import { ReportType } from '../../import-constants';


export const ImportAccountHistoryComponent = (props: { data: IHTMLParserData | null, onChange: any, reportType: ReportType }) => {
    const [formData, setformData] = useState(props?.data?.accountHistory as IImportAccountHistory[] || []);
    const [allChecked, setAllChecked] = useState(false);
    const [checkedCount, setcheckedCount] = useState(0);

    useEffect(() => {
        setformData(props?.data?.accountHistory || []);
        if (props?.onChange && props?.data?.accountHistory) {
            props?.onChange(props?.data?.accountHistory || []);
        }
    }, [props?.data]);

    const onFieldChange = (fieldName: string, value: any, i: number, j: number) => {
        const accounts = [...formData] as IImportAccountHistory[];
        const summaryRow = accounts[i]?.Summary[j];
        const newRowData = {
            ...summaryRow,
            [fieldName]: value
        };
        accounts[i].Summary?.splice(j, 1, newRowData);
        setformData(accounts);
        if (props?.onChange) {
            props?.onChange(accounts);
        }
    }
    const onReasonChange = (value: any, index: number) => {
        const accounts = [...formData] as IImportAccountHistory[];
        const acc = accounts[index];
        const newRowData = {
            ...acc,
            globalReason: value?.name
        } as IImportAccountHistory;
        accounts.splice(index, 1, newRowData);
        setformData(accounts);
        if (props?.onChange) {
            props?.onChange(accounts);
        }
    }
    const deleteAccount = async (index: number) => {
        let result = await confirm({
            title: 'Discard Account',
            message: "Are you sure you want to discard this Account?",
            confirmText: "YES",
            confirmColor: "danger",
            cancelColor: "link text-secondary"
        });
        if (result) {
            const accounts = [...formData] as IImportAccountHistory[];
            accounts.splice(index, 1);
            setformData(accounts);
            setcheckedCount(checkedCount - 1);
            if (props?.onChange) {
                props?.onChange(accounts);
            }
        }
    }
    const getFieldNegHTML = (summary: ISummary) => {
        const icon = <i className="fa fa-exclamation-triangle text-danger mr-1"></i>
        if (summary?.accountParam?.toLowerCase()?.includes('account status')) {
            const neg = getBureaueValuesNegative(summary, 'AcctStatus');
            if (neg) {
                return icon;
            }

        } else if (summary?.accountParam?.toLowerCase()?.includes('past due')) {
            const neg = getBureaueValuesNegative(summary, 'PastDue');
            if (neg) {
                return;
            }
        } else if (summary?.accountParam?.toLowerCase()?.includes('payment status')) {
            const neg = getBureaueValuesNegative(summary, 'PayStatus');
            if (neg) {
                return icon;
            }
        } else if (summary?.accountParam?.toLowerCase()?.includes('comment')) {
            const neg = getBureaueValuesNegative(summary, 'Comments');
            if (neg) {
                return icon;
            }
        } else if (summary?.accountParam?.toLowerCase()?.includes('account type')) {
            const neg = getBureaueValuesNegative(summary, 'AcctType');
            if (neg) {
                return icon;
            }
        }
        return '';

    }
    const getFieldQuestHTML = (summary: ISummary) => {
        const icon = <i className="fa fa-question text-warning f-17 mr-1"></i>;
        if (summary?.accountParam?.toLowerCase()?.includes('account status')) {
            const quest = getBureaueValuesQuestionable(summary, 'AcctStatus');
            if (quest) {
                return icon;
            }
        } else if (summary?.accountParam?.toLowerCase()?.includes('comment')) {
            const neg = getBureaueValuesQuestionable(summary, 'Comments');
            if (neg) {
                return icon;
            }
        }
        return '';
    }
    const getBureaueValuesNegative = (summary: ISummary, fieldType: string) => {
        const tuNeg = ImporterUtils.IsFieldValueNegative(summary?.accountParamValueTU?.toLowerCase() ?? '', fieldType);
        const expNeg = ImporterUtils.IsFieldValueNegative(summary?.accountParamValueEXP?.toLowerCase() ?? '', fieldType);
        const eqfNeg = ImporterUtils.IsFieldValueNegative(summary?.accountParamValueEQF?.toLowerCase() ?? '', fieldType);
        return tuNeg || expNeg || eqfNeg;
    }
    const getBureaueValuesQuestionable = (summary: ISummary, fieldType: string) => {
        const tuQ = ImporterUtils.IsQuestionableAccount(summary?.accountParamValueTU?.toLowerCase() ?? '', fieldType);
        const expQ = ImporterUtils.IsQuestionableAccount(summary?.accountParamValueEXP?.toLowerCase() ?? '', fieldType);
        const eqfQ = ImporterUtils.IsQuestionableAccount(summary?.accountParamValueEQF?.toLowerCase() ?? '', fieldType);
        return tuQ || expQ || eqfQ;
    }
    const getBureauIconNegative = (history: IImportAccountHistory, bureaushort: string) => {
        return ImporterUtils.IsBureauAccountNegative(history, bureaushort);
    }
    const IsBureauAccountQuestionable = (history: IImportAccountHistory, bureaushort: string) => {
        return ImporterUtils.IsBureauAccountQuestionable(history, bureaushort);
    }
    const onCheckChange = ({ value, checked }: any) => {
        const copyForm = [...formData];
        let newFormData = copyForm[value];
        newFormData.checked = checked;
        setformData(copyForm);
        setcheckedCount(checked ? checkedCount + 1 : checkedCount - 1);
        if (!checked) {
            setAllChecked(false);
        }
    }
    const onAllChecked = (checked: boolean) => {
        setcheckedCount(checked ? formData?.length : 0);
        setformData(formData?.map(x => ({
            ...x,
            checked
        })));
    }
    const onDeleteAll = async () => {
        let result = await confirm({
            title: 'Remove Multiple Accounts',
            message: "Are you sure you want to remove selected "
                + (checkedCount === formData?.length ? 'All' : checkedCount)
                + " Account" + ((checkedCount > 1) ? 's' : '') + "?",
            confirmText: "YES",
            confirmColor: "danger",
            cancelColor: "link text-secondary"
        });
        if (result) {
            setcheckedCount(0);
            const newAccounts = formData?.filter(x => !x.checked);
            setformData(newAccounts);
            if (props?.onChange) {
                props?.onChange(newAccounts);
            }
        }
    }
    return (
        <div className="account-history ">
            <div className="p-2 d-flex align-items-center">
                <div>
                    {
                        !!formData?.length &&
                        <Checkbox text="Check/Uncheck All" checked={allChecked} onChange={(data: any) => { setAllChecked(data?.checked); onAllChecked(data?.checked); }} />
                    }
                </div>
                {
                    checkedCount > 0 &&
                    <div className="ml-3">
                        <ButtonComponent text={"Delete " + `(${checkedCount})`} className="btn-danger pull-left" onClick={onDeleteAll} >
                            <i className="fa fa-trash mr-2"></i>
                        </ButtonComponent>
                    </div>
                }
            </div>
            {
                formData?.map((acc, ind) => (
                    <div className="clsAccountHistoryMain" key={ind}>
                        <div className="clssummaryRowHeader font-weight-bold accountHistorySinglerow">{acc?.accountHeader}</div>
                        <div className="tblAccountHistory">
                            <div className="row">
                                <div className="col-3 pl-4 d-flex">
                                    <div className="pt-1">
                                        <Checkbox text="" value={ind} checked={acc.checked} title={'Select for bulk delete '} onChange={onCheckChange} />
                                    </div>
                                    <div>
                                        <ButtonComponent text="" title="Discard" onClick={() => deleteAccount(ind)} className="btn-sm btn-danger f-12" >
                                            <i className="fa fa-trash"></i>
                                        </ButtonComponent>
                                    </div>
                                </div>
                                <div className="col-3 d-flex justify-content-center align-items-center pb-3">
                                    {
                                        getBureauIconNegative(acc, EnumBureausShorts.TU)
                                        &&
                                        <i className="fa fa-exclamation-triangle text-danger mr-2"></i>
                                    }
                                    {
                                        IsBureauAccountQuestionable(acc, EnumBureausShorts.TU)
                                        &&
                                        <i className="fa fa-question text-warning m2-1 f-20"></i>
                                    }
                                    <BureauLogoComponent type={EnumBureausShorts.TU} size={'md'} />
                                </div>
                                <div className="col-3 d-flex justify-content-center align-items-center pb-3">
                                    {
                                        getBureauIconNegative(acc, EnumBureausShorts.EXP)
                                        &&
                                        <i className="fa fa-exclamation-triangle text-danger mr-2"></i>
                                    }
                                    {
                                        IsBureauAccountQuestionable(acc, EnumBureausShorts.EXP)
                                        &&
                                        <i className="fa fa-question text-warning mr-2 f-20"></i>
                                    }
                                    <BureauLogoComponent type={EnumBureausShorts.EXP} size={'md'} />
                                </div>
                                <div className="col-3 d-flex justify-content-center align-items-center pb-3">
                                    {
                                        getBureauIconNegative(acc, EnumBureausShorts.EQF)
                                        &&
                                        <i className="fa fa-exclamation-triangle text-danger mr-2"></i>
                                    }
                                    {
                                        IsBureauAccountQuestionable(acc, EnumBureausShorts.EQF)
                                        &&
                                        <i className="fa fa-question text-warning mr-2 f-20"></i>
                                    }
                                    <BureauLogoComponent type={EnumBureausShorts.EQF} size={'md'} />
                                </div>
                            </div>
                            <div className="row mb-1">
                                <div className="col-3 text-right d-flex align-items-start justify-content-end f-13 pt-2">
                                    Global Dispute Reason:
                                </div>
                                <div className="col-9">
                                    <SearchCollectionEntries isTextArea={true} type={CollectionEntryTypes.Reason} onChange={(e: any) => onReasonChange(e, ind)} placeholder="Type to search..." />
                                </div>
                            </div>
                            {
                                acc?.Summary?.map((summary, index) => (
                                    <div className="row" key={index}>
                                        <div className="col-3 text-right d-flex align-items-center justify-content-end f-13">
                                            {getFieldNegHTML(summary)} &nbsp; {getFieldQuestHTML(summary)}&nbsp;{summary?.accountParam}
                                        </div>
                                        <div className="col-3 ">
                                            <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.TextBox} value={summary?.accountParamValueTU} onChange={(e) => onFieldChange('accountParamValueTU', e, ind, index)} />
                                        </div>
                                        <div className="col-3 ">
                                            <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.TextBox} value={summary?.accountParamValueEXP} onChange={(e) => onFieldChange('accountParamValueEXP', e, ind, index)} />
                                        </div>
                                        <div className="col-3">
                                            <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.TextBox} value={summary?.accountParamValueEQF} onChange={(e) => onFieldChange('accountParamValueEQF', e, ind, index)} />
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        {
                            props?.reportType === ReportType.MyIQReport
                            &&
                            <>
                                <div className="clssummaryRowHeader font-weight-bold historybg">24-Month Payment History</div>
                                <table cellSpacing="0" cellPadding="0" className="tblAccSummaryMonth">
                                    <tbody>
                                        <tr>
                                            <th className="leftHeader">Month :</th>
                                            {
                                                acc?.MonthNames?.map((x, i) => <th key={i}>{x}</th>)
                                            }
                                        </tr>
                                        <tr>
                                            <td className="leftHeader">
                                                <span >Year :</span>
                                            </td>
                                            {
                                                acc?.Years?.map((x, i) => (
                                                    <td key={i}>
                                                        <input type="text" value={x} className="smalltext accountSumaryYears" maxLength={5} />
                                                    </td>
                                                ))
                                            }

                                        </tr>
                                        <tr>
                                            <td className="leftHeader">
                                                <span >TransUnion :</span>
                                            </td>
                                            {
                                                acc?.TransUnions?.map((x, i) => (
                                                    <td key={i}>
                                                        <input type="text" value={x} className="smalltext TUs" maxLength={5} />
                                                    </td>
                                                ))
                                            }

                                        </tr>
                                        <tr>
                                            <td className="leftHeader">
                                                <span >Experian :</span>
                                            </td>
                                            {
                                                acc?.Experians?.map((x, i) => (
                                                    <td key={i}>
                                                        <input type="text" value={x} className="smalltext EXPs" maxLength={5} />
                                                    </td>
                                                ))
                                            }

                                        </tr>
                                        <tr>
                                            <td className="leftHeader">
                                                <span>Equifax :</span>
                                            </td>
                                            {
                                                acc?.Equifaxs?.map((x, i) => (
                                                    <td key={i}>
                                                        <input type="text" value={x} className="smalltext EQFs" maxLength={5} />
                                                    </td>
                                                ))
                                            }
                                        </tr>
                                    </tbody>
                                </table>
                            </>
                        }
                    </div>
                ))
            }
        </div>
    );

}