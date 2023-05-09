import axios, { CancelTokenSource } from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import toastr from 'toastr';
// @ts-ignore
import confirm from 'reactstrap-confirm';

import { removeAddOnFromOffice, removeCategoryFromOffice, saveCatogoryForFranchiseOffice } from '../../../../actions/franchise-services.actions';
import { IFranchAddOn, IFranchCategory, IFranchLevel } from '../../../../models/interfaces/franchise';
import { ButtonComponent } from '../../../../shared/components/button';
import { Messages } from '../../../../shared/constants';
import { DashboardWidget } from '../../../dashboard/components/dashboard-widget';
import { CompanyCategoryLevelComponent } from './company-category-level';

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        saveCatogoryForFranchiseOffice,
        removeCategoryFromOffice,
        removeAddOnFromOffice,
    }, dispatch);
}
export const CompanyCategoryComponent = connect(null, mapDispatchToProps)((props: {
    category: IFranchCategory,
    officeId: string,
    onChange?: any,
    onSave?: any,
    saveCatogoryForFranchiseOffice: any,
    removeCategoryFromOffice: any,
    removeAddOnFromOffice: any,
    onDelete?: any,
    onAddOnDelete?: any
}) => {
    const [data, setData] = useState({} as IFranchCategory);
    const [saving, setSaving] = useState(false as boolean);
    const [deleting, setDeleting] = useState(false as boolean);
    const [addOnDeleting, setAddOnDeleting] = useState(false as boolean);
    const [axiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);

    useEffect(() => {
        return () => {
            if (axiosSource?.cancel) {
                axiosSource.cancel(Messages.APIAborted);
            }
        }
    }, []);

    useEffect(() => {
        setData({ ...(props?.category || {}) });
        setSaving(false);
    }, [props?.category]);

    const onCategorySelect = () => {
        setSaving(true);
        const payload = {
            franchiseOfficeId: props?.officeId,
            servicePricings: [data]
        };
        props?.saveCatogoryForFranchiseOffice(payload, axiosSource)
            .then((added: boolean) => {
                setSaving(false);
                props?.onSave();
                toastr.success('Category Added Successfully!');
            })
            .catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setSaving(false);
                    toastr.error(Messages.GenericError);
                }
            })
    }

    const onCategoryDelete = async () => {
        let result = await confirm({
            title: 'Remove Category',
            message: "Are you sure you want to remove this Category?",
            confirmText: "YES",
            confirmColor: "danger",
            cancelColor: "link text-secondary"
        });
        if (result) {
            setDeleting(true);
            props?.removeCategoryFromOffice(data?.franchiseOfficeServicePricingId, axiosSource)
                .then((added: boolean) => {
                    setDeleting(false);
                    props?.onDelete();
                    toastr.success('Category Removed Successfully!');
                })
                .catch((err: any) => {
                    if (!axios.isCancel(err)) {
                        setDeleting(false);
                        toastr.error(Messages.GenericError);
                    }
                })
        }
    }
    const onAddOnDelete = async (addOnIndex: number, levelIndex: number) => {
        if (data?.isSelected) {
            let result = await confirm({
                title: 'Remove AddOn',
                message: "Are you sure you want to remove this AddOn?",
                confirmText: "YES",
                confirmColor: "danger",
                cancelColor: "link text-secondary"
            });
            if (result) {
                setAddOnDeleting(true);
                props?.removeAddOnFromOffice((
                    (data?.servicePricingLevels as any)[levelIndex].serviceAddOns as any)[addOnIndex]?.franchiseOfficeServicePricingAddOnId, axiosSource)
                    .then((added: boolean) => {
                        setAddOnDeleting(false);
                        props?.onAddOnDelete(addOnIndex, levelIndex);
                        toastr.success('Category Removed Successfully!');
                    })
                    .catch((err: any) => {
                        if (!axios.isCancel(err)) {
                            setAddOnDeleting(false);
                            toastr.error(Messages.GenericError);
                        }
                    })
            }
        } else {
            props?.onAddOnDelete(addOnIndex, levelIndex);
        }
    }
    const onLevelUpdate = (level: IFranchLevel, index: number) => {
        let newList = [...(data.servicePricingLevels || [])];
        newList[index] = level;
        const newData = {
            ...data,
            servicePricingLevels: [...newList]
        };
        setData(newData);
        props?.onChange(newData);
    }
    return (
        <DashboardWidget title={props?.category?.categoryName} hideHeader={false} allowFullscreen={false} allowMaximize={false} allowMinimize={false} reload={false} >
            {
                data?.servicePricingLevels?.map((item, index) => {
                    return (
                        <CompanyCategoryLevelComponent level={item} officeId={props?.officeId} key={index}
                            onChange={(level: IFranchLevel) => onLevelUpdate(level, index)}
                            onAddOnDelete={(addInIndex: number) => onAddOnDelete(addInIndex, index)} />
                    );
                })
            }
            <div className='row'>
                {
                    data?.isSelected ?
                        <div className='col-12 d-flex justify-content-between mt-2'>
                            <ButtonComponent text="Remove" loading={deleting} className=" btn-danger" onClick={onCategoryDelete} >
                                <i className="fa fa-trash mr-2"></i>
                            </ButtonComponent>
                            <ButtonComponent text="Update" className=" btn-success" loading={saving} onClick={onCategorySelect} >
                                <i className="fa fa-check mr-2"></i>
                            </ButtonComponent>
                        </div>
                        :
                        <div className='col-12 text-right mt-2'>
                            <ButtonComponent text="Add" className=" btn-primary" loading={saving} onClick={onCategorySelect} >
                                <i className="fa fa-plus mr-2"></i>
                            </ButtonComponent>
                        </div>
                }
            </div>
        </DashboardWidget>
    )
});
