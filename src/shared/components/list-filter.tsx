import React, { useState } from 'react';

import { AlphabetComponent } from './alphabet';
import { SearchCustomersComponent } from './search-customers';
import { SearchOptions } from './search-options';
import { Alignment, AutoCompleteSearchTypes, EnumSearchOptions } from '../../models/enums';
import { RadioCheckboxList } from './radio-checkbox-list';
import { DateRangeComponent } from './date-range-filter';

const enum Types {
    ByText,
    ByDate
}
export const ListFilterComponent = (props: {
    selectedAlphabet?: any;
    alphabetClicked?: any;
    onTextChange?: any;
    selectedOptions?: any;
    onSearchOptionChange?: any;
    defaultText?: any;
    onFilterClear?: any;
    hideAlphabets?: boolean;
    hideSearchOptions?: boolean;
    hideCustomerSearch?: boolean;
    customerSearchPlaceholder?: string;
    searchTypes?: AutoCompleteSearchTypes;
    onDateRangeChange?: any
}) => {
    const [type, setType] = useState(Types.ByText as Types);
    const onFilterTypeChange = (val: any) => {
        setType(val);
    }
    const onDateChange = (data: { from: string, to: string }) => {
        props?.onDateRangeChange(data);
    }
    return (
        <div className="filter-controls">
            {
                !props?.hideAlphabets && <AlphabetComponent selected={props?.selectedAlphabet} text="Select :" onSelect={props?.alphabetClicked} />}
            {
                !props?.hideCustomerSearch && <div className='search-filter-options'>
                    <div className='filter-types'>
                        <RadioCheckboxList
                            list={[{ value: Types.ByText, text: 'Search by Text' }, { value: Types.ByDate, text: 'Search by Date' }]}
                            alignment={Alignment.Horizontal}
                            groupName='filterType'
                            selectedValue={type}
                            onChange={(data: any) => onFilterTypeChange(data.value)} />
                    </div>
                    {
                        type === Types.ByText ?
                            <SearchCustomersComponent showSubmitArrow={true}
                                searchTypes={props?.searchTypes || AutoCompleteSearchTypes.CUSTOMER} minSearchLength={3} onSelect={props?.onTextChange}
                                placeholder={props?.customerSearchPlaceholder || "search clients, agents ..."} defaultValue={props?.defaultText} />
                            :
                            <DateRangeComponent onChange={onDateChange} />
                    }
                </div>}
            {
                !props?.hideSearchOptions
                && <SearchOptions
                    alignment={Alignment.Horizontal}
                    selectedValues={props?.selectedOptions}
                    onChange={props?.onSearchOptionChange}
                    list={
                        [
                            { value: EnumSearchOptions.Complete, text: 'Hide Complete' },
                            { value: EnumSearchOptions.OnHold, text: 'Hide On-Hold' },
                            { value: EnumSearchOptions.Cancelled, text: 'Hide Cancelled' }
                        ]
                    } />
            }
        </div>
    );
}