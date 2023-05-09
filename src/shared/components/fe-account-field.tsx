import moment from 'moment';
import React, { useEffect, useState } from 'react';

import { CollectionEntryTypes, EnumComponentMode, EnumControlTypes } from '../../models/enums';
import { IFEAccountField } from '../../models/interfaces/fast-edit-accounts';
import { IValueText } from '../../models/interfaces/shared';
import { Checkbox } from './checkbox';
import { SearchCollectionEntries } from './search-collection-entries';

export const FEAccountField: React.FC<IFEAccountField> = (props: IFEAccountField) => {

    const [isEditMode, setIsEditMode] = useState(props?.mode === EnumComponentMode.Add);
    const [value, setValue] = useState(props?.value);
    const onChange = (v: any) => {
        setValue(v);
        if (props.onChange) {
            props.onChange(v);
        }
    }
    const onCheckboxChange = (v: any) => {
        onChange(v?.checked?.toString());
    }
    const onAutoCompleteChange = (v: any) => {
        onChange(v?.name ?? v);
    }
    const onInputChange = (v: any) => {
        onChange(v.target.value);
    }
    useEffect(() => {
        setValue(props?.value);
    }, [props?.value]);
    const getField = () => {
        switch (props?.type) {
            case EnumControlTypes.Checkbox:
                return (<Checkbox text='' checked={value === 'true' || false} onChange={onCheckboxChange} />);
            case EnumControlTypes.Number:
                return (<input type="number" value={value ?? ''} onChange={onInputChange} className="form-control input-sm p-1" />);
            case EnumControlTypes.TextArea:
                return (<textarea value={value ?? ''} onChange={onInputChange} className="form-control input-sm p-1" ></textarea>);
            case EnumControlTypes.TextBox:
                return (<input type="text" value={value ?? ''} onChange={onInputChange} className="form-control input-sm p-1" />);
            case EnumControlTypes.DatePicker:
                return (<input type="date" value={getDateForPicker(value)} onChange={onInputChange} className="form-control input-sm p-1" />);
            case EnumControlTypes.AutoComplete:
                return (<SearchCollectionEntries defaultValue={value ?? ''} minSearchLength={2} type={props.autoCompleteType || CollectionEntryTypes.AccountName} onChange={onAutoCompleteChange} placeholder="Type to search..." />)
            case EnumControlTypes.ReadOnly:
                return (<input type="text" readOnly={true} value={value ?? ''} onChange={onInputChange} className="form-control input-sm p-1" />);
            case EnumControlTypes.DrowpDown:
                return (
                    <>
                        <select className="custom-select custom-select-sm f-11" value={value ?? ''} onChange={onInputChange} >
                            {
                                props?.options?.map((item: IValueText, index) => <option key={index} value={item.value}>{item?.text}</option>)
                            }
                        </select>
                    </>);
        }
    }
    const getDateForPicker = (d?: string): string => {
        const dd = moment(d).format("YYYY-MM-DD");
        return (dd !== '0001-01-01' && dd !== '1900-01-01') ? dd : '';
    }
    const getDate = (d?: string): string => {
        const dd = moment(d).format("MM/DD/YYYY");
        return (dd !== '01/01/0001' && dd !== '01/01/1900') ? dd : '';
    }
    return (
        <>
            <div className="form-group mb-1 ">
                <div className="d-flex align-items-center justify-content-between">
                    <label>{props?.label && (props?.label + ' :')} </label>
                    {props?.type !== EnumControlTypes.ReadOnly && !isEditMode ? <i className="fa fa-edit ml-2 pointer f-11" onClick={() => setIsEditMode(true)}></i> : null}
                </div>
                <div className="input-group flex-1">
                    {
                        isEditMode ? getField()
                            : <span className="form-value f-10">
                                {
                                    props?.type === EnumControlTypes.DatePicker
                                        ? getDate(props?.value)
                                        : props?.value
                                }
                            </span>
                    }
                </div>
            </div>
        </>
    );
}