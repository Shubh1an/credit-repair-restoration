import React, { useEffect, useState } from 'react'
import { IFranchAddOn } from '../../../../models/interfaces/franchise'

export const CompanyCategoryLevelAddOnsComponent = (props: {
    officeId: string, addOns: IFranchAddOn[], onChange?: any,
    onDelete: any
}) => {
    const [list, setList] = useState([] as IFranchAddOn[]);

    useEffect(() => {
        setList([...(props?.addOns || [])]);
    }, [props?.addOns])

    const handleChange = (value: number, index: number) => {
        let newList = [...list];
        newList[index].cost = value;
        props?.onChange(newList);
    }
    return (
        <div className="table-responsive list-scrollable custom-scrollbar" style={{ maxHeight: '300px' }}>
            <table className="dataTableCustomers table table-striped table-hover">
                <thead className="back_table_color">
                    <tr className="secondary">
                        <th style={{ width: '60%' }}>Name</th>
                        <th style={{ width: '35%' }}>Cost($)</th>
                        <th style={{ width: '5%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        list?.map((item, index) =>
                            <tr key={index}>
                                <td>
                                    {item?.name}
                                    <i className='fa fa-info-circle ml-1' title={item?.description}></i>
                                </td>
                                <td style={{ paddingLeft: '0px', paddingRight: '0px' }}>
                                    <div className='form-group mb-0'>
                                        <div className='f-11'>
                                            <input type='number'
                                                className='form-control input-sm'
                                                onChange={(ev: any) => handleChange(ev.target.value, index)}
                                                value={item?.cost} />
                                        </div>
                                    </div>
                                </td>
                                <td >
                                    <i className='fa fa-trash text-danger pointer' onClick={() => props?.onDelete(index)}></i>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}

export default CompanyCategoryLevelAddOnsComponent