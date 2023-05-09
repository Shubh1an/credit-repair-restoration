import axios, { CancelTokenSource } from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Spinner } from 'reactstrap';
import { bindActionCreators } from 'redux';
import toastr from 'toastr';

import { createOfficeLeadFormOptions, getOfficeLeadFormOptions, updateOfficeLeadFormOptions } from '../../../../../../actions/email-templates.actions';
import AuthService from '../../../../../../core/services/auth.service';
import { AutoCompleteSearchTypes } from '../../../../../../models/enums';
import { IFormOptions, IFranchiseAgent } from '../../../../../../models/interfaces/franchise';
import { ButtonComponent } from '../../../../../../shared/components/button';
import { Checkbox } from '../../../../../../shared/components/checkbox';
import { SearchCustomersComponent } from '../../../../../../shared/components/search-customers';
import { ClientRoutesConstants, Messages } from '../../../../../../shared/constants';
import { UrlUtils } from '../../../../../../utils/http-url.util';
import { WindowUtils } from '../../../../../../utils/window-utils';
import { DashboardWidget } from '../../../../../dashboard/components/dashboard-widget';



const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getOfficeLeadFormOptions,
        createOfficeLeadFormOptions,
        updateOfficeLeadFormOptions
    }, dispatch);
}

export const LeadFormComponent = connect(null, mapDispatchToProps)((props: any) => {

    const [agent, setAgent] = useState(null as IFranchiseAgent | null);
    const [agentRemoving, setAgentRemoving] = useState(false as boolean);
    const [showSearchAgent, setShowSearchAgent] = useState(false as boolean);
    const [formHTML, setformHTML] = useState('');
    const [loading, setLoading] = useState(false as boolean);
    const [saving, setSaving] = useState(false as boolean);
    const [isAddMode, setIsAddMode] = useState(false as boolean);
    const [formOptions, setFormOptions] = useState(null as IFormOptions | null);
    const [axiosSource, setAxiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);

    useEffect(() => {
        return () => {
            if (axiosSource.cancel) {
                axiosSource.cancel(Messages.APIAborted);
            }
        }
    }, []);

    useEffect(() => {
        getLeadForm();
        LoadFormOptions();
    }, [props?.officeId]);

    const onAgentRemove = () => {
        setAgent(null);
        setShowSearchAgent(false);
    }
    const onAgentSelect = (ev: any) => {
        setAgent(ev);
        setShowSearchAgent(false);
    }
    const LoadFormOptions = () => {
        setLoading(true);
        props?.getOfficeLeadFormOptions(props?.officeId, axiosSource)
            .then((res: IFormOptions[]) => {
                setLoading(false);
                const form = res?.find(x => x.formType === 'Lead Form');
                setIsAddMode(!form);
                setFormOptions(form || null);
                setAgent(form?.defaultFAgentId ? {
                    id: form?.defaultFAgentId,
                    email: form?.email,
                    firstName: form?.firstName,
                    lastName: form?.lastName
                } : null);
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setLoading(false);
                }
            });
    }
    const getLeadForm = () => {
        const payload = AuthService.getCurrentJWTPayload();
        const loginUrl = window.location.origin + '/' + payload?.tenant + '/public/leads';
        const txt = LeadFormTemplate(loginUrl, props.officeId, UrlUtils.getPartnerKey());
        setformHTML(txt);
    }
    const onCopy = () => {
        WindowUtils.CopyToClipBoard(formHTML).then(() => {
            toastr.success('Lead Form Snippet Copied to Clipboard!!');
        });
    }
    const onEmailChange = (e: any) => {
        setFormOptions({
            ...formOptions,
            emailData: !!e?.checked
        });
    }
    const onSave = () => {
        setSaving(true);
        const payload = {
            ...formOptions,
            id: formOptions?.formOptionsId,
            email: !!formOptions?.emailData,
            franchiseAgentId: agent?.id,
        };
        const promise$ = isAddMode ? props?.createOfficeLeadFormOptions(props?.officeId, payload, axiosSource)
            : props?.updateOfficeLeadFormOptions(props?.officeId, payload, axiosSource);
        promise$.then((res: boolean) => {
            setSaving(false);
            toastr.success('Form Changes Saved successfully!!');
        }).catch((err: any) => {
            if (!axios.isCancel(err)) {
                setSaving(false);
            }
        });
    }
    return (
        <DashboardWidget title={'Lead Form'} isLoading={loading} allowFullscreen={true} allowMaximize={true} allowMinimize={true} reload={false} >
            <div className='lead-form pl-sm-5'>
                <div className='row'>
                    <div className='col-6 col-sm-2 pr-0'>
                        <label>Email Form ?</label>
                    </div>
                    <div className='col-6 col-sm-2 pt-1'>
                        <Checkbox text='' checked={!!formOptions?.emailData}
                            onChange={onEmailChange}
                            value='email' title='Should Email to the Office/Agent?' />
                    </div>
                    <div className='col-3'>

                    </div>
                </div>
                <div className='row mt-3'>
                    <div className='col-12 col-sm-2'>
                        <label>Default Agent</label>
                    </div>
                    <div className='col-12 col-sm-5'>
                        <div className="form-group">
                            {
                                !showSearchAgent ?
                                    !agent ?
                                        <div>
                                            <span className="text-danger change-button f-12 font-weight-bold"
                                                onClick={() => setShowSearchAgent(true)}>
                                                Add
                                            </span>
                                        </div>
                                        :
                                        <div className="spouse-name d-flex justify-content-between pt-1 align-items-center">
                                            <span className="text-danger f-12 font-weight-bold">
                                                <Link to={(ClientRoutesConstants.franchiseAgents + '/' + agent.id)} >
                                                    {agent ? agent?.firstName + ' ' + agent?.lastName : ''}
                                                </Link>
                                            </span>
                                            <span className="position-relative" >
                                                {
                                                    agentRemoving ? <Spinner size="sm" /> : <i title="Remove Agent" className="fa fa-trash pointer" onClick={onAgentRemove}></i>
                                                }
                                            </span>
                                        </div>
                                    : <div>
                                        <SearchCustomersComponent searchTypes={AutoCompleteSearchTypes.FRENCHISE_AGENT} minSearchLength={2}
                                            onSelectedData={onAgentSelect} placeholder={"search agents ..."} />
                                    </div>
                            }
                        </div>
                    </div>
                    <div className='col-3'>

                    </div>
                </div>
                <div className='row'>
                    <div className='col-12 col-sm-2 pr-0'>
                        <label>Form Source Code?</label>
                    </div>
                    <div className='col-12 col-sm-5 pt-1 form-group'>
                        <textarea  readOnly value={formHTML} onChange={(e: any) => setformHTML(e.target.value)} className='form-control' style={{ height: '120px' }}></textarea>
                    </div>
                    <div className='col-12 col-sm-5 copy-control'>
                        <ButtonComponent text="Copy" className="btn-link" onClick={onCopy} >
                            <i className="fa fa-clone mr-2" aria-hidden="true"></i>
                        </ButtonComponent>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-12 col-sm-2'>

                    </div>
                    <div className='col-12 col-sm-2'>
                        <ButtonComponent text="Save" loading={saving} className="btn-primary w-100 w-sm-auto" onClick={onSave} >
                            <i className="fa fa-floppy-o mr-2" aria-hidden="true"></i>
                        </ButtonComponent>
                    </div>
                </div>
            </div>
        </DashboardWidget>
    );
});


const LeadFormTemplate = (url: string, officeId: string, tenant: string) => {
    return `<iframe src='${url}?officeid=${officeId}&tenant=${tenant}' style='width:100%;min-width:300px;min-height:450px;border: none;box-shadow: -1px -2px 5px 2px #ccc;border-radius: 5px;'>
            </iframe>`;
}