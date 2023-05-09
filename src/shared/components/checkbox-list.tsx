import React from 'react';
// @ts-ignore
import confirm from 'reactstrap-confirm';

import { ICheckboxList, ICheckBoxListInput } from '../../models/interfaces/shared';
import { Checkbox } from './checkbox';
import { Alignment } from '../../models/enums';

export const CheckboxList = (props: ICheckBoxListInput) => {

    const onChkChange = ({ value, checked }: any) => {
        let newList = props?.selectedValues?.filter(x => x !== value);
        if (checked) {
            newList.push(value);
        }
        if (props?.onChange) {
            props.onChange(newList, { value, checked });
        }
    }

    const onRemove = async (item: ICheckboxList, i: number) => {
        let result = await confirm({
            title: 'Remove',
            message: "Are you sure you want to remove this item?",
            confirmText: "YES",
            confirmColor: "danger",
            cancelColor: "link text-secondary"
        });
        if (result && props?.onRemove) {
            props?.onRemove(item, i);
        }
    }
    return (
        <div className={"chk-" + (props?.alignment || Alignment.Vertical)}>
            {
                props.list.map((item: ICheckboxList, index: number) => {
                    return (
                        <div key={index} className={(props?.enableRemove ? 'single-checkbox-item' : '') + ' position-relative'}>
                            <Checkbox key={item?.value + '-' + index}
                                value={item?.value}
                                text={item?.text}
                                disabled={item?.disabled}
                                cssClass={item?.cssClass}
                                title={item?.title}
                                checked={props?.selectedValues?.some(x => x === item.value)}
                                onChange={onChkChange}
                                enableClickOnDisabled={props?.enableClickOnDisabled}
                                disableLabelClick={props?.disableLabelClick}
                            />
                            {
                                props?.enableRemove && <i className='fa fa-trash check-list-remove-btn text-danger' onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onRemove(item, index);
                                }}></i>
                            }
                        </div>
                    );
                })
            }
        </div>
    );
}