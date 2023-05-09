import axios, { CancelTokenSource } from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { removeCategoryLevelForMaster } from '../../../../actions/franchise-services.actions';
import { IDataItem } from '../../../../models/interfaces/fast-edit-accounts';
import { IMasterServiceLevel, IServiceLevel, IServiceOption } from '../../../../models/interfaces/franchise';
import { LargeSpinner } from '../../../../shared/components/large-spinner';
import { Messages } from '../../../../shared/constants';
import { ServiceOptionsComponent } from './service-options';


const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        removeCategoryLevelForMaster
    }, dispatch);
}

export const ServiceLevelsComponent = connect(null, mapDispatchToProps)((props: any) => {

    const [levels, setLevels] = useState([] as IServiceLevel[]);
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
        setLevels(props?.levels || []);
        props?.onChange(props?.levels);
    }, [props?.levels]);

    const defaultLevel = (): IServiceLevel => {
        return { options: [{ option: { id: '', value: '' } as IDataItem, description: '' } as IServiceOption] };
    }
    const addMore = () => {
        setLevels([...levels, defaultLevel()]);
    }
    const removeLevel = (index: number, servicePricingLevelId?: string) => {
        if (servicePricingLevelId) {
            remoreLevelFromDB(servicePricingLevelId, index);
        } else {
            let arr = [...levels];
            arr.splice(index, 1);
            setLevels(arr);
            props?.onChange(arr);
        }
    }
    const remoreLevelFromDB = (servicePricingLevelId: string, index: number) => {
        setSaving(true);
        props?.removeCategoryLevelForMaster(servicePricingLevelId, axiousSource)
            .then((result: boolean) => {
                setSaving(false);
                removeLevel(index);
            })
            .catch((result: any) => {
                if (!axios.isCancel(result)) {
                    setSaving(false);
                }
            })
    }
    const onFormChange = ({ value, name }: any, index: number) => {
        let arr = [...levels];
        (arr[index] as any)[name] = value;
        setLevels(arr);
        props?.onChange(arr);
    }
    const onLevelChange = (id: string, index: number) => {
        const obj = props?.levelsList?.find((x: IMasterServiceLevel) => x.serviceLevelId === id);
        onFormChange({ name: 'level', value: obj }, index);
        onFormChange({ name: 'cost', value: obj?.cost }, index);
        onFormChange({ name: 'letterCount', value: obj?.letterCount }, index);
        onFormChange({ name: 'description', value: obj?.description }, index);
    }
    const onOptionsChange = (data: IServiceOption[], index: number) => {
        let arr = [...levels];
        arr[index].options = data;
        setLevels(arr);
        props?.onChange(arr);
    }
    return (
        <div className='col-12 levels-list custom-scrollbar position-relative'>
            {
                levels?.map((level: IServiceLevel, index: number) => {
                    return (
                        <div className='row level-group levels-list-item position-relative fade-in-component' key={index}>
                            {saving && <LargeSpinner />}
                            <i className='fa fa-times-circle-o pointer close-level' onClick={() => removeLevel(index, level?.servicePricingLevelId)}></i>
                            <div className='col-12'>
                                <div className="form-group">
                                    <label>Level*</label>
                                    <select value={level?.level?.serviceLevelId} onChange={(ev) => onLevelChange(ev.target.value, index)} name='level' className="form-control input-sm" required={true}>
                                        <option value={''}>-Select-</option>
                                        {
                                            props?.levelsList?.map((op: IMasterServiceLevel, ind: number) => (
                                                <option value={op.serviceLevelId} key={ind} title={op?.description}>{op?.name}</option>))
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className='col-6 '>
                                <div className="form-group">
                                    <label>Letter(s)*</label>
                                    <input type='number' className='form-control form-input' name='letterCount' value={level?.letterCount || ''} onChange={(ev) => { onFormChange(ev.target, index) }} />
                                </div>
                            </div>
                            <div className='col-6 '>
                                <div className="form-group">
                                    <label>Cost*</label>
                                    <input type='number' className='form-control form-input' name='cost' value={level?.cost || ''} onChange={(ev) => { onFormChange(ev.target, index) }} />
                                </div>
                            </div>
                            <div className='col-12'>
                                <div className="form-group">
                                    <label>Description*</label>
                                    <textarea name='description' value={level?.description || ''} onChange={(ev) => { onFormChange(ev.target, index) }} className="form-control" style={{ width: '100%' }} ></textarea>
                                </div>
                            </div>
                            <div className='col-12'>
                                <ServiceOptionsComponent optionsList={props?.optionsList} options={level?.options || []} onChange={(data: IServiceOption[]) => onOptionsChange(data, index)} />
                            </div>
                        </div>
                    );
                })
            }
            <div className='controls-add text-center mb-3'>
                <span className='f-11 pointer' onClick={addMore}><i className='fa fa-plus-circle'></i> Add More Level</span>
            </div>
        </div>
    );
});
