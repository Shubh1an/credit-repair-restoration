import axios, { CancelTokenSource } from 'axios';
import React, { useState } from 'react';
import toastr from 'toastr';
import InputMask from 'react-input-mask';
import { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { validate as uuidValidate } from 'uuid';


import { ButtonComponent } from '../../../../../../shared/components/button';
import { Messages } from '../../../../../../shared/constants';
import { IFranchiseAgent, IFranchiseOffice } from '../../../../../../models/interfaces/franchise';
import { getFranchiseOffices, createUpdateFranchiseAgent, getFranchiseAgentRoles } from '../../../../../../actions/franchise.actions';
import { PasswordComponent } from '../../../../../../shared/components/password';
import AuthService from '../../../../../../core/services/auth.service';
import { EnumComponentMode, EnumScreens } from '../../../../../../models/enums';
import { resedWelcomeEmailFranchAgent } from '../../../../../../actions/franchise-agents.actions';
import { CommonUtils } from '../../../../../../utils/common-utils';

const mapStateToProps = (state: any) => {
    return {
        AuthRules: AuthService.getScreenOject(state.sharedModel?.AuthRules, EnumScreens.ViewFranchiseAgents)
    };
}

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getFranchiseOffices,
        createUpdateFranchiseAgent,
        getFranchiseAgentRoles,
        resedWelcomeEmailFranchAgent
    }, dispatch);
}
export const AddUpdateFranchiseAgent = connect(mapStateToProps, mapDispatchToProps)((props: {
    isAddMode?: boolean,
    agent: IFranchiseAgent | unknown,
    getFranchiseOffices: any,
    createUpdateFranchiseAgent: any,
    getFranchiseAgentRoles: any,
    onSave?: (id: string) => void,
    onDelete?: (id?: string) => void,
    officeId?: string,
    isDeleting?: boolean,
    AuthRules?: any;
    resedWelcomeEmailFranchAgent?: any;
}) => {

    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);
    const [franchiseOffices, setFranchiseOffices] = useState([] as IFranchiseOffice[]);
    const [axiosSource, setAxiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);
    const [formData, setFormData] = useState({} as unknown | IFranchiseAgent);
    const [roles, setRoles] = useState([] as string[]);
    const [passwordValidations, setPasswordValidations] = useState({} as any);
    const [resendMailing, setResendMailing] = useState(false);

    useEffect(() => {
        setFormData(props.agent || {});
        loadFranchiseOffices();
        loadFranchiseRoles();
    }, [props.agent, props.isAddMode])

    useEffect(() => {
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
    const handlePasswordChange = ({ event, isValid, strength }: any) => {
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
    const loadFranchiseRoles = () => {
        props.getFranchiseAgentRoles(axiosSource)
            .then((result: string[]) => {
                setRoles(result);
            })
            .catch((err: any) => {
                if (!axios.isCancel(err)) {
                    toastr.error(err?.response?.data || Messages.GenericError);
                }
            })
    }
    const loadFranchiseOffices = () => {
        setLoading(true);
        props.getFranchiseOffices(axiosSource)
            .then((result: IFranchiseOffice[]) => {
                setLoading(false);
                setFranchiseOffices(result);
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
            !(agent?.office?.id || props.officeId) ||
            !agent.role;

        if (validResult) {
            const options = {
                screenName: EnumScreens.ViewFranchiseOffices,
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
                id: agent?.office?.id || props?.officeId
            },
            userName: agent.userName
        };
        const promise$ = props.createUpdateFranchiseAgent(newFormData, axiosSource);
        promise$.then((result: any) => {
            setSaving(false);
            if (uuidValidate(result?.id)) {
                toastr.success(result?.status);
                props.onSave && props.onSave(result?.id);
            } else {
                toastr.error(Messages.GenericError);
            }

        }).catch((err: any) => {
            if (!axios.isCancel(err)) {
                setSaving(false);
                toastr.error(err?.response?.data?.message);
            }
        })
    }
    const onResendWelcomeEmail = () => {
        setResendMailing(true);
        const agent = (formData as IFranchiseAgent);
        props?.resedWelcomeEmailFranchAgent(agent?.id, axiosSource)
            .then((result: any) => {
                setResendMailing(false);
                if (result) {
                    toastr.success('Welcome email resent successfully!!');
                } else {
                    toastr.error(Messages.GenericError);
                }
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setResendMailing(false);
                    toastr.error(err?.response?.data);
                }
            })
    }
    return (
        <div className="add-edit-fr-agent pt-3 position-relative">
            <form className="top-form" autoComplete="off">
                <input id="username" type="text" name="fakeusernameremembered" className="d-none" />
                <input id="password" type="password" name="fakepasswordremembered" className="d-none" />
                <div className="row">
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
                            <label>Home Phone</label>
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
                    <div className="col-12 col-sm-4">
                        <div className="form-group">
                            <label className="text-orange-red">Email*</label>
                            <input value={(formData as IFranchiseAgent)?.email || ''} onChange={handleChange} type="text" name="email" className="form-control" placeholder="Email" required={true} />
                        </div>
                    </div>
                    <div className="col-12 col-sm-4">
                        <div className="form-group">
                            <label>Web Address</label>
                            <input type="text" value={(formData as IFranchiseAgent)?.webAddress || ''} onChange={handleChange} name="webAddress" className="form-control" placeholder="Web Address" required={true} />
                        </div>
                    </div>
                    <div className="col-12 col-sm-4">
                        <div className="form-group">
                            <label className="text-orange-red">Office*</label>
                            <select value={(formData as IFranchiseAgent)?.officeId || (formData as IFranchiseAgent)?.office?.id || props?.officeId || ''} onChange={handleChange}
                                disabled={loading} name="office.id" className="form-control input-sm" required={true}>
                                {props?.isAddMode && <option value={''}>-Select-</option>}
                                {
                                    franchiseOffices?.map((item: IFranchiseOffice, index: number) => <option key={index} value={item?.id}>{item?.name}</option>)
                                }
                            </select>
                        </div>
                    </div>
                    <div className="col-12 col-sm-4">
                        <div className="form-group">
                            <label className="text-orange-red">Role*</label>
                            <select value={(formData as IFranchiseAgent)?.role || ''} disabled={loading} onChange={handleChange} name="role" className="form-control input-sm" required={true}>
                                {props?.isAddMode && <option value={''}>-Select-</option>}
                                {
                                    roles?.map((item: string, index: number) => <option key={index} value={item}>{item}</option>)
                                }
                            </select>
                        </div>
                    </div>
                    <div className="col-12 col-sm-4">
                        <div className="form-group">
                            <label className="text-orange-red">User Name*</label>
                            <input autoComplete="nope" readOnly={!props?.isAddMode} disabled={!props?.isAddMode} value={(formData as IFranchiseAgent)?.userName || ''} onChange={handleChange} type="text" name="userName" className="form-control" placeholder="Enter Username" required={true} />
                        </div>
                    </div>
                    <div className="col-12 col-sm-4">
                        <div className="form-group">
                            <label className="text-orange-red">Password*</label>
                            <PasswordComponent autoComplete="new-password" name='password' defaultvalue={(formData as IFranchiseAgent)?.password || ''} onChange={handlePasswordChange} />
                        </div>
                    </div>
                    {props?.isAddMode &&
                        <div className="col-12 col-sm-4">
                            <div className="form-group">
                                <label className="text-orange-red">Confirm Password*</label>
                                <PasswordComponent name='confirmPassword' disableStrengthMeter={true} defaultvalue={(formData as IFranchiseAgent)?.confirmPassword || ''} onChange={handlePasswordChange} />
                            </div>
                        </div>
                    }
                    <div className="col-12 col-sm-8">
                        <div className="form-group">
                            <label>Note</label>
                            <textarea onChange={handleChange} value={(formData as IFranchiseAgent)?.notes || ''} name="notes" className="form-control" placeholder="Enter Client Note" required={true} ></textarea>
                        </div>
                    </div>
                    <div className="col-12 col-sm-4">
                        <div className="form-group">
                            <label>Code</label>
                            <input type="text" value={(formData as IFranchiseAgent)?.agentCode || ''} disabled={true} readOnly={true} name="agentCode" className="form-control" />
                        </div>
                    </div>
                </div>
            </form>
            <div className="row mt-4 mb-4">
                <div className="col-12 col-sm-4">
                    {
                        !props?.isAddMode && !AuthService.isFieldHidden(props.AuthRules, 'ResendWelcomeEmail') &&
                        <ButtonComponent text="Resend Welcome Email" className="w-100 btn-secondary" loading={resendMailing} onClick={onResendWelcomeEmail} >
                            <i className="fa fa-retweet mr-2"></i>
                        </ButtonComponent>
                    }
                </div>
                <div className="col-12 col-sm-4 mt-1 mt-sm-0 text-left">
                    {
                        props.onDelete && !props?.isAddMode ?
                            !AuthService.isFieldHidden(props.AuthRules, 'DeleteFranchiseAgent') &&
                            <ButtonComponent text="Delete" disabled={loading} className="btn-danger w-100 w-sm-auto" loading={props?.isDeleting} onClick={() => props.onDelete && props.onDelete((formData as IFranchiseAgent)?.id)} >
                                <i className="fa fa-trash mr-2"></i>
                            </ButtonComponent>
                            : <div></div>
                    }
                </div>
                <div className="col-12 col-sm-4 text-right">
                    <ButtonComponent text="Save Details" disabled={loading} className="btn-primary w-100 w-sm-auto mt-3 mt-sm-0" loading={saving} onClick={onSave} >
                        <i className="fa fa-floppy-o mr-2"></i>
                    </ButtonComponent>
                </div>
            </div>
        </div>
    );
});