import React from 'react';

import { ICheckboxList } from '../../models/interfaces/shared';
import { Checkbox } from './checkbox';
import { Alignment } from '../../models/enums';

export interface IRadioCheckboxListOutpout {
    value: any;
    checked: boolean;
}

export const RadioCheckboxList = (props: {
    list: ICheckboxList[],
    onChange: (param: IRadioCheckboxListOutpout) => void,
    groupName: string,
    selectedValue: any,
    alignment: Alignment
}) => {

    return (
        <div className={"chk-" + (props?.alignment || Alignment.Vertical)}>
            {
                props.list.map((item: ICheckboxList, index: number) => {
                    return (
                        <Checkbox key={index}
                            groupName={props?.groupName}
                            value={item?.value}
                            text={item?.text}
                            circled={true}
                            disabled={item?.disabled}
                            checked={item?.value === props?.selectedValue}
                            onChange={props.onChange} />
                    );
                })
            }
        </div>
    );
}