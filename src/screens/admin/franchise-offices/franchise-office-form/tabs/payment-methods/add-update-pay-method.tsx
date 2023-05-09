import axios, { CancelTokenSource } from 'axios';
import React, { useState } from 'react';
import toastr from 'toastr';
import { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


import { ButtonComponent } from '../../../../../../shared/components/button';
import { Messages } from '../../../../../../shared/constants';
import { IFranchisePayments } from '../../../../../../models/interfaces/franchise';
import { LargeSpinner } from '../../../../../../shared/components/large-spinner';
import { Checkbox } from '../../../../../../shared/components/checkbox';
import {
    updateFranchisePaymentMethod, createFranchisePaymentMethod,
} from '../../../../../../actions/franchise.actions';

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        updateFranchisePaymentMethod,
        createFranchisePaymentMethod,
    }, dispatch);
}
export const AddUpdateFranchisePaymentMethods = connect(null, mapDispatchToProps)((props: {
    isAddMode?: boolean,
    payment: IFranchisePayments | unknown,
    createFranchisePaymentMethod: any,
    updateFranchisePaymentMethod: any,
    onSave: () => void,
    officeId?: string
}) => {

    const [saving, setSaving] = useState(false);
    const [axiosSource, setAxiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);
    const [formData, setFormData] = useState({} as unknown | IFranchisePayments);

    useEffect(() => {
        setFormData(props.payment || {});
    }, [props.payment, props.isAddMode])

    useEffect(() => {
        return () => {
            axiosSource?.cancel(Messages.APIAborted);
        }
    }, [])

    const handleChange = (evt: any) => {
        const value = evt.target.value;
        const newForm = (formData || {}) as IFranchisePayments;
        setFormData({
            ...newForm,
            [evt.target.name]: value
        });
    }
    const onSave = () => {
        setSaving(true);
        const promise$ = props?.isAddMode ? props.createFranchisePaymentMethod(formData, props?.officeId, axiosSource)
            : props.updateFranchisePaymentMethod(formData, props?.officeId, axiosSource);
        promise$.then((result: string) => {
            setSaving(false);
            toastr.success(result);
            props.onSave();
        }).catch((err: any) => {
            if (!axios.isCancel(err)) {
                setSaving(false);
                toastr.error(err?.response?.data);
            }
        })
    }
    return (
        <div className="add-edit-fr-agent pt-3 position-relative">
            <form className="top-form" autoComplete="off">
                <div className="row">
                    <div className="col-12 col-sm-2"></div>
                    <div className="col-12 col-sm-4">
                        <div className="form-group">
                            <label className="text-orange-red">Payment Method Name*</label>
                            <input type="text" maxLength={255} autoFocus={true} onChange={handleChange} value={(formData as IFranchisePayments)?.name || ''} name="name" className="form-control" placeholder="Enter Service Name" required={true} />
                        </div>
                    </div>
                    <div className="col-12 col-sm-4">
                        <div className="form-group">
                            <label className="text-orange-red">Flat Fee($)*</label>
                            <input type="tel" onChange={handleChange} value={(formData as IFranchisePayments)?.flatFee || ''} name="flatFee" className="form-control" placeholder="Enter Flat Fee" required={true} />
                        </div>
                    </div>

                </div>
                <div className="row">
                    <div className="col-12 col-sm-2"></div>
                    <div className="col-12 col-sm-4">
                        <div className="form-group">
                            <label className="text-orange-red">Percent Fee(%)*</label>
                            <input type="tel" onChange={handleChange} value={(formData as IFranchisePayments)?.rawPercentFee || ''} name="rawPercentFee" className="form-control" placeholder="Enter Percent Fee" required={true} />
                        </div>
                    </div>
                </div>
            </form>
            <div className="row mt-4 mb-4">
                <div className="col-12 col-sm-2"></div>
                <div className="col-12 col-sm-8 d-flex justify-content-end">
                    <ButtonComponent text="Save Details" disabled={saving || 
                    !(formData as IFranchisePayments)?.name || 
                        !((formData as IFranchisePayments)?.flatFee && (formData as IFranchisePayments)?.rawPercentFee)} className="btn-primary w-100 w-sm-auto" loading={saving} onClick={onSave} >
                        <i className="fa fa-floppy-o mr-2"></i>
                    </ButtonComponent>
                </div>
            </div>
        </div>
    );
});