import axios, { CancelTokenSource } from 'axios';
import React, { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import toastr from 'toastr';

import { MailchimpLogo } from '../../shared/components/images';
import { ToggleSwitch } from '../../shared/components/toggle-switch';
import { Messages } from '../../shared/constants';
import { updateAPIKey, setAPIActive, getAPIIntegrations } from '../../actions/customers.actions';
import { IMailChimpList } from '../../models/interfaces/customer-view';
import { LargeSpinner } from '../../shared/components/large-spinner';
import { ButtonComponent } from '../../shared/components/button';
import { withAuthorize } from '../../shared/hoc/authorize';
import { EnumScreens } from '../../models/enums';

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getAPIIntegrations,
        updateAPIKey,
        setAPIActive
    }, dispatch);
}

const PortalIntegrationComponent = connect(null, mapDispatchToProps)((props: any) => {

    const [apiName] = useState('MailChimp');
    const [axiosSource, setAxiosSource] = useState(axios?.CancelToken?.source() as CancelTokenSource);
    const [checked, setChecked] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [keySet, setKeySet] = useState({} as IMailChimpList);

    const onChange = (checked: boolean) => {
        setChecked(checked);
        setAPIActive(checked);
    }
    useEffect(() => {
        setAxiosSource(axios?.CancelToken?.source());
        getAPIIntegrations();
        return () => {
            axiosSource?.cancel(Messages.GenericError);
        }
    }, []);

    const getAPIIntegrations = () => {
        setIsLoading(true);
        props?.getAPIIntegrations(axiosSource)
            .then((result: IMailChimpList[]) => {
                setIsLoading(false);
                if (result?.length) {
                    setKeySet(result[0]);
                    setChecked(result[0].apiActive);
                    setApiKey(result[0].apiKey);
                }
            })
            .catch((errors: any) => {
                if (!axios.isCancel(errors)) {
                    setIsLoading(false);
                    toastr.error(Messages.GenericError);
                }
            });
    }
    const setAPIActive = (isChecked: boolean) => {
        setIsLoading(true);
        props?.setAPIActive(apiName, isChecked, axiosSource)
            .then((result: any) => {
                setIsLoading(false);
                if (result) {
                    if (!apiKey)
                        toastr.success(`Mailchimp API Activated!, but you must enter your API Key for it to work.`);
                    else
                        toastr.success('Mailchimp API Activated');
                } else {
                    toastr.success('Mailchimp API Deactivated');
                }
                setKeySet({
                    ...keySet,
                    apiActive: isChecked
                });
            })
            .catch((errors: any) => {
                if (!axios.isCancel(errors)) {
                    setIsLoading(false);
                    toastr.error(Messages.GenericError);
                }
            });
    }
    const onSave = () => {
        setIsSaving(true);
        props?.updateAPIKey(apiName, apiKey, axiosSource)
            .then((result: any) => {
                setIsSaving(false);
                if (result) {
                    toastr.success(`MailChimp API key updated successfully!`);
                } else {
                    toastr.error(Messages.GenericError);
                }
            })
            .catch((errors: any) => {
                if (!axios.isCancel(errors)) {
                    setIsSaving(false);
                    toastr.error(Messages.GenericError);
                }
            });
    }
    return (
        <div className="portal-int">
            <section className="content-header">
                <div className="header-icon">
                    <i className="fa fa-dashboard"></i>
                </div>
                <div className="header-title">
                    <h1>Portal Integration</h1>
                    <small>Mail Chimp Integration</small>
                </div>
            </section>
            <section className="content position-relative">
                {isLoading ? <LargeSpinner /> : null}
                <br />
                <br />
                <div className="row">
                    <div className="col-12 col-sm-3">
                    </div>
                    <div className="col-12 col-sm-8">
                        <a href='http://eepurl.com/4h82v' target="_blank">
                            <img style={{ height: '70px', marginLeft: '40px' }} src={MailchimpLogo} />
                        </a>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-12 col-sm-3"></div>
                    <div className="col-6 col-sm-1 pl-3 pl-sm-0 p-sm-0">
                        <div className="form-group">
                            <label>Activate/Deactivate</label>
                        </div>
                    </div>
                    <div className="col-6 col-sm-3 d-flex pl-sm-4">
                        <ToggleSwitch size={'sm mb-4'} defaultChecked={checked} onChange={onChange} />
                        {checked ? "ON" : "OFF"}
                    </div>
                </div>
                {
                    keySet?.apiActive ?
                        <>
                            <div className="row">
                                <div className="col-12 col-sm-3">
                                </div>
                                <div className='col-12 col-sm-1 p-0'>
                                    <div className="form-group">
                                        <label>API Key</label>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-3 pl-sm-4">
                                    <div className="form-group">
                                        <div className="input-group">
                                            <input type="text" defaultValue={apiKey} className="form-control input-sm"
                                                onChange={e => setApiKey(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 col-sm-4">
                                </div>
                                <div className="col-12 col-sm-3 text-right">
                                    <ButtonComponent text="Save" className="btn-primary w-100 w-sm-auto" loading={isSaving} onClick={onSave} />
                                </div>
                            </div>
                        </>
                        : null
                }
                <br />
                <br />
                <br />
                <br />
                <div className='row'>
                    <div className='col-12 col-sm-2'></div>
                    <div className='col-12 col-sm-8'>
                        <i>
                            *Add MailChimp to the credit repair business software portal and start managing your subscriptions, export clients lists and pull necessary information about their activities from your help desk
                        </i>
                    </div>
                    <div className='col-12 col-sm-2'></div>
                </div>
                <br />
                <br />
                <br />
            </section>
        </div>
    );
})

export default withAuthorize(PortalIntegrationComponent,EnumScreens.PortalIntegration);