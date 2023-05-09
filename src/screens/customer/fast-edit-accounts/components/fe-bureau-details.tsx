import React, { useState } from 'react';
import { useEffect } from 'react';

import { AccountTypes, CollectionEntryTypes, EnumComponentMode, EnumControlTypes } from '../../../../models/enums';
import { IBureauInputModel } from '../../../../models/interfaces/fast-edit-accounts';
import { AccountOutcomes } from '../../../../shared/constants';
import { FEAccountField } from '../../../../shared/components/fe-account-field';

export const FEBureauDetails: React.FC<any> = (props: IBureauInputModel) => {
    const [formData, setformData] = useState(props?.data);
    useEffect(() => {
        setformData(props?.data);
    }, [props?.data])
    const onFieldChange = (fieldName: string, value: any) => {
        const newFormData = {
            ...formData,
            [fieldName]: value
        };
        setformData(newFormData);
        if (props?.onChange) {
            props?.onChange(newFormData);
        }
    }
    return (
        <div className="bureau-details">
            <div className="account-field-row">
                <FEAccountField label="Acc#" mode={props?.mode} type={EnumControlTypes.TextBox} value={props?.data?.accNum} onChange={(e) => onFieldChange('accNum', e)} />
            </div>
            {
                props?.accountType?.toLowerCase() !== AccountTypes.Inquiry ?
                    <>
                        <div className="account-field-row">
                            <FEAccountField label="Balance" mode={props?.mode} type={EnumControlTypes.TextBox} value={props?.data?.balance} onChange={(e) => onFieldChange('balance', e)} />
                        </div>
                        <div className="account-field-row">
                            <FEAccountField label="Acc. Status" mode={props?.mode} type={EnumControlTypes.AutoComplete} autoCompleteType={CollectionEntryTypes.AccountStatus} value={props?.data?.accStatus} onChange={(e) => onFieldChange('accStatus', e)} />
                        </div>
                        {
                            props?.mode === EnumComponentMode.Add &&
                            <div className="account-field-row">
                                <FEAccountField label="Dispute Reason" mode={props?.mode} type={EnumControlTypes.AutoComplete} autoCompleteType={CollectionEntryTypes.Reason} value={props?.data?.currentDisputeReason} onChange={(e) => onFieldChange('currentDisputeReason', e)} />
                            </div>
                        }
                        <div className="account-field-row">
                            <FEAccountField label="Pay Status" mode={props?.mode} type={EnumControlTypes.TextBox} value={props?.data?.payStatus} onChange={(e) => onFieldChange('payStatus', e)} />
                        </div>
                        <div className="account-field-row">
                            <FEAccountField label="Date Opened" mode={props?.mode} type={EnumControlTypes.DatePicker} value={props?.data?.dateOpened} onChange={(e) => onFieldChange('dateOpened', e)} />
                        </div>
                        <div className="account-field-row">
                            <FEAccountField label="High Credit" mode={props?.mode} type={EnumControlTypes.TextBox} value={props?.data?.highCredit} onChange={(e) => onFieldChange('highCredit', e)} />
                        </div>
                    </>
                    : null
            }
            {
                props?.mode !== EnumComponentMode.Add &&
                <div className="account-field-row">
                    <FEAccountField label="Date of Inquiry" mode={props?.mode} type={EnumControlTypes.DatePicker} value={props?.data?.dateOfInquiry} onChange={(e) => onFieldChange('dateOfInquiry', e)} />
                </div>
            }
            <div className="account-field-row">
                <FEAccountField label="Current outcome" mode={props?.mode} options={AccountOutcomes} type={EnumControlTypes.DrowpDown} value={props?.data?.currentOutcome} onChange={(e) => onFieldChange('currentOutcome', e)} />
            </div>
            {
                props?.mode === EnumComponentMode.Edit &&
                <div className="account-field-row">
                    <FEAccountField label="Dispute Reason" mode={props?.mode} type={EnumControlTypes.AutoComplete} autoCompleteType={CollectionEntryTypes.Reason} value={props?.data?.currentDisputeReason} onChange={(e) => onFieldChange('currentDisputeReason', e)} />
                </div>
            }
        </div>
    );
}