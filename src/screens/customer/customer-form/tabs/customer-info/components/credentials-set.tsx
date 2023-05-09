import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import toastr from 'toastr';

import { DashboardWidget } from '../../../../../dashboard/components/dashboard-widget';
import { updatePassword, updateUserName } from '../../../../../../actions/customers.actions';
import { LargeSpinner } from '../../../../../../shared/components/large-spinner';
import { ICustomerFullDetails } from '../../../../../../models/interfaces/customer-view';
import { Messages } from '../../../../../../shared/constants';
import { PasswordComponent } from '../../../../../../shared/components/password';


const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        updateUserName,
        updatePassword
    }, dispatch);
}
export const CredentialsSetComponent = connect(null, mapDispatchToProps)((props: any) => {

    const [editUName, setEditUName] = useState(false);
    const [editUPass, setEditUPass] = useState(false);
    const [isCredChanging, setisCredChanging] = useState(false);
    const [axiosSource] = useState(axios.CancelToken.source());
    const [formData, setFormData] = useState({} as ICustomerFullDetails);
    const [newUName, setNewUName] = useState('');
    const [newUPass, setNewUPass] = useState('');
    const [passwordValidations, setPasswordValidations] = useState({} as any);

    useEffect(() => {
        return () => {
            axiosSource?.cancel(Messages.APIAborted);
        }
    }, []);

    useEffect(() => {
        if (props?.customer) {
            setFormData(props?.customer);
        }
    }, [props?.customer]);

    const onUNameSave = () => {
        setisCredChanging(true);
        props?.updateUserName(formData?.id, formData?.userName, newUName?.trim(), axiosSource)
            .then((result: any) => {
                setisCredChanging(false);
                if (result) {
                    toastr.success('Username updated successfully!');
                    setEditUName(false);
                    setFormData({
                        ...formData,
                        userName: newUName?.trim()
                    });
                } else {
                    toastr.error('User name already exists. Please select a different username.');
                }
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setisCredChanging(false);
                    toastr.error(Messages.GenericError);
                }
            })
    }
    const onUPasswordSave = () => {
        if(!passwordValidations.newpassword?.isValid) {
            toastr.warning('Please enter valid password.');
            return;
        }
        setisCredChanging(true);
        props?.updatePassword(formData?.membershipId, formData?.password, newUPass?.trim(), axiosSource)
            .then((result: any) => {
                setisCredChanging(false);
                if (result) {
                    toastr.success('Password updated successfully!');
                    setEditUPass(false);
                    setFormData({
                        ...formData,
                        password: newUPass?.trim()
                    });
                } else {
                    toastr.error(Messages.GenericError);
                }
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setisCredChanging(false);
                    toastr.error(Messages.GenericError);
                }
            })
    }
    const handlePasswordChange = ({event, isValid, strength}: any) => {
        const value = event.target.value;
        const propName = event.target.name;
         setPasswordValidations({
             ...passwordValidations,
             [propName]: {
                    value,
                    isValid,
                    strength
             }
         });
         handleChange(event);     
    }
    const handleChange = (evt: any) => {
        const value = evt.target.value;
        const propName = evt.target.name;
        setFormData({
            ...formData,
            [evt.target.name]: value
        });
        if(propName === 'newpassword')  {
            setNewUPass(value)
        }
    }
    return (
        <DashboardWidget title={"Credentials"} allowFullscreen={false} allowMaximize={true} allowMinimize={true} reload={false} >
            <form className="position-relative">

                {isCredChanging ? <LargeSpinner /> : null}

                <input autoComplete="off" name="hidden" type="text" style={{ display: 'none' }} />
                <div className="row pt-2">
                    <div className="col-9 col-sm-3">
                        <div className="form-group">
                            <label>User Name</label>
                            <input autoComplete="new-password" disabled={true} readOnly={true} value={formData?.userName || ''} onChange={handleChange} name="uName" type="text" className="form-control" placeholder="User Name" required={true} />
                        </div>
                    </div>
                    {
                        !editUName && !props?.isReadOnly &&
                        <div className="col-3 col-sm-1 pl-0 d-flex justify-content-start align-items-center pt-2">
                            <span className="text-danger change-button font-weight-bold" onClick={() => setEditUName(true)}>Change</span>
                        </div>
                    }
                    {
                        !!editUName &&
                        <>
                            <div className="col-9 col-sm-3 pl-0">
                                <div className="form-group">
                                    <label className="text-orange-red">New Username*</label>
                                    <input onChange={e => setNewUName(e.target.value)} type="text" name="newuserName" className="form-control" placeholder="Enter New Username" required={true} />
                                </div>
                            </div>
                            <div className="col-3 col-sm-1 pl-0 d-flex justify-content-between align-items-center pt-2">
                                <span className="text-danger change-button font-weight-bold" onClick={onUNameSave}>Save</span>
                                <span className="text-secondary cancel-button" onClick={() => setEditUName(false)}>Cancel</span>
                            </div>
                        </>
                    }
                </div>
                <div className="row pt-2">
                    <div className="col-9 col-sm-3">
                        <div className="form-group">
                            <label>User Password</label>
                            <PasswordComponent name='pass' defaultvalue={formData?.password || ''} onChange={handlePasswordChange}
                                disabled={true} readOnly={true} />
                        </div>
                    </div>
                    {
                        !editUPass && !props?.isReadOnly &&
                        <div className="col-3 col-sm-1 pl-0 d-flex justify-content-start align-items-center pt-2">
                            <span className="text-danger change-button font-weight-bold" onClick={() => setEditUPass(true)}>Change</span>
                        </div>
                    }
                    {
                        !!editUPass &&
                        <>
                            <div className="col-9 col-sm-3 pl-0">
                                <div className="form-group ">
                                    <label className="text-orange-red">New Password*</label>
                                    <PasswordComponent name='newpassword' defaultvalue={''} onChange={handlePasswordChange} />
                                </div>
                            </div>
                            <div className="col-3 col-sm-1 pl-0 d-flex justify-content-between align-items-center pt-2">
                                <span className="text-danger change-button font-weight-bold" onClick={onUPasswordSave}>Save</span>
                                <span className="text-secondary cancel-button" onClick={() => setEditUPass(false)}>Cancel</span>
                            </div>
                        </>
                    }
                </div>
            </form>
        </DashboardWidget>
    );
})