import axios, { CancelTokenSource } from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import toastr from 'toastr';
import { bindActionCreators } from 'redux';
// @ts-ignore
import confirm from 'reactstrap-confirm';

import { IFranchiseAgent } from '../../../../models/interfaces/franchise';
import { ButtonComponent } from '../../../../shared/components/button';
import { Messages } from '../../../../shared/constants';
import { reassignReferralOffices, getCurrentOfficeAgents } from '../../../../actions/referral.actions';

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        reassignReferralOffices,
        getCurrentOfficeAgents
    }, dispatch);
}
export const ReAssignOfficesComponent = connect(null, mapDispatchToProps)((props: any) => {

    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentId, setCurrentId] = useState(props?.currentId as string);
    const [assignedTo, setAssignedTo] = useState(props?.assignedTo as string);
    const [axiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);
    const [franchiseAgents, setFranchiseAgents] = useState([] as IFranchiseAgent[]);

    useEffect(() => {
        loadAgents();
        return () => {
            axiosSource?.cancel(Messages.APIAborted);
        }
    }, [])

    const loadAgents = () => {
        setLoading(true);
        props.getCurrentOfficeAgents(axiosSource)
            .then((result: any) => {
                setLoading(false);
                setCurrentId(result?.currentId);
                setFranchiseAgents(result?.agents);
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setLoading(false);
                    toastr.error(err?.response?.data);
                }
            })
    }
    const onSave = async () => {
        if (!currentId || !assignedTo) {
            toastr.warning('Please enter the Company Agent to be assigned.');
            return;
        }
        let result = await confirm({
            title: 'Re-assign Confirm ?',
            message: "Are you sure you want to reassign all referral offices this Company Agent?",
            confirmText: "YES",
            confirmColor: "danger",
            cancelColor: "link text-secondary"
        });
        if (result) {
            setSaving(true);
            const promise$ = props.reassignReferralOffices(currentId, assignedTo, axiosSource);
            promise$.then((result: string) => {
                setSaving(false);
                toastr.success('All Affiliate Offices Assigned to ' + franchiseAgents?.find(x => x.id == assignedTo)?.fullName + ' successfully!');
                props.onSave && props.onSave();
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setSaving(false);
                    toastr.error(err?.response?.data);
                }
            })
        }
    }
    return (
        <div className='reasign-offices pt-4'>
            <div className='row'>
                <div className='col-12 col-sm-2 '></div>
                <div className='col-12 col-sm-7 '>
                    <div className="form-group ">
                        <label >Currently Assigned To:</label>
                        <select value={currentId || ''} onChange={e => setCurrentId(e.target.value)}
                            disabled={loading} name="currentId" className="form-control input-sm  w-100 " required={true}>
                            {
                                franchiseAgents?.map((item: IFranchiseAgent, index: number) => <option key={index} value={item?.id}>{item?.fullName}</option>)
                            }
                        </select>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-12 col-sm-2 '></div>
                <div className='col-12 col-sm-7 '>
                    <div className="form-group">
                        <label className='pr-3 text-orange-red'>Re-assign To:*</label>
                        <select value={assignedTo || ''} onChange={e => setAssignedTo(e.target.value)}
                            disabled={loading} name="assignedTo" className="form-control input-sm w-100 " required={true}>
                            <option value={''}>-Select-</option>
                            {
                                franchiseAgents?.filter(x => x.id !== currentId)?.map((item: IFranchiseAgent, index: number) => <option key={index} value={item?.id}>{item?.fullName}</option>)
                            }
                        </select>
                    </div>
                </div>
            </div>
            <div className='row mt-5 mb-2'>
                <div className='col-12 col-sm-3 '></div>
                <div className='col-12 col-sm-6 d-flex flex-column flex-sm-row justify-content-end'>
                    <ButtonComponent text="Cancel" className="btn-link w-100 w-sm-auto" onClick={props?.onClose}></ButtonComponent>
                    <ButtonComponent text="Submit" disabled={loading} className="btn-primary mt-2 mt-sm-0 w-100 w-sm-auto" loading={saving} onClick={onSave} >
                        <i className="fa fa-exchange mr-2"></i>
                    </ButtonComponent>
                </div>
            </div>
        </div>
    );
});
