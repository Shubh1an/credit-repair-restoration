import React from 'react';

import { ICheckBoxListInput } from '../../models/interfaces/shared';
import { CheckboxList } from './checkbox-list';

export const SearchOptions = (props: ICheckBoxListInput) => {
    return (
        <div className="search-options d-flex w-100 pt-1 mt-2">
            <span className="options-label">Search Options:</span>
            <CheckboxList selectedValues={props?.selectedValues || []} alignment={props?.alignment}
                list={props?.list} onChange={props?.onChange} />
        </div>
    );
}