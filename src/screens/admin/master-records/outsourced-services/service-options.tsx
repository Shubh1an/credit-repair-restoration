import axios, { CancelTokenSource } from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { removeCategoryLevelOptionForMaster } from '../../../../actions/franchise-services.actions';
import { IDataItem } from '../../../../models/interfaces/fast-edit-accounts';
import { IMasterServiceAdOns, IServiceOption } from '../../../../models/interfaces/franchise';
import { LargeSpinner } from '../../../../shared/components/large-spinner';
import { Messages } from '../../../../shared/constants';


const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        removeCategoryLevelOptionForMaster
    }, dispatch);
}


export const ServiceOptionsComponent = connect(null, mapDispatchToProps)((props: any) => {

    const [options, setOptions] = useState([] as IServiceOption[]);
    const [saving, setSaving] = useState(false as boolean);
    const [axiousSource] = useState(axios.CancelToken.source() as CancelTokenSource);


    useEffect(() => {
        return () => {
            if (axiousSource.cancel) {
                axiousSource.cancel(Messages.APIAborted);
            }
        }
    }, [])

    useEffect(() => {
        setOptions(props?.options || [defaultOption()]);
        props.onChange(props?.options || []);
    }, [props?.options])

    const defaultOption = () => {
        return { option: { id: '', value: '' } as IDataItem, description: '' } as IServiceOption;
    }
    const addMore = () => {
        setOptions([...options, defaultOption()]);
    }
    const removeOption = (index: number, servicePricingAddOnId?: string) => {
        if (servicePricingAddOnId) {
            remoreLevelFromDB(servicePricingAddOnId, index);
        } else {
            let arr = [...options];
            arr.splice(index, 1);
            setOptions(arr);
            props.onChange(arr);
        }
    }
    const remoreLevelFromDB = (servicePricingAddOnId: string, index: number) => {
        setSaving(true);
        props?.removeCategoryLevelOptionForMaster(servicePricingAddOnId, axiousSource)
            .then((result: boolean) => {
                setSaving(false);
                removeOption(index);
            })
            .catch((result: any) => {
                if (!axios.isCancel(result)) {
                    setSaving(false);
                }
            })
    }
    const onChangeId = (itemId: string, index: number) => {
        let arr = [...options];
        const selectedOption = { ...(props?.optionsList as IMasterServiceAdOns[])?.find(x => x.serviceAddOnId === itemId) } as IMasterServiceAdOns;
        arr[index].option = selectedOption;
        arr[index].description = selectedOption?.description;
        arr[index].cost = selectedOption?.cost;
        setOptions(arr);
        props.onChange(arr);
    }
    const onChangeDesc = (des: string, index: number) => {
        let arr = [...options];
        arr[index].description = des;
        setOptions(arr);
        props.onChange(arr);
    }
    const onChangeCost = (cost: number, index: number) => {
        let arr = [...options];
        arr[index].cost = cost;
        setOptions(arr);
        props.onChange(arr);
    }
    return (
        <div className='service-options'>
            <label>Add-On Options:</label>
            {
                options?.map((item, index) => (
                    <div className='option-item fade-in-component position-relative' key={index}>
                        {saving && <LargeSpinner />}
                        <div className='service-option d-flex align-items-center'>
                            <span className='pr-1 f-12 font-weight-bold'>{index + 1})</span>
                            <select value={item?.option?.serviceAddOnId || ''} onChange={(e: any) => onChangeId(e.target.value, index)} name='serviceAddOnId' className="form-control input-sm" required={true}>
                                <option value={''}>-Select-</option>
                                {
                                    props?.optionsList?.map((op: IMasterServiceAdOns, ind: number) => (
                                        <option value={op.serviceAddOnId} key={ind} title={op?.description}>{op?.name}</option>))
                                }
                            </select>
                            <i className='fa fa-times-circle-o ml-1 pointer' onClick={() => removeOption(index, item?.servicePricingAddOnId)}></i>
                        </div>
                        <div className='col-12 mt-2'>
                            <div className="form-group">
                                <label>Cost*</label>
                                <input type='number' className='form-control form-input' name='cost' value={item?.cost || ''} onChange={(ev) => { onChangeCost(+ev.target?.value, index) }} />
                            </div>
                        </div>
                        <div className='col-12'>
                            <div className='form-group'>
                                <label>Description</label>
                                <textarea onChange={(e: any) => onChangeDesc(e.target.value, index)} value={item?.description || ''} className="form-control" style={{ width: '100%' }} ></textarea>
                            </div>
                        </div>
                    </div>
                ))
            }
            <div className='controls-add text-center'>
                <span className='f-11 pointer' onClick={addMore}><i className='fa fa-plus-circle'></i> Add More Option</span>
            </div>
        </div>
    );
});
