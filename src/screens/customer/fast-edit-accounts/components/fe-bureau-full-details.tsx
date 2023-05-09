import React, { useEffect, useState } from 'react';

import { Alignment, CollectionEntryTypes, EnumControlTypes } from '../../../../models/enums';
import { IDataItem, IFullBureauInputModel } from '../../../../models/interfaces/fast-edit-accounts';
import { ICheckboxList } from '../../../../models/interfaces/shared';
import { CheckboxList } from '../../../../shared/components/checkbox-list';
import { FEAccountField } from '../../../../shared/components/fe-account-field';

export const FEBureauFullDetails: React.FC<any> = (props: IFullBureauInputModel) => {

    const [formData, setformData] = useState(props?.data as any);
    const [selectedNames, setSelectedNames] = useState([] as string[]);
    const [selectedAddresses, setSelectedAddresses] = useState([] as string[]);

    const onFieldChange = (fieldName: string, value: any, isCheckbox = false) => {
        const newFormData = {
            ...formData,
            [fieldName]: value
        };
        setformData(newFormData);
        if (props?.onChange) {
            props?.onChange(newFormData);
        }
    }
    useEffect(() => {
        const selNames = props?.names?.filter(x => props?.data?.incorrectNames?.some(m => m.id === x.id)).map((item: IDataItem) => item.id ?? '') ?? [];
        const selAddresses = props?.addresses?.filter(x => props?.data?.incorrectAddreses?.some(m => m.id === x.id))?.map((item: IDataItem) => item.id ?? '') ?? [];

        setSelectedNames(selNames);
        setSelectedAddresses(selAddresses);

        setformData({
            ...formData,
            ...props?.data,
            selectedAddresses: selAddresses,
            selectedNames: selNames
        });
    }, [props?.names, props?.addresses,props?.data])

    return (
        <div className="bureau-details">
            <div className="account-field-row inserted-row">
                <FEAccountField label="Is Inserted" mode={props?.mode} type={EnumControlTypes.Checkbox} value={(props?.data?.isInserted ?? false)?.toString()} onChange={(e) => onFieldChange('isInserted', e, true)} />
            </div>
            <div className="account-field-row">
                <FEAccountField label="Acc#" mode={props?.mode} type={EnumControlTypes.TextBox} value={props?.data?.accNum ?? ''} onChange={(e) => onFieldChange('accNum', e)} />
            </div>
            <div className="account-field-row">
                <FEAccountField label="Date of Inquiry" mode={props?.mode} type={EnumControlTypes.DatePicker} value={props?.data?.dateOfInquiry ?? ''} onChange={(e) => onFieldChange('dateOfInquiry', e)} />
            </div>
            <div className="account-field-row">
                <FEAccountField label="Status" mode={props?.mode} type={EnumControlTypes.AutoComplete} value={props?.data?.accStatus ?? ''} autoCompleteType={CollectionEntryTypes.AccountStatus} onChange={(e) => onFieldChange('accStatus', e)} />
            </div>
            <div className="account-field-row">
                <FEAccountField label="Pay Status" mode={props?.mode} type={EnumControlTypes.TextBox} value={props?.data?.payStatus ?? ''} onChange={(e) => onFieldChange('payStatus', e)} />
            </div>
            <div className="account-field-row">
                <FEAccountField label="Date Opened" mode={props?.mode} type={EnumControlTypes.DatePicker} value={props?.data?.dateOpened ?? ''} onChange={(e) => onFieldChange('dateOpened', e)} />
            </div>
            <div className="account-field-row">
                <FEAccountField label="Dispute Reason" mode={props?.mode} type={EnumControlTypes.AutoComplete} autoCompleteType={CollectionEntryTypes.Reason} value={props?.data?.currentDisputeReason ?? ''} onChange={(e) => onFieldChange('currentDisputeReason', e)} />
            </div>
            <div className="account-field-row">
                <FEAccountField label="Dispute outcome" mode={props?.mode} type={EnumControlTypes.AutoComplete} value={props?.data?.currentOutcome} autoCompleteType={CollectionEntryTypes.Outcome} onChange={(e) => onFieldChange('currentOutcome', e)} />
            </div>
            <div className="account-field-row">
                <FEAccountField label="Original Creditor" mode={props?.mode} type={EnumControlTypes.TextBox} value={props?.data?.originalCreditor ?? ''} onChange={(e) => onFieldChange('originalCreditor', e)} />
            </div>
            <div className="account-field-row">
                <FEAccountField label="Court or Plaintiff" mode={props?.mode} type={EnumControlTypes.TextBox} value={props?.data?.courtOrPlaintiff ?? ''} onChange={(e) => onFieldChange('courtOrPlaintiff', e)} />
            </div>
            <div className="account-field-row">
                <FEAccountField label="Date of Last Activity" mode={props?.mode} type={EnumControlTypes.DatePicker} value={props?.data?.dateLastActivity ?? ''} onChange={(e) => onFieldChange('dateLastActivity', e)} />
            </div>
            <div className="account-field-row">
                <FEAccountField label="Responsibility" mode={props?.mode} options={[{ value: '0', text: '-Select-' }, { value: 'Individual', text: 'Individual' }, { value: 'Joint', text: 'Joint' }, { value: 'Authorized User and Co-Signor', text: 'Authorized User and Co-Signor' }]} type={EnumControlTypes.DrowpDown} value={props?.data?.responsibility} onChange={(e) => onFieldChange('responsibility', e)} />
            </div>
            <div className="account-field-row">
                <FEAccountField label="Date Last Reported" mode={props?.mode} type={EnumControlTypes.DatePicker} value={props?.data?.dateLastReported ?? ''} onChange={(e) => onFieldChange('dateLastReported', e)} />
            </div>
            <div className="account-field-row">
                <FEAccountField label="High Credit Limit" mode={props?.mode} type={EnumControlTypes.TextBox} value={props?.data?.highCreditLimit ?? ''} onChange={(e) => onFieldChange('highCreditLimit', e)} />
            </div>
            <div className="account-field-row">
                <FEAccountField label="Balance" mode={props?.mode} type={EnumControlTypes.TextBox} value={props?.data?.balance ?? ''} onChange={(e) => onFieldChange('balance', e)} />
            </div>
            <div className="account-field-row">
                <FEAccountField label="Monthly Payment" mode={props?.mode} type={EnumControlTypes.TextBox} value={props?.data?.monthlyPayment ?? ''} onChange={(e) => onFieldChange('monthlyPayment', e)} />
            </div>
            <div className="account-field-row">
                <FEAccountField label="Past Due Amount" mode={props?.mode} type={EnumControlTypes.TextBox} value={props?.data?.pastDueAmount ?? ''} onChange={(e) => onFieldChange('pastDueAmount', e)} />
            </div>
            <div className="account-field-row">
                <FEAccountField label="Number of Last Payments(30)" mode={props?.mode} type={EnumControlTypes.Number} value={props?.data?.payments30} onChange={(e) => onFieldChange('payments30', e)} />
            </div>
            <div className="account-field-row">
                <FEAccountField label="Number of Last Payments(60)" mode={props?.mode} type={EnumControlTypes.Number} value={props?.data?.payments60} onChange={(e) => onFieldChange('payments60', e)} />
            </div>
            <div className="account-field-row">
                <FEAccountField label="Number of Last Payments(90)" mode={props?.mode} type={EnumControlTypes.Number} value={props?.data?.payments90} onChange={(e) => onFieldChange('payments90', e)} />
            </div>
            <div className="account-field-row make-radio-gap">
                <label>Alias or Incorrect Names</label>
                <CheckboxList selectedValues={selectedNames || []} alignment={Alignment.Vertical}
                    list={getNamesAddress(props?.names)} onChange={(e) => { setSelectedNames(e); onFieldChange('selectedNames', e); }} />
                <FEAccountField mode={props?.mode} type={EnumControlTypes.TextArea} value={''} onChange={(e) => onFieldChange('newName', e)} />
            </div>
            <div className="account-field-row make-radio-gap">
                <label>Alias or Incorrect Addresses</label>
                <CheckboxList selectedValues={selectedAddresses || []} alignment={Alignment.Vertical}
                    list={getNamesAddress(props?.addresses)} onChange={(e) => { setSelectedAddresses(e); onFieldChange('selectedAddresses', e); }} />
                <FEAccountField mode={props?.mode} type={EnumControlTypes.TextArea} value={''} onChange={(e) => onFieldChange('newAddress', e)} />
            </div>
            <div className="account-field-row">
                <FEAccountField label="Notes" mode={props?.mode} type={EnumControlTypes.TextArea} value={props?.data?.notes} onChange={(e) => onFieldChange('notes', e)} />
            </div>
        </div>
    );
}
function getNamesAddress(addressesNames?: IDataItem[]): ICheckboxList[] {
    return addressesNames?.map((item: IDataItem) => ({ value: item.id ?? '', text: item.value ?? '' })) ?? [];
}