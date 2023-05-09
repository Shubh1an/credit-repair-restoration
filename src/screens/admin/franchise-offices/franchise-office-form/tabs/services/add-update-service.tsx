import axios, { CancelTokenSource } from 'axios';
import React, { useState } from 'react';
import toastr from 'toastr';
import { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


import { ButtonComponent } from '../../../../../../shared/components/button';
import { Messages } from '../../../../../../shared/constants';
import { IFranchiseService, IFranchiseOffice } from '../../../../../../models/interfaces/franchise';
import { getFranchiseOffices, updateFranchiseService, createFranchiseService, getFranchiseAgentRoles } from '../../../../../../actions/franchise.actions';
import { Checkbox } from '../../../../../../shared/components/checkbox';

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getFranchiseOffices,
        createFranchiseService,
        updateFranchiseService,
    }, dispatch);
}
export const AddUpdateFranchiseService = connect(null, mapDispatchToProps)((props: {
    isAddMode?: boolean,
    service: IFranchiseService | unknown,
    getFranchiseOffices: any,
    createFranchiseService: any,
    updateFranchiseService: any,
    onSave: () => void,
    officeId?: string
}) => {

    const [saving, setSaving] = useState(false);
    const [axiosSource, setAxiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);
    const [formData, setFormData] = useState({} as unknown | IFranchiseService);

    useEffect(() => {
        setFormData(props.service || {});
    }, [props.service, props.isAddMode])

    useEffect(() => {
        return () => {
            axiosSource?.cancel(Messages.APIAborted);
        }
    }, [])

    const handleChange = (evt: any) => {
        const value = evt.target.value;
        const newForm = (formData || {}) as IFranchiseService;
        setFormData({
            ...newForm,
            [evt.target.name]: value
        });
    }
    const onSave = () => {
        const serv = (formData as IFranchiseService);
        if (!serv || !serv.name || !serv.cost) {
            toastr.warning('Please enter all mendatory(*) fields.');
            return;
        }
        setSaving(true);
        const promise$ = props?.isAddMode ? props.createFranchiseService({ ...(formData as any), franchiseOfficeId: props?.officeId }, axiosSource)
            : props.updateFranchiseService(formData, props?.officeId, axiosSource);
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
                            <label className="text-orange-red">Service Name*</label>
                            <input type="text" autoFocus={true} onChange={handleChange} value={(formData as IFranchiseService)?.name || ''} name="name" className="form-control" placeholder="Enter Service Name" required={true} />
                        </div>
                    </div>
                    <div className="col-12 col-sm-4">
                        <div className="form-group">
                            <label className="text-orange-red">Cost($)*</label>
                            <input type="tel" onChange={handleChange} value={(formData as IFranchiseService)?.cost || ''} name="cost" className="form-control" placeholder="Enter Cost" required={true} />
                        </div>
                    </div>

                </div>
                <div className="row">
                    <div className="col-12 col-sm-2"></div>
                    <div className="col-12 col-sm-4">
                        <div className="form-group">
                            <label>&nbsp;</label>
                            <Checkbox text="Allow Cost Override" checked={(formData as IFranchiseService)?.canOverride || false} onChange={
                                (data: any) => handleChange({
                                    target: {
                                        value: data.checked,
                                        name: 'canOverride'
                                    }
                                })} />
                        </div>
                    </div>
                </div>
            </form>
            <div className="row mt-4 mb-4">
                <div className="col-12 col-sm-2"></div>
                <div className="col-12 col-sm-8 d-flex justify-content-end">
                    <ButtonComponent text="Save Details" disabled={saving} className="btn-primary w-100 w-sm-auto" loading={saving} onClick={onSave} >
                        <i className="fa fa-floppy-o mr-2"></i>
                    </ButtonComponent>
                </div>
            </div>
        </div>
    );
});