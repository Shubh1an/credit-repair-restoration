import React, { useState } from 'react';
import { useEffect } from 'react';

import { AccountTypes, EnumControlTypes } from '../../../../models/enums';
import { IBureauInputModel } from '../../../../models/interfaces/fast-edit-accounts';
import { AccountOutcomes } from '../../../../shared/constants';
import { FEAccountField } from '../../../../shared/components/fe-account-field';

export const FEBureauDetailsMini: React.FC<any> = (props: IBureauInputModel) => {
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
                            <FEAccountField label="Date Opened" mode={props?.mode} type={EnumControlTypes.DatePicker} value={props?.data?.dateOpened} onChange={(e) => onFieldChange('dateOpened', e)} />
                        </div>
                    </>
                    : null
            }
            <div className="account-field-row">
                <FEAccountField label="Current outcome" mode={props?.mode} options={AccountOutcomes} type={EnumControlTypes.DrowpDown} value={props?.data?.currentOutcome} onChange={(e) => onFieldChange('currentOutcome', e)} />
            </div>
        </div>
    );
}