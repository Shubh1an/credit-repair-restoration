import React, { useState, useCallback, useEffect } from 'react';
import axios, { CancelTokenSource } from 'axios';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import toastr from 'toastr';

import { DashboardWidget } from '../../../../../dashboard/components/dashboard-widget';
import { Messages, Variables } from '../../../../../../shared/constants';
import { getEmailTemplatesByOfficeId } from '../../../../../../actions/email-templates.actions';
import { TemplateComponent } from './template';
import { IEmailLetters } from '../../../../../../models/interfaces/email-letters';
import { EmailTemplateOptionTypes } from '../../../../../../models/enums';
import { ModalComponent } from '../../../../../../shared/components/modal';
import { TemplateOptions } from './template-options';


const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getEmailTemplatesByOfficeId
    }, dispatch);
}

export const OfficeEmailTemplates = connect(null, mapDispatchToProps)((props: { officeId: string, getEmailTemplatesByOfficeId: any }) => {

    const [loading, setLoading] = useState(false);
    const [axiosSource, setAxiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);
    const [templates, setTemplates] = useState([] as IEmailLetters[]);
    const [templateId, setTemplateId] = useState('' as string);
    const [optionType, setOptionType] = useState('' as EmailTemplateOptionTypes);
    const [reloadList, setReloadList] = useState(false);


    useEffect(() => {
        if (props?.officeId) {
            loadTemplates();
        }
    }, [props?.officeId])

    useEffect(() => {
        return () => {
            if (axiosSource.cancel) {
                axiosSource.cancel(Messages.APIAborted);
            }
        }
    }, []);

    const loadTemplates = () => {
        setLoading(true);
        props.getEmailTemplatesByOfficeId(props?.officeId, axiosSource)
            .then((res: any) => {
                setLoading(false);
                setTemplates(res);
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setLoading(false);
                }
            })
    }
    const getObj = useCallback((text: string) => {
        return templates?.find(x => x.name === text);
    }, [templates])


    const openOptions = (type: EmailTemplateOptionTypes, text: string) => {
        const template = getObj(text);
        if (!template) {
            toastr.error('Please enable the Template first.');
            return;
        }
        setTemplateId(template?.id || '');
        setReloadList(false);
        setOptionType(type);
    }

    return (
        <div className=''>
            <DashboardWidget isLoading={loading} title={<><i className="fa fa-envelope mr-1" aria-hidden="true"></i> Email Templates</>} allowFullscreen={true} allowMaximize={true} allowMinimize={true} reload={false} >
                <div className='email-templates-list'>
                    <div className='row ml-0 mr-0'>
                        <div className='col-12 col-sm-3 text-center  table-welcome-email'>
                            <h4><strong> Initial Welcome Emails</strong></h4>
                        </div>
                        <div className='col-12 col-sm-9 pl-0 pr-0'>
                            <div className='row ml-0 mr-0'>
                                <div className='col-12 col-sm-5 text-left text-secondary p-3 pt-sm-4 pr-sm-4 pb-sm-2 pl-sm-4 border-gray-16 border-gray-top-16'>
                                    <h6><strong>Client Welcome Email</strong></h6>
                                    <div className='d-flex align-items-center f-10 mt-1'>
                                        <i className='fa fa-info-circle mr-1'></i>
                                        Email sent to Client after registration!
                                    </div>
                                    {
                                        !!getObj(Variables.EmailTemplatesNames.CustomerWelcome) &&
                                        <div className='f-10 mt-2 font-weight-bold'>
                                            <span className='underline pointer' title={getObj(Variables.EmailTemplatesNames.CustomerWelcome)?.cc?.join(', ')} onClick={() => openOptions(EmailTemplateOptionTypes.CC, Variables.EmailTemplatesNames.CustomerWelcome)}>CC({getObj(Variables.EmailTemplatesNames.CustomerWelcome)?.cc?.length})</span>
                                            <span className='underline pointer ml-2 mr-2' title={getObj(Variables.EmailTemplatesNames.CustomerWelcome)?.bcc?.join(', ')} onClick={() => openOptions(EmailTemplateOptionTypes.BCC, Variables.EmailTemplatesNames.CustomerWelcome)}>BCC({getObj(Variables.EmailTemplatesNames.CustomerWelcome)?.bcc?.length})</span>
                                            <span className='underline pointer' title={getObj(Variables.EmailTemplatesNames.CustomerWelcome)?.sender?.join(', ')} onClick={() => openOptions(EmailTemplateOptionTypes.SENDER, Variables.EmailTemplatesNames.CustomerWelcome)}>Sender({getObj(Variables.EmailTemplatesNames.CustomerWelcome)?.sender?.length})</span>
                                        </div>
                                    }
                                </div>
                                <TemplateComponent officeId={props.officeId} name={Variables.EmailTemplatesNames.CustomerWelcome} onSave={loadTemplates} type={Variables.EmailTemplatesTypes.WelcomeEmail} letter={getObj(Variables.EmailTemplatesNames.CustomerWelcome)} />
                            </div>
                            <div className='row ml-0 mr-0'>
                                <div className='col-12 col-sm-5 text-left text-secondary p-3 pt-sm-4 pr-sm-4 pb-sm-2 pl-sm-4 border-gray-16'>
                                    <h6><strong>Lead Welcome Email</strong></h6>
                                    <div className='d-flex align-items-center f-10 mt-1'>
                                        <i className='fa fa-info-circle mr-1'></i>
                                        Email sent to Lead after registration!
                                    </div>
                                    {
                                        !!getObj(Variables.EmailTemplatesNames.LeadWelcome) &&
                                        <div className='f-10 mt-2 font-weight-bold'>
                                            <span className='underline pointer' title={getObj(Variables.EmailTemplatesNames.LeadWelcome)?.cc?.join(', ')} onClick={() => openOptions(EmailTemplateOptionTypes.CC, Variables.EmailTemplatesNames.LeadWelcome)}>CC({getObj(Variables.EmailTemplatesNames.LeadWelcome)?.cc?.length})</span>
                                            <span className='underline pointer ml-2 mr-2' title={getObj(Variables.EmailTemplatesNames.LeadWelcome)?.bcc?.join(', ')} onClick={() => openOptions(EmailTemplateOptionTypes.BCC, Variables.EmailTemplatesNames.LeadWelcome)}>BCC({getObj(Variables.EmailTemplatesNames.LeadWelcome)?.bcc?.length})</span>
                                            <span className='underline pointer' title={getObj(Variables.EmailTemplatesNames.LeadWelcome)?.sender?.join(', ')} onClick={() => openOptions(EmailTemplateOptionTypes.SENDER, Variables.EmailTemplatesNames.LeadWelcome)}>Sender({getObj(Variables.EmailTemplatesNames.LeadWelcome)?.sender?.length})</span>
                                        </div>
                                    }
                                </div>
                                <TemplateComponent officeId={props.officeId} name={Variables.EmailTemplatesNames.LeadWelcome} onSave={loadTemplates} type={Variables.EmailTemplatesTypes.LeadWelcome} letter={getObj(Variables.EmailTemplatesNames.LeadWelcome)} />
                            </div>
                            <div className='row ml-0 mr-0'>
                                <div className='col-12 col-sm-5 text-left text-secondary p-3 pt-sm-4 pr-sm-4 pb-sm-2 pl-sm-4 border-gray-16'>
                                    <h6><strong>Affiliate Agent Welcome Email</strong></h6>
                                    <div className='d-flex align-items-center f-10 mt-1'>
                                        <i className='fa fa-info-circle mr-1'></i>
                                        Email sent to Agent after registration!
                                    </div>
                                    {
                                        !!getObj(Variables.EmailTemplatesNames.ReferralAgentWelcome) &&
                                        <div className='f-10 mt-2 font-weight-bold'>
                                            <span className='underline pointer' title={getObj(Variables.EmailTemplatesNames.ReferralAgentWelcome)?.cc?.join(', ')} onClick={() => openOptions(EmailTemplateOptionTypes.CC, Variables.EmailTemplatesNames.ReferralAgentWelcome)}>CC({getObj(Variables.EmailTemplatesNames.ReferralAgentWelcome)?.cc?.length})</span>
                                            <span className='underline pointer ml-2 mr-2' title={getObj(Variables.EmailTemplatesNames.ReferralAgentWelcome)?.bcc?.join(', ')} onClick={() => openOptions(EmailTemplateOptionTypes.BCC, Variables.EmailTemplatesNames.ReferralAgentWelcome)}>BCC({getObj(Variables.EmailTemplatesNames.ReferralAgentWelcome)?.bcc?.length})</span>
                                            <span className='underline pointer' title={getObj(Variables.EmailTemplatesNames.ReferralAgentWelcome)?.sender?.join(', ')} onClick={() => openOptions(EmailTemplateOptionTypes.SENDER, Variables.EmailTemplatesNames.ReferralAgentWelcome)}>Sender({getObj(Variables.EmailTemplatesNames.ReferralAgentWelcome)?.sender?.length})</span>
                                        </div>
                                    }
                                </div>
                                <TemplateComponent officeId={props.officeId} name={Variables.EmailTemplatesNames.ReferralAgentWelcome} onSave={loadTemplates} type={Variables.EmailTemplatesTypes.AgentWelcomeEmail} letter={getObj(Variables.EmailTemplatesNames.ReferralAgentWelcome)} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='email-templates-list mt-sm-2 mb-sm-2'>
                    <div className='row ml-0 mr-0'>
                        <div className='col-12 col-sm-3 text-center  table-welcome-email'>
                            <h4><strong> Automatic Round Emails</strong></h4>
                        </div>
                        <div className='col-12 col-sm-9 pl-0 pr-0'>
                            <div className='row ml-0 mr-0'>
                                <div className='col-12 col-sm-5 text-left text-secondary p-3 pt-sm-4 pr-sm-4 pb-sm-2 pl-sm-4 border-gray-16 border-gray-top-16'>
                                    <h6><strong>15 Day Email</strong></h6>
                                    <div className='d-flex align-items-center f-10 mt-1'>
                                        <i className='fa fa-info-circle mr-1'></i>
                                        Email sent to Client after 15 days!
                                    </div>
                                    {
                                        !!getObj(Variables.EmailTemplatesNames.Email15Days) &&
                                        <div className='f-10 mt-2 font-weight-bold'>
                                            <span className='underline pointer' title={getObj(Variables.EmailTemplatesNames.Email15Days)?.cc?.join(', ')} onClick={() => openOptions(EmailTemplateOptionTypes.CC, Variables.EmailTemplatesNames.Email15Days)}>CC({getObj(Variables.EmailTemplatesNames.Email15Days)?.cc?.length})</span>
                                            <span className='underline pointer ml-2 mr-2' title={getObj(Variables.EmailTemplatesNames.Email15Days)?.bcc?.join(', ')} onClick={() => openOptions(EmailTemplateOptionTypes.BCC, Variables.EmailTemplatesNames.Email15Days)}>BCC({getObj(Variables.EmailTemplatesNames.Email15Days)?.bcc?.length})</span>
                                            <span className='underline pointer' title={getObj(Variables.EmailTemplatesNames.Email15Days)?.sender?.join(', ')} onClick={() => openOptions(EmailTemplateOptionTypes.SENDER, Variables.EmailTemplatesNames.Email15Days)}>Sender({getObj(Variables.EmailTemplatesNames.Email15Days)?.sender?.length})</span>
                                        </div>
                                    }
                                </div>
                                <TemplateComponent officeId={props.officeId} name={Variables.EmailTemplatesNames.Email15Days} type={Variables.EmailTemplatesTypes.ReminderEmail} onSave={loadTemplates} letter={getObj(Variables.EmailTemplatesNames.Email15Days)} />
                            </div>
                            <div className='row ml-0 mr-0'>
                                <div className='col-12 col-sm-5 text-left text-secondary p-3 pt-sm-4 pr-sm-4 pb-sm-2 pl-sm-4 border-gray-16'>
                                    <h6><strong>35 Day Email</strong></h6>
                                    <div className='d-flex align-items-center f-10 mt-1'>
                                        <i className='fa fa-info-circle mr-1'></i>
                                        Email sent to Client after 35 days!
                                    </div>
                                    {
                                        !!getObj(Variables.EmailTemplatesNames.Email35Days) &&
                                        <div className='f-10 mt-2 font-weight-bold'>
                                            <span className='underline pointer'  title={getObj(Variables.EmailTemplatesNames.Email35Days)?.cc?.join(', ')} onClick={() => openOptions(EmailTemplateOptionTypes.CC, Variables.EmailTemplatesNames.Email35Days)}>CC({getObj(Variables.EmailTemplatesNames.Email35Days)?.cc?.length})</span>
                                            <span className='underline pointer ml-2 mr-2'  title={getObj(Variables.EmailTemplatesNames.Email35Days)?.bcc?.join(', ')} onClick={() => openOptions(EmailTemplateOptionTypes.BCC, Variables.EmailTemplatesNames.Email35Days)}>BCC({getObj(Variables.EmailTemplatesNames.Email35Days)?.bcc?.length})</span>
                                            <span className='underline pointer'  title={getObj(Variables.EmailTemplatesNames.Email35Days)?.sender?.join(', ')} onClick={() => openOptions(EmailTemplateOptionTypes.SENDER, Variables.EmailTemplatesNames.Email35Days)}>Sender({getObj(Variables.EmailTemplatesNames.Email35Days)?.sender?.length})</span>
                                        </div>
                                    }
                                </div>
                                <TemplateComponent name={Variables.EmailTemplatesNames.Email35Days} officeId={props.officeId} type={Variables.EmailTemplatesTypes.PullEmail} letter={getObj(Variables.EmailTemplatesNames.Email35Days)} onSave={loadTemplates} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='email-templates-list'>
                    <div className='row ml-0 mr-0'>
                        <div className='col-12 col-sm-3 text-center  table-welcome-email'>
                            <h4><strong> Progress Update Emails</strong></h4>
                        </div>
                        <div className='col-12 col-sm-9 pl-0 pr-0'>
                            <div className='row ml-0 mr-0'>
                                <div className='col-12 col-sm-5 text-left text-secondary p-3 pt-sm-4 pr-sm-4 pb-sm-2 pl-sm-4 border-gray-16 border-gray-top-16'>
                                    <h6><strong>Notice Account Update Email</strong></h6>
                                    <div className='d-flex align-items-center f-10 mt-1'>
                                        <i className='fa fa-info-circle mr-1'></i>
                                        Notice of Account Update Email!
                                    </div>
                                    {
                                        !!getObj(Variables.EmailTemplatesNames.NoticeAccUpdate) &&
                                        <div className='f-10 mt-2 font-weight-bold'>
                                            <span className='underline pointer' title={getObj(Variables.EmailTemplatesNames.NoticeAccUpdate)?.cc?.join(', ')} onClick={() => openOptions(EmailTemplateOptionTypes.CC, Variables.EmailTemplatesNames.NoticeAccUpdate)}>CC({getObj(Variables.EmailTemplatesNames.NoticeAccUpdate)?.cc?.length})</span>
                                            <span className='underline pointer ml-2 mr-2' title={getObj(Variables.EmailTemplatesNames.NoticeAccUpdate)?.bcc?.join(', ')} onClick={() => openOptions(EmailTemplateOptionTypes.BCC, Variables.EmailTemplatesNames.NoticeAccUpdate)}>BCC({getObj(Variables.EmailTemplatesNames.NoticeAccUpdate)?.bcc?.length})</span>
                                            <span className='underline pointer' title={getObj(Variables.EmailTemplatesNames.NoticeAccUpdate)?.sender?.join(', ')} onClick={() => openOptions(EmailTemplateOptionTypes.SENDER, Variables.EmailTemplatesNames.NoticeAccUpdate)}>Sender({getObj(Variables.EmailTemplatesNames.NoticeAccUpdate)?.sender?.length})</span>
                                        </div>
                                    }
                                </div>
                                <TemplateComponent name={Variables.EmailTemplatesNames.NoticeAccUpdate} officeId={props.officeId} type={Variables.EmailTemplatesTypes.NoticeAccUpdate} letter={getObj(Variables.EmailTemplatesNames.NoticeAccUpdate)} onSave={loadTemplates} />
                            </div>
                            <div className='row ml-0 mr-0'>
                                <div className='col-12 col-sm-5 text-left text-secondary p-3 pt-sm-4 pr-sm-4 pb-sm-2 pl-sm-4 border-gray-16'>
                                    <h6><strong>Notice Account Update With Deletes Email</strong></h6>
                                    <div className='d-flex align-items-center f-10 mt-1'>
                                        <i className='fa fa-info-circle mr-1'></i>
                                        Notice of Account Update With Deletes Email!
                                    </div>
                                    {
                                        !!getObj(Variables.EmailTemplatesNames.NoticeAccUpdateDeletes) &&
                                        <div className='f-10 mt-2 font-weight-bold'>
                                            <span className='underline pointer' title={getObj(Variables.EmailTemplatesNames.NoticeAccUpdateDeletes)?.cc?.join(', ')} onClick={() => openOptions(EmailTemplateOptionTypes.CC, Variables.EmailTemplatesNames.NoticeAccUpdateDeletes)}>CC({getObj(Variables.EmailTemplatesNames.NoticeAccUpdateDeletes)?.cc?.length})</span>
                                            <span className='underline pointer ml-2 mr-2' title={getObj(Variables.EmailTemplatesNames.NoticeAccUpdateDeletes)?.bcc?.join(', ')} onClick={() => openOptions(EmailTemplateOptionTypes.BCC, Variables.EmailTemplatesNames.NoticeAccUpdateDeletes)}>BCC({getObj(Variables.EmailTemplatesNames.NoticeAccUpdateDeletes)?.bcc?.length})</span>
                                            <span className='underline pointer' title={getObj(Variables.EmailTemplatesNames.NoticeAccUpdateDeletes)?.sender?.join(', ')} onClick={() => openOptions(EmailTemplateOptionTypes.SENDER, Variables.EmailTemplatesNames.NoticeAccUpdateDeletes)}>Sender({getObj(Variables.EmailTemplatesNames.NoticeAccUpdateDeletes)?.sender?.length})</span>
                                        </div>
                                    }
                                </div>
                                <TemplateComponent name={Variables.EmailTemplatesNames.NoticeAccUpdateDeletes} officeId={props.officeId} type={Variables.EmailTemplatesTypes.NoticeAccUpdate} letter={getObj(Variables.EmailTemplatesNames.NoticeAccUpdateDeletes)} onSave={loadTemplates} />
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardWidget>
            <ModalComponent title={optionType + ' Options'} fullscreen={false} isVisible={!!templateId} onClose={() => {
                setTemplateId('');
                if (reloadList) {
                    loadTemplates();
                }
            }}>
                {!!templateId && <TemplateOptions templateId={templateId} type={optionType} reloadList={() => { setReloadList(true) }} />}
            </ModalComponent>
        </div>
    );
});