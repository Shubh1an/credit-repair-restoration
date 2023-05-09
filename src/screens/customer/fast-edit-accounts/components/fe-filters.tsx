import React, { useState } from 'react';

import { IFEFilterModel } from '../../../../models/interfaces/fast-edit-accounts';

const sorts = [
    { text: 'Entered On: Descending', value: 'Enter:Desc' },
    { text: 'Entered On: Ascending', value: 'Enter:Asc' },
    { text: 'Modified On: Descending', value: 'Modify:Desc' },
    { text: 'Modified On: Ascending', value: 'Modify:Asc' }
];
const filterBys = [
    { text: 'Account Name', value: 'AccountName' },
    { text: 'Round', value: 'Round' },
    { text: 'Account Type', value: 'AccountType' },
    { text: 'Account Status', value: 'AccountStatus' }
];

export const FEFilters: React.FC<any> = (props: {
    onSearch: (param: IFEFilterModel) => any,
    onAddNewClick: () => void,
    onStatsClick: () => void

}) => {
    const [formData, setFormData] = useState({
        sort: sorts[0].value,
        filterBy: '',
        filterByText: ''
    } as IFEFilterModel);

    const [filterPlaceHolder, setFilterPlaceHolder] = useState('');

    const onChange = (val: string, name: string) => {
        const newData = {
            ...formData,
            [name]: val
        };
        setFormData(newData);
        if (name === 'filterBy') {
            const option = filterBys.find(x => x.value === val)?.text;
            setFilterPlaceHolder(option ? 'Enter ' + option + ' here...' : '');
            if (!val) {
                setFormData({
                    ...newData,
                    filterByText: ''
                });
            }
        }
    }
    return (
        <div className="row filter-section m-0 mb-2">
            <div className="col-12 col-sm-4 pl-sm-0 pr-sm-0">
                <button className="btn btn-sm btn-primary mr-sm-2 f-11  pl-sm-2 pr-sm-2 w-100 w-sm-auto" onClick={props?.onAddNewClick}>
                    <i className="fa fa-plus mr-1"></i>Add New Account</button>

                <button className="btn btn-sm btn-secondary f-11 pl-sm-2 pr-sm-2  w-100 w-sm-auto mt-1 mt-sm-0" onClick={props?.onStatsClick}>
                    <i className="fa fa-line-chart mr-1"></i>Dispute Stats</button>
            </div>
            <div className="col-12 col-sm-8 flex-column flex-sm-row justify-content-end form-inline pr-sm-0">
                <div className="form-group w-100 w-sm-auto">
                    <label>Sort by:</label>
                    <div className="input-group ml-sm-2">
                        <select value={formData?.sort} className="custom-select custom-select-sm f-11" name="sort" onChange={(e) => onChange(e.target.value, e.target.name)}>
                            {
                                sorts.map((item, index) => <option key={index} value={item?.value}>{item?.text}</option>)
                            }
                        </select>
                    </div>
                </div>
                <div className="form-group ml-sm-3  w-100 w-sm-auto">
                    <label>Filter by:</label>
                    <div className="input-group ml-sm-2">
                        <select name="filterBy" value={formData?.filterBy} className="custom-select custom-select-sm f-11" onChange={(e) => onChange(e.target.value, e.target.name)}>
                            <option value=''>-Select-</option>
                            {
                                filterBys.map((item, index) => <option key={index} value={item?.value}>{item?.text}</option>)
                            }
                        </select>
                    </div>
                </div>
                <div className="form-group ml-sm-1 w-100 w-sm-auto">
                    <div className="input-group ml-sm-2">
                        <input name="filterByText" disabled={!formData?.filterBy} value={formData?.filterByText} onChange={(e) => onChange(e.target.value, e.target.name)} className="form-control input-sm dark-placeholder p-1 f-11" type="text" placeholder={filterPlaceHolder} />
                    </div>
                </div>
                <div className="form-group ml-sm-1  w-100 w-sm-auto">
                    <button className="btn btn-sm btn-primary f-10 p-1  pl-2 pr-2 w-100 w-sm-auto" onClick={() => props.onSearch && props.onSearch(formData)}>
                        <i className="fa fa-search"></i> <label className='d-inline-block d-sm-none ml-1'>Search</label>
                    </button>
                </div>
            </div>
        </div>

    );
}