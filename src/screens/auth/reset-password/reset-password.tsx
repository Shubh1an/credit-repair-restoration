import React, { useState, useEffect } from 'react';
import toastr, { options } from 'toastr';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import { Redirect, useParams } from 'react-router-dom';
import classnames from 'classnames';

import { ClientRoutesConstants, HTTP_ERROR_CODES, Messages, Variables } from '../../../shared/constants';
import { ButtonComponent } from '../../../shared/components/button';
import { PasswordComponent } from '../../../shared/components/password';
import { resetPassword, checkLinkExpiry } from '../../../actions/auth.actions';
import { setLogout } from '../../../actions/auth.actions';
import { LargeSpinner } from '../../../shared/components/large-spinner';



const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        resetPassword,
        checkLinkExpiry,
        setLogout
    }, dispatch);
}

const ResetPasswordComponent = connect(null, mapDispatchToProps)((props: any) => {

    const params = useParams() as { token: string, uid: string };
    const [newPassword, setNewPassword] = useState('' as string);
    const [confPassword, setConfPassword] = useState('' as string);
    const [minPassLength] = useState(Variables.MIN_PWD_LENGTH);
    const [axiosSource] = useState(axios.CancelToken.source());
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isRedirect, setIsRedirect] = useState(false);
    const [passwordValidations, setPasswordValidations] = useState({} as any);

    useEffect(() => {
        props.setLogout();
        checkLinkExpiry();
        return () => {
            if (axiosSource.cancel) {
                axiosSource.cancel(Messages.APIAborted);
            }
        }
    }, [])
    const onChangePassword = () => {
        if(!passwordValidations?.newpassword?.isValid) {
            toastr.warning('Please enter valid password.');
            return
        }
        if (!validatePassword()) {
            toastr.error('Passwords do not match!');
            return;
        }
        setIsLoading(true);
        props?.resetPassword({ userNameOrEmailId: params?.uid, token: params?.token, newPassword: newPassword?.trim() }, axiosSource)
            .then((result: any) => {
                setIsLoading(false);
                if (result) {
                    toastr.success('Congratulations!! Password changed successfully. Please login with your new Password.',
                        '', { closeDuration: 10000 });
                    setIsRedirect(true);
                } else {
                    toastr.error(Messages.GenericError);
                }
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setIsLoading(false);
                    if (err?.response?.status === HTTP_ERROR_CODES.BADREQUEST) {
                        toastr.error(err?.response?.data);
                    }
                }
            })
    }
    const checkLinkExpiry = () => {
        setIsVerifying(true);
        props?.checkLinkExpiry({ userNameOrEmailId: params?.uid, token: params?.token }, axiosSource)
            .then((result: any) => {
                setIsVerifying(false);
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setIsVerifying(false);
                    toastr.error(err?.response?.data, '', { closeDuration: 10000 });
                    setIsRedirect(true);
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
            case 'newpassword':  setNewPassword(value);
            break;
            case 'confimpassword':  setConfPassword(value);
            break;
        }
    }
    const validatePassword = (): boolean => {
        const pawdFilled = newPassword && newPassword === confPassword;
        if (pawdFilled && newPassword?.length >= minPassLength) {
            return true;
        }
        return false;
    }
    return (
        isRedirect ? <Redirect to={ClientRoutesConstants.login} /> :
            <div className="container-center">
                <div className="login-area">
                    <div className="card panel-custom">
                        <div className="card-heading custom_head">
                            <div className={classnames("view-header")}>
                                <div className="header-icon">
                                    <i className="pe-7s-refresh-2 mt-3"></i>
                                </div>
                                <div className="header-title" >
                                    <h3>Password Reset</h3>
                                    <small><strong>Enter your new password.</strong></small>
                                </div>
                            </div>
                        </div>

                        <div className="card-body card_body_text forget-card position-relative p-4">
                            {
                                isVerifying ? <LargeSpinner /> :
                                    <>
                                        <div className="d-none">
                                            <PasswordComponent name='fakepassword' defaultvalue={''} onChange={(e: any) => { }} />
                                        </div>
                                        <div className="row">
                                            <div className="col-5 pr-0">
                                                <label>New Password: </label>
                                            </div>
                                            <div className="col-7 pl-0 form-group">
                                                <PasswordComponent name='newpassword' defaultvalue={newPassword} onChange={handlePasswordChange} />
                                                {newPassword && newPassword?.length < minPassLength ? <div className="f-10 text-danger">Minimum password length: 5</div> : null}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-5 pr-0">
                                                <label>Confirm Password: </label>
                                            </div>
                                            <div className="col-7 pl-0 form-group form-inline">
                                                <PasswordComponent name='confimpassword' disableStrengthMeter={true} defaultvalue={confPassword} onChange={handlePasswordChange} />
                                            </div>
                                        </div>
                                        <div className="row mt-3">
                                            <div className="col-12 d-flex justify-content-end">
                                                <ButtonComponent text={'Reset Password'} disabled={!validatePassword()}
                                                    className="btn-primary" loading={isLoading} onClick={onChangePassword} >
                                                    <i className="fa fa-key mr-2"></i>
                                                </ButtonComponent>
                                            </div>
                                        </div>
                                    </>
                            }
                        </div>
                    </div>
                </div>
            </div >
    );
});

export default ResetPasswordComponent;