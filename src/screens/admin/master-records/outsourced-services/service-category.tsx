import axios, { CancelTokenSource } from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { removeCategoryForMaster } from '../../../../actions/franchise-services.actions';
import { IDataItem } from '../../../../models/interfaces/fast-edit-accounts';
import { IServiceCategory, IServiceLevel, IServiceOption } from '../../../../models/interfaces/franchise';
import { LargeSpinner } from '../../../../shared/components/large-spinner';
import { Messages } from '../../../../shared/constants';
import { ServiceLevelsComponent } from './service-levels';


const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        removeCategoryForMaster
    }, dispatch);
}

export const ServiceCategoriesComponent = connect(null, mapDispatchToProps)((props: any) => {

    const [categories, setCategories] = useState([] as IServiceCategory[]);
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
        setCategories(props?.categories || [defaultCategory()]);
        props?.onChange(props?.categories);
    }, [props?.categories]);

    const defaultCategory = (): IServiceCategory => {
        return { levels: [{ options: [{ option: { id: '', value: '' } as IDataItem, description: '' } as IServiceOption] }] } as IServiceCategory;
    }
    const addMore = () => {
        setCategories([...categories, defaultCategory()]);
    }
    const removeCategory = (index: number, servicePricingId?: string) => {
        if (!servicePricingId) {
            let arr = [...categories];
            arr.splice(index, 1);
            setCategories(arr);
            props?.onChange(arr);
        } else {
            remoreCategoryFromDB(servicePricingId, index);
        }
    }
    const remoreCategoryFromDB = (servicePricingId: string, index: number) => {
        setSaving(true);
        props?.removeCategoryForMaster(servicePricingId, axiousSource)
            .then((result: boolean) => {
                setSaving(false);
                removeCategory(index);
            })
            .catch((result: any) => {
                if (!axios.isCancel(result)) {
                    setSaving(false);
                }
            })
    }
    const onChange = ({ name, value }: any, index: number) => {
        let arr = [...categories];
        (arr[index] as any)[name] = value;
        setCategories(arr);
        props?.onChange(arr);
    }
    const onLevelsChange = (levels: IServiceLevel[], index: number) => {
        let arr = [...categories];
        arr[index].levels = levels;
        setCategories(arr);
        props?.onChange(arr);
    }
    return (
        <div className='d-flex align-items-center categories-list custom-scrollbar position-relative'>
            <div className='categories d-flex align-items-start'>
                {
                    categories?.map((cate: IServiceCategory, index: number) => {
                        return (
                            <div className='categories-list-item row fade-in-component position-relative' key={index}>
                                {saving && <LargeSpinner />}
                                <div className='col-12 '>
                                    <div className='form-group position-relative'>
                                        <i className='fa fa-times-circle-o ml-1 pointer category-close' onClick={() => removeCategory(index, cate?.servicePricingId)}></i>
                                        <label>Category Name*</label>
                                        <div className='d-flex align-items-center'>
                                            <input type='text' name='category' className='form-control form-input' value={cate?.category || ""} onChange={(ev: any) => onChange(ev.target, index)} />
                                        </div>
                                    </div>
                                </div>
                                <div className='col-12'>
                                    <ServiceLevelsComponent onChange={(data: IServiceLevel[]) => onLevelsChange(data, index)} optionsList={props?.optionsList} levelsList={props?.levelsList} levels={cate?.levels || []} />
                                </div>
                            </div>)
                    })
                }

            </div>
            {
                !props?.processing &&
                <div className='controls-add text-center px-0 ml-4'>
                    <span className='f-11 pointer' onClick={addMore}><i className='fa fa-plus-circle fa-3x ad-category'></i></span>
                </div>
            }
        </div>
    );
});
