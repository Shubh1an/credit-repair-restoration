import axios, { CancelTokenSource } from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { loadFranchiseOfficeCategories } from '../../../../actions/franchise-services.actions';
import { IFranchAddOn, IFranchCategory, IFranchLevel, IMasterService } from '../../../../models/interfaces/franchise';
import { LargeSpinner } from '../../../../shared/components/large-spinner';
import { Messages } from '../../../../shared/constants';

import { CompanyCategoryComponent } from './company-category';

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        loadFranchiseOfficeCategories
    }, dispatch);
}
export const CompanyServiceCategory = connect(null, mapDispatchToProps)((
    props: {
        selectedService: IMasterService | null,
        fid: string,
        loadFranchiseOfficeCategories: any,
        onSave?: any
    }) => {

    const [axiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);
    const [isLoading, setIsLoading] = useState(false as boolean);
    const [categories, setCategories] = useState([] as IFranchCategory[]);

    useEffect(() => {
        return () => {
            if (axiosSource.cancel) {
                axiosSource.cancel(Messages.APIAborted);
            }
        }
    }, [])

    useEffect(() => {
        if (props?.selectedService && props?.fid) {
            loadCategories();
        }
    }, [props?.selectedService, props?.fid])


    const loadCategories = () => {
        setIsLoading(true);
        props?.loadFranchiseOfficeCategories(axiosSource, props?.fid, props?.selectedService?.serviceId)
            .then((result: any[]) => {
                setIsLoading(false);
                setCategories(result);
            })
            .catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setIsLoading(false);
                }
            })
    }
    const onChange = (data: IFranchCategory, index: number) => {
        let newList = [...categories];
        newList[index] = data;
        setCategories([...newList]);
    }
    const onCategorySave = () => {
        props?.onSave();
        loadCategories();
    }
    const onAddOnDelete = (addOnIndex: number, levelIndex: number, catIndex: number) => {
        let newList = JSON.parse(JSON.stringify(categories));
        (newList[catIndex]?.servicePricingLevels as any)[levelIndex]?.serviceAddOns?.splice(addOnIndex, 1);
        setCategories([...newList]);
    }
    return (
        <div className={'company-category pt-3 position-relative ' + (isLoading && !categories?.length ? 'p-5' : '')} >
            {
                isLoading && <LargeSpinner />
            }
            {
                categories?.length ?
                    <div className='office-all-categories'>
                        {
                            !!categories?.length && categories?.map((item, index) => {
                                return (
                                    <Fragment key={index}>
                                        <CompanyCategoryComponent officeId={props?.fid} category={item}
                                            onChange={(data: any) => onChange(data, index)}
                                            onSave={onCategorySave} onDelete={onCategorySave}
                                            onAddOnDelete={(adIndex: number, levelIndex: number) => onAddOnDelete(adIndex, levelIndex, index)} />
                                    </Fragment>
                                );
                            })
                        }
                    </div>
                    : props?.selectedService && !isLoading && <div className='text-center text-danger p-5 d-flex justify-centent-center align-items-center'>
                        <i>No Categories Available!</i>
                    </div>
            }
        </div>
    );
});
