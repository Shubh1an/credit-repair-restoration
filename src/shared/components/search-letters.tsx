
import React, { useState } from 'react';
import { CancelTokenSource } from 'axios';
import classnames from 'classnames';
import { validate as uuidValidate } from 'uuid';

import { IDropdown } from '../../models/interfaces/shared';
import { AutoComplete } from './autocomplete';
import { letterSearch } from '../../actions/create-letter.actions';
import { LetterSearchTypes } from '../../models/enums';
import { LetterSearchResponse } from '../../models/interfaces/create-letter';


export const SearchLetters = ((props: {
    type: LetterSearchTypes,
    defaultValue?: string,
    onSelect?: any,
    onChange?: any,
    placeholder?: string,
    minSearchLength?: number,
    onSelectedData?: (param: any) => any
}) => {

    const [list, setList] = useState([] as LetterSearchResponse[]);

    const apiPromise = (searchText: string, source: CancelTokenSource) => {
        return letterSearch(props.type, searchText, source)
            .then((result: any) => {
                setList(result);
                return result;
            }).then((result: LetterSearchResponse[]) => {
                return result?.map(item => ({
                    name: item?.name,
                    abbreviation: item?.id
                }));
            }) as Promise<IDropdown[]>
    }
    const onSelect = (text: string | IDropdown) => {
        if (props?.onSelect) {
            props?.onSelect(text);
        }
        if (typeof (text) === 'object' && uuidValidate(text?.abbreviation ?? '') && props?.onSelectedData) {
            const cust = list?.find(x => x.id === text?.abbreviation);
            props?.onSelectedData(cust);
        }
        if (!text && props.onSelectedData) {
            props?.onSelectedData(null);
        }
    }
    return (
        <div className={classnames("searchbox flex-1")} >
            <AutoComplete asyncData={apiPromise} value={props?.defaultValue ?? ''}
                placeholder={props?.placeholder} minSearchLength={props?.minSearchLength || 3} onSelect={onSelect}
                onChange={props?.onChange} />
        </div >
    );
})