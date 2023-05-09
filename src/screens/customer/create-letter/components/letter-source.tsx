import React, { useEffect, useState } from 'react';

import { Alignment } from '../../../../models/enums';
import { ICreateLetter } from '../../../../models/interfaces/create-letter';
import { CheckboxList } from '../../../../shared/components/checkbox-list';
import { Variables } from '../../../../shared/constants';


export const LetterSourceComponent = (props: ICreateLetter) => {
    const [list, setList] = useState(Variables.BUREAU_LIST1 as any[]);
    const handleChange = (values: string[]) => {
        props.onSave(values, props?.letterSource?.isShowMore);
    }
    useEffect(() => {
        if (props?.letterSource?.isShowMore) {
            setList([...Variables.BUREAU_LIST1,...Variables.BUREAU_LIST2]);
        } else {
            setList(Variables.BUREAU_LIST1);
        }
    }, [props?.letterSource?.isShowMore]);
    return (
        <div className="select-source">
            <fieldset className="customer-field-set mt-2 f-11 letter-fieldset">
                <legend className="f-11">
                    <label>Step#1: Letter Source </label>
                </legend>
                <div className="d-flex justify-content-center mt-2 mb-2" >
                    <CheckboxList selectedValues={props?.letterSource?.sources || []} alignment={Alignment.Vertical}
                        list={list} onChange={handleChange} />
                </div>
            </fieldset>
        </div>
    );
}