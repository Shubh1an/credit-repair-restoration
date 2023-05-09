import axios, { CancelTokenSource } from 'axios';
import React, { useState } from 'react';
import toastr from 'toastr';
import InputMask from 'react-input-mask';
import { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// @ts-ignore
import confirm from 'reactstrap-confirm';


import { ButtonComponent } from '../../../../../../shared/components/button';
import { Messages } from '../../../../../../shared/constants';
import { IFranchiseAgent, IReferralOffice } from '../../../../../../models/interfaces/franchise';
import {
    getReferralOffices, createUpdateReferralAgent, changeReferralAgentPasword, getReferralAgentDetails,
    resendFollowUpAgentEmail, sendWelcomeEmailtoAgent, deleteReferralAgent
} from '../../../../../../actions/referral.actions';
import { PasswordComponent } from '../../../../../../shared/components/password';
import AuthService from '../../../../../../core/services/auth.service';
import { EnumComponentMode, EnumScreens } from '../../../../../../models/enums';
import { CommonUtils } from '../../../../../../utils/common-utils';

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        createUpdateReferralAgent,
        changeReferralAgentPasword,
        getReferralAgentDetails,
        getReferralOffices,
        resendFollowUpAgentEmail,
        sendWelcomeEmailtoAgent,
        deleteReferralAgent
    }, dispatch);
}

const mapStateToProps = (state: any) => {
    return {
        AuthRules: AuthService.getScreenOject(state.sharedModel?.AuthRules, EnumScreens.ViewReferralAgents)
    };
}
export const AddUpdateReferralAgent = connect(mapStateToProps, mapDispatchToProps)((props: any) => {

    const [saving, setSaving] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [sendingWelcomeEmail, setSendingWelcomeEmail] = useState(false);
    const [sendingFollowUp, setSendingFollowUp] = useState(false);
    const [referralOffices, setReferralOffices] = useState([] as IReferralOffice[]);
    const [axiosSource, setAxiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);
    const [formData, setFormData] = useState({} as unknown | IFranchiseAgent);
    const [passwordValidations, setPasswordValidations] = useState({} as any);

    useEffect(() => {
        const officeId = (props?.officeId || props?.agent?.office?.id);
        setFormData({ ...props?.agent, officeId });
    }, [props?.agent]);

    useEffect(() => {
        getReferralOffices();
        if (!props?.isAddMode && !props?.doNotloadDetails) {
            getReferralAgentDetails();
        }
        return () => {
            axiosSource?.cancel(Messages.APIAborted);
        }
    }, [])

    const handleChange = (evt: any) => {
        const value = evt.target.value;
        let newForm = (formData || {}) as IFranchiseAgent;
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
    const getReferralOffices = () => {
        setLoading(true);
        props.getReferralOffices(axiosSource)
            .then((result: IReferralOffice[]) => {
                setLoading(false);
                setReferralOffices(result);
            })
            .catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setLoading(false);
                    toastr.error(err?.response?.data || Messages.GenericError);
                }
            })
    }
    const getReferralAgentDetails = () => {
        setLoading(true);
        props.getReferralAgentDetails((props?.agent as IFranchiseAgent)?.id, axiosSource)
            .then((result: IFranchiseAgent) => {
                setLoading(false);
                const officeId = ((formData as IFranchiseAgent)?.officeId || result?.office?.id);
                setFormData({ ...result, officeId });
            })
            .catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setLoading(false);
                    toastr.error(err?.response?.data || Messages.GenericError);
                }
            })
    }
    const onSave = () => {
        const agent = (formData as IFranchiseAgent);
        const validResult =
            !agent ||
            !agent.firstName ||
            !agent.email ||
            (!props?.isAddMode && !agent.password) ||
            (!props?.isAddMode &&
                agent.password &&
                !passwordValidations.password?.isValid) ||
            (props?.isAddMode &&
                (!agent?.password || agent?.password !== agent?.confirmPassword)) ||
                !(agent.officeId || props.officeId) ||
            !agent.roleName;

        if (validResult) {
          const options = {
            screenName: EnumScreens.ViewReferralOfficesAgentsTab,
            screenMode: props?.isAddMode
              ? EnumComponentMode.Add
              : EnumComponentMode.Edit,
          };
          let cloneObj = { ...agent, props, ...passwordValidations };
          const msg = CommonUtils.formErrors(cloneObj, options);
          if (msg) {
            toastr.warning(msg);
            return;
          }
        }
        setSaving(true);
        const newFormData = {
            ...agent,
            office: {
                ...agent.office,
                id: agent.officeId || props?.officeId
            },
            userName: agent.email
        };
        const promise$ = props.createUpdateReferralAgent(newFormData, axiosSource);
        promise$.then((result: any) => {
            setSaving(false);
            if (typeof (result) === 'string') {
                toastr.error(result);
            } else {
                toastr.success(result?.message);
                props.onSave && props.onSave(result?.id);
            }
        }).catch((err: any) => {
            if (!axios.isCancel(err)) {
                setSaving(false);
                toastr.error(err?.response?.data);
            }
        })
    }
    const onChangePassword = () => {
        const agent = (formData as IFranchiseAgent);
        if (!agent.password) {
            toastr.warning('Please enter password');
            return;
        }
        if (!agent.confirmPassword) {
            toastr.warning('Please enter confirm password');
            return;
        }
        if(!passwordValidations?.password?.isValid) {
            toastr.warning('Please enter valid password.');
            return
        }
        if (!props?.isAddMode && (!agent?.password || agent?.password !== agent?.confirmPassword)) {
            toastr.error('Passwords do not match!');
            return;
        }

        setSavingPassword(true);
        const newFormData = {
            newPassword: agent?.password,
            referralAgentMembershipId: agent?.membershipId
        };
        const promise$ = props.changeReferralAgentPasword(newFormData, axiosSource);
        promise$.then((result: any) => {
            setSavingPassword(false);
            toastr.success(result);
            props.onPasswordChange && props.onPasswordChange();
        }).catch((err: any) => {
            if (!axios.isCancel(err)) {
                setSavingPassword(false);
                toastr.error(err?.response?.data);
            }
        })
    }
    const onResendWelcomeEmail = () => {
        setSendingWelcomeEmail(true);
        props.sendWelcomeEmailtoAgent(props?.agent?.id, axiosSource)
            .then((result: any) => {
                setSendingWelcomeEmail(false);
                if (result) {
                    toastr.success('Welcome email sent successfully!');
                } else {
                    toastr.error('Email not sent!, Email id is not present for this agent in the system.');
                }
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setSendingWelcomeEmail(false);
                    toastr.error(err?.response?.data);
                }
            })
    }
    const onFollowUpEmail = () => {
        setSendingFollowUp(true);
        props.resendFollowUpAgentEmail(props?.agent?.id, axiosSource)
            .then((result: any) => {
                setSendingFollowUp(false);
                toastr.success(result);
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setSendingFollowUp(false);
                    toastr.error(err?.response?.data);
                }
            })
    }
    const onDelete = async () => {
        let result = await confirm({
            title: 'Remove Record',
            message: "Are you sure you want to delete this Affiliate Agent?",
            confirmText: "YES",
            confirmColor: "danger",
            cancelColor: "link text-secondary"
        });
        if (result) {
            setDeleting(true);
            props.deleteReferralAgent(props?.agent, props?.agent?.office?.id, axiosSource)
                .then((result: any) => {
                    setDeleting(false);
                    toastr.success(result);
                    if (props.onDelete) {
                        props.onDelete();
                    }
                }).catch((err: any) => {
                    if (!axios.isCancel(err)) {
                        setDeleting(false);
                        toastr.error(err?.response?.data);
                    }
                })
        }
    }
    return (
        <div className="add-edit-fr-agent pt-3 position-relative">
            <form className="top-form" autoComplete="off">
                <input id="username" type="text" name="fakeusernameremembered" className="d-none" />
                <input id="password" type="password" name="fakepasswordremembered" className="d-none" />
                <div className="row">
                    <div className="col-12 col-sm-4">
                        <div className="form-group">
                            <label className="text-orange-red">Affiliate Office*</label>
                            <select value={(formData as IFranchiseAgent)?.officeId} onChange={handleChange}
                                disabled={loading || !props?.allowOfficeEdit} name="officeId" className="form-control input-sm" required={true}>
                                <option value=''>-Select-</option>
                                {
                                    referralOffices?.map((item: IReferralOffice, index: number) => <option key={index} value={item?.id}>{item?.name}</option>)
                                }
                            </select>
                        </div>
                    </div>
                    <div className="col-12 col-sm-4">
                        <div className="form-group">
                            <label className="text-orange-red">First Name*</label>
                            <input type="text" autoFocus={true} onChange={handleChange} value={(formData as IFranchiseAgent)?.firstName || ''} name="firstName" className="form-control" placeholder="Enter First Name" required={true} />
                        </div>
                    </div>
                    <div className="col-12 col-sm-4">
                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" onChange={handleChange} value={(formData as IFranchiseAgent)?.lastName || ''} name="lastName" className="form-control" placeholder="Enter Last Name" required={true} />
                        </div>
                    </div>
                    <div className="col-12 col-sm-4">
                        <div className="form-group">
                            <label>Telephone</label>
                            <InputMask value={(formData as IFranchiseAgent)?.telephone || ''} onChange={handleChange} name="telephone" type="text" className="form-control" placeholder="(999) 999-9999" required={true} mask="(999) 999-9999" maskChar="X" />
                        </div>
                    </div>
                    <div className="col-12 col-sm-4">
                        <div className="form-group">
                            <label>Cell Phone</label>
                            <InputMask value={(formData as IFranchiseAgent)?.cellPhone || ''} onChange={handleChange} name="cellPhone" type="text" className="form-control" placeholder="(999) 999-9999" required={true} mask="(999) 999-9999" maskChar="X" />
                        </div>
                    </div>
                    <div className="col-12 col-sm-4">
                        <div className="form-group">
                            <label>Fax</label>
                            <InputMask value={(formData as IFranchiseAgent)?.fax || ''} onChange={handleChange} name="fax" type="text" className="form-control" placeholder="(999) 999-9999" required={true} mask="(999) 999-9999" maskChar="X" />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-sm-4">
                        <div className="form-group">
                            <label className="text-orange-red">Email*</label>
                            <input value={(formData as IFranchiseAgent)?.email || ''} onChange={handleChange} type="text" name="email" className="form-control" placeholder="Email" required={true} />
                        </div>
                    </div>
                    <div className="col-12 col-sm-4">
                        <div className="form-group">
                            <label>Role</label>
                            <select value={(formData as IFranchiseAgent)?.roleName || ''} onChange={handleChange}
                                disabled={loading} name="roleName" className="form-control input-sm" required={true}>
                                {props?.isAddMode && <option value={''}>-Select-</option>}
                                <option value={'referral agent'}>Affiliate Agent</option>
                                <option value={'referral manager'}>Referral Manager</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {
                        props?.isAddMode &&
                        <>
                            <div className="col-12 col-sm-4">
                                <div className="form-group">
                                    <label className="text-orange-red">User Name*</label>
                                    <input autoComplete="nope" readOnly={true} disabled={true} value={(formData as IFranchiseAgent)?.email || ''} onChange={handleChange} type="text" name="email" className="form-control" placeholder="Enter Username" required={true} />
                                </div>
                            </div>
                            <div className="col-12 col-sm-4">
                                <div className="form-group">
                                    <label className="text-orange-red">Password*</label>
                                    <PasswordComponent autoComplete="new-password" name='password' defaultvalue={(formData as IFranchiseAgent)?.password || ''} onChange={handlePasswordChange} />
                                </div>
                            </div>

                            <div className="col-12 col-sm-4">
                                <div className="form-group">
                                    <label className="text-orange-red">Confirm Password*</label>
                                    <PasswordComponent name='confirmPassword'  disableStrengthMeter={true} defaultvalue={(formData as IFranchiseAgent)?.confirmPassword || ''} onChange={handlePasswordChange} />
                                </div>
                            </div>
                        </>
                    }
                </div>
            </form>
            <div className="row mt-5 mb-5">
                <div className="col-12 col-sm-9 d-flex flex-column flex-sm-row justify-content-start">
                    {
                        !props?.isAddMode &&
                        <>
                            {
                                !AuthService.isFieldHidden(props.AuthRules, 'ResendWelcomeEmail') &&
                                <ButtonComponent text="Resend Welcome Email" className="btn-secondary w-100 w-sm-auto" loading={sendingWelcomeEmail} onClick={onResendWelcomeEmail} >
                                    <i className="fa fa-retweet mr-2"></i>
                                </ButtonComponent>
                            }
                            {
                                !AuthService.isFieldHidden(props.AuthRules, 'SendFollowUpEmail') &&
                                <ButtonComponent text="Send FollowUp Email" className="btn-info mt-1 mt-sm-0 ml-sm-2 w-100 w-sm-auto" loading={sendingFollowUp} onClick={onFollowUpEmail} >
                                    <i className="fa fa-envelope mr-2"></i>
                                </ButtonComponent>
                            }
                        </>
                    }
                    {
                        props?.allowDelete &&
                        <>
                            {
                                !AuthService.isFieldHidden(props.AuthRules, 'DeleteReferralAgent') &&
                                <ButtonComponent text="Delete" className="btn-danger mt-1 mt-sm-0 ml-sm-2 w-100 w-sm-auto" loading={deleting} onClick={onDelete} >
                                    <i className="fa fa-trash mr-2"></i>
                                </ButtonComponent>
                            }
                        </>
                    }
                </div>
                <div className="col-12 col-sm-3 d-flex justify-content-end">
                    <ButtonComponent text="Save Details" disabled={loading} className="btn-primary w-100 w-sm-auto mt-4 mt-sm-0" loading={saving} onClick={onSave} >
                        <i className="fa fa-floppy-o mr-2"></i>
                    </ButtonComponent>
                </div>
            </div>
            <br />
            {
                !props?.isAddMode &&
                <>
                    <div className=" mb-5">
                        <div className="h-line position-relative">
                            <span className="h-line-text">Change password</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-sm-4">
                            <div className="form-group">
                                <label className="text-orange-red">New Password*</label>
                                <PasswordComponent autoComplete="new-password" name='password' defaultvalue={(formData as IFranchiseAgent)?.password || ''} onChange={handlePasswordChange} />
                            </div>
                        </div>

                        <div className="col-12 col-sm-4">
                            <div className="form-group">
                                <label className="text-orange-red">Confirm New Password*</label>
                                <PasswordComponent name='confirmPassword' disableStrengthMeter={true} defaultvalue={(formData as IFranchiseAgent)?.confirmPassword || ''} onChange={handlePasswordChange} />
                            </div>
                        </div>
                    </div>
                    <div className="row mt-4 mb-4">
                        <div className="col-12 d-flex justify-content-end">
                            <ButtonComponent text="Change Password" disabled={savingPassword} className="btn-primary w-100 w-sm-auto" loading={savingPassword} onClick={onChangePassword} >
                                <i className="fa fa-floppy-o mr-2"></i>
                            </ButtonComponent>
                        </div>
                    </div>
                </>
            }
        </div >
    );
});