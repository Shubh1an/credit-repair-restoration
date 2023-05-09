import axios, { CancelTokenSource } from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import toastr from 'toastr';

import { addCustomerReferralAgents, updateCustomerReferralAgents } from '../../../../../../../actions/customers.actions';
import { IFranchiseAgent as IAgent } from '../../../../../../../models/interfaces/franchise';
import { ButtonComponent } from '../../../../../../../shared/components/button';
import { Messages } from '../../../../../../../shared/constants';

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        addCustomerReferralAgents,
        updateCustomerReferralAgents
    }, dispatch);
}

export const AddUpdateCustomerReferralComponent = connect(null, mapDispatchToProps)((props:
    {
        cid?: string, isAddMode: boolean, agents: IAgent[], agent?: IAgent | null,
        onSave?: any, addCustomerReferralAgents: any, updateCustomerReferralAgents: any
    }) => {

    const [axiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({} as unknown | IAgent);
    const [roles] = useState(['Loan Officer', 'Realtor'] as string[]);

    useEffect(() => {
        setFormData(props?.agent);
        return () => {
            if (axiosSource.cancel) {
                axiosSource.cancel(Messages.APIAborted);
            }
        }
    }, []);

    const handleChange = (evt: any) => {
        let value = evt.target.value;
        let newForm = (formData || {}) as IAgent;
        let propNames = evt.target.name?.split('.');
        if (propNames?.length == 2) {
            newForm = {
                ...newForm,
                [propNames[0]]: {
                    [propNames[1]]: value
                }
            };
        } else if (propNames?.length == 1) {
            newForm = {
                ...newForm,
                [propNames[0]]: value
            };
        }

        setFormData(newForm);
    }
    const onSave = () => {
        const ag = (formData as IAgent);
        if (!ag || !ag.id || !ag.customerRole) {
            toastr.warning('Please enter all mandatory(*) fields.');
            return;
        }
        setSaving(true);
        const promise$ = props?.isAddMode ? props.addCustomerReferralAgents(props?.cid, ag?.id, ag?.customerRole, axiosSource)
            : props.updateCustomerReferralAgents(props?.cid, ag?.id, ag?.customerRole, axiosSource);
        promise$.then((result: any) => {
            setSaving(false);
            toastr.success(props?.isAddMode ? 'Affiliate Agent added successfully!' : 'Affiliate Agent updated successfully!');
            props.onSave(true)

        }).catch((err: any) => {
            if (!axios.isCancel(err)) {
                setSaving(false);
                toastr.error(err?.response?.data);
            }
        })
    }
    return (
        <div className='add-update-agent'>
            <div className="row">
                <div className="col-3">
                    <div className="form-group">
                        <label className="text-orange-red">Agent*</label>
                        {
                            !props?.isAddMode
                                ?
                                <div>
                                    {(formData as IAgent)?.fullName || ''}
                                </div>
                                :
                                <select disabled={!props?.isAddMode} value={(formData as IAgent)?.id || ''} onChange={handleChange}
                                    name="id" className="form-control input-sm" required={true}>
                                    {props?.isAddMode && <option value={''}>-Select-</option>}
                                    {
                                        props?.agents?.map((item: IAgent, index: number) => <option key={index} value={item?.id}>{item?.fullName}</option>)
                                    }
                                </select>
                        }
                    </div>
                </div>
                <div className="col-3">
                    <div className="form-group">
                        <label className="text-orange-red">Role*</label>
                        <select value={(formData as IAgent)?.customerRole || ''} onChange={handleChange}
                            name="customerRole" className="form-control input-sm" required={true}>
                            {props?.isAddMode && <option value={''}>-Select-</option>}
                            {
                                roles?.map((item: string, index: number) => <option key={index} value={item}>{item}</option>)
                            }
                        </select>
                    </div>
                </div>
                <div className="col-3">
                    <div className="form-group">
                        <label>Telephone</label>
                        <div>
                            <span>{props?.isAddMode ? props?.agents?.find(x => x.id === (formData as IAgent)?.id)?.telephone : (formData as IAgent)?.telephone}</span>
                        </div>
                    </div>
                </div>
                <div className="col-3">
                    <div className="form-group">
                        <label>Cellphone</label>
                        <div>
                        <span>{props?.isAddMode ? props?.agents?.find(x => x.id === (formData as IAgent)?.id)?.cellPhone : (formData as IAgent)?.cellPhone}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-4 mb-4">
                <div className="col-12 d-flex justify-content-end">
                    <ButtonComponent text="Save Details" className="btn-primary" loading={saving} disabled={!formData || !(formData as IAgent)?.id || ! (formData as IAgent)?.customerRole} onClick={onSave} >
                        <i className="fa fa-floppy-o mr-2"></i>
                    </ButtonComponent>
                </div>
            </div>
        </div>
    );
});
