import React, { useState } from 'react';
// @ts-ignore
import confirm from 'reactstrap-confirm';
import toastr from 'toastr';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { useEffect } from 'react';

import { ButtonComponent } from '../../../../shared/components/button';
import { PasswordComponent } from '../../../../shared/components/password';
import { DashboardWidget } from '../../../dashboard/components/dashboard-widget';
import { updatePassword } from '../../../../actions/customers.actions';
import { ClientRoutesConstants, HTTP_ERROR_CODES, Messages, Variables } from '../../../../shared/constants';
import AuthService from '../../../../core/services/auth.service';
import { setLogout } from '../../../../actions/auth.actions';

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        updatePassword,
        setLogout
    }, dispatch);
}
export const ChangePasswordComponent = connect(null, mapDispatchToProps)((props: any) => {

    const [oldPassword, setOldPassword] = useState('' as string);
    const [newPassword, setNewPassword] = useState('' as string);
    const [confPassword, setConfPassword] = useState('' as string);
    const [minPassLength] = useState(Variables.MIN_PWD_LENGTH);
    const [axiosSource] = useState(axios.CancelToken.source());

    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    const [passwordValidations, setPasswordValidations] = useState({} as any);

    useEffect(() => {
        return () => {
            if (axiosSource.cancel) {
                axiosSource.cancel(Messages.APIAborted);
            }
        }
    }, [])
    const onChangePassword = () => {
        if(!passwordValidations.newpassword?.isValid) {
            toastr.warning('Please enter valid password.');
            return
        }
        if (!validatePassword()) {
            toastr.error('Passwords do not match!');
            return;
        }
        const { membershipId } = AuthService.getCurrentJWTPayload();
        setIsLoading(true);
        props?.updatePassword(membershipId, oldPassword, newPassword?.trim(), axiosSource)
            .then((result: any) => {
                setIsLoading(false);
                if (result) {
                    showAlertMessage('Congratulations!! Password changed successfully. You will be logged out from portal and get logged in with new credentials.', 'Password Changed');
                } else {
                    toastr.error(Messages.GenericError);
                }
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setIsLoading(false);
                    if (err.response.status === HTTP_ERROR_CODES.BADREQUEST) {
                        toastr.error('Old Password does not match.');
                    }
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
         switch (propName) {
             case 'oldpassword':  setOldPassword(value);
             break;
             case 'newpassword':  setNewPassword(value);
             break;
             case 'confimpassword':  setConfPassword(value);
             break;
         }        
    }
    const showAlertMessage = async (message: string, title: string | null) => {
        await confirm({
            title,
            message,
            confirmText: "OK",
            confirmColor: "primary",
            cancelText: null
        });
        setIsLoggedOut(true);
    }
    const validatePassword = (): boolean => {
        const pawdFilled = oldPassword && newPassword && newPassword === confPassword;
        if (pawdFilled && newPassword?.length >= minPassLength) {
            return true;
        }
        return false;
    }
    return (
        isLoggedOut ? <Redirect to={ClientRoutesConstants.logout} /> :
            <form className="position-relative">
                <DashboardWidget className="p-5" title={<><i className="fa fa-key mr-2"></i>Change Password</>}>
                    <div className="d-none">
                        <PasswordComponent name='fakepassword' defaultvalue={''} onChange={(e: any) => { }} />
                    </div>
                    <div className="row">
                        <div className="col-12 col-sm-2">
                            <div className="old-pass">
                                <label>Old Password: </label>
                            </div>
                        </div>
                        <div className="col-12 col-sm-3 form-group">
                            <PasswordComponent name='oldpassword' defaultvalue={oldPassword} onChange={handlePasswordChange} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-sm-2">
                            <label>New Password: </label>
                        </div>
                        <div className="col-12 col-sm-3 form-group">
                            <PasswordComponent name='newpassword' defaultvalue={newPassword} onChange={handlePasswordChange} />
                            {newPassword && newPassword?.length < minPassLength ? <div className="f-10 text-danger">Minimum password length: {minPassLength}</div> : null}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-sm-2">
                            <label>Confirm Password: </label>
                        </div>
                        <div className="col-12 col-sm-3 form-group">
                            <PasswordComponent name='confimpassword' disableStrengthMeter={true}  defaultvalue={confPassword} onChange={handlePasswordChange} />
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-12 col-sm-5 d-flex justify-content-end">
                            <ButtonComponent text={'Change Password'} disabled={!validatePassword()}
                                className="btn-primary w-100 w-sm-auto" loading={isLoading} onClick={onChangePassword} >
                                <i className="fa fa-floppy-o mr-2"></i>
                            </ButtonComponent>
                        </div>
                    </div>
                </DashboardWidget>
            </form>
    );
});