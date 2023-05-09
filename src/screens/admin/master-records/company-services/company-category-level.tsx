import React, { useEffect, useState } from 'react';

import { IFranchAddOn, IFranchLevel } from '../../../../models/interfaces/franchise'
import CompanyCategoryLevelAddOnsComponent from './company-category-level-addon'

export const CompanyCategoryLevelComponent = (props: {
    level: IFranchLevel,
    officeId: string,
    onChange?: any,
    onAddOnDelete: any
}) => {

    const [data, setData] = useState({} as IFranchLevel);

    useEffect(() => {
        setData({ ...(props?.level || {}) });
    }, [props?.level])

    const handleChange = (value: number, propName: string) => {
        let newData = { ...data } as any;
        newData[propName] = value;
        props?.onChange(newData);
    }
    const onAddOnChanges = (list: IFranchAddOn[]) => {
        const newData = {
            ...data,
            serviceAddOns: [...list]
        };
        setData(newData);
        props?.onChange(newData);
    }
    return (
        <>
            <div className='categeory-details custom-scrollbar' style={{ maxHeight: '400px', overflowX: 'hidden' }} >
                <div className='row'>
                    <div className='col-4 border-right-grad'>
                        <div className='row'>
                            <div className='col-12'>
                                <div className='form-group'>
                                    <label>{props?.level?.name} </label>
                                    <i className='fa fa-info-circle ml-1' title={props?.level?.description}></i>
                                </div>
                                <div className='form-group'>
                                    <label>Letter Count: </label>
                                    <div className='f-11'>
                                        <input type='number' className='input-sm form-control ' value={data?.letterCount} onChange={(ev: any) => handleChange(ev.target.value, 'letterCount')} />
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <label>Cost($): </label>
                                    <div className='f-11'>
                                        <input type='number' className='input-sm form-control ' value={data?.cost} onChange={(ev: any) => handleChange(ev.target.value, 'cost')} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-8'>
                        <div className='row'>
                            <div className='col-12'>
                                <label>Add Ons</label>
                                <div>
                                    <CompanyCategoryLevelAddOnsComponent officeId={props?.officeId}
                                        addOns={props?.level?.serviceAddOns || []}
                                        onChange={onAddOnChanges}
                                        onDelete={props?.onAddOnDelete}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-12'>
                        <div className='h-line mb-2 mt-3'></div>
                    </div>
                </div>
            </div>
        </>
    )
}
