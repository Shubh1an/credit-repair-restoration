import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios, { CancelTokenSource } from 'axios';

import { getPublicAuthToken } from '../../../actions/auth.actions';
import './create-lead.scss';
import { LeadPersonalDetailsComponent } from '../../leads/leads-form/tabs/leads-info/leads-personal-details';
import { Messages } from '../../../shared/constants';
import { IFranchiseAgent } from '../../../models/interfaces/franchise';
import { getOfficeLeadFormOptions } from '../../../actions/email-templates.actions';

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getPublicAuthToken,
        getOfficeLeadFormOptions
    }, dispatch);
}
const mapStateToProps = (state: any) => {
    return {
        isGettingPublicToken: state.authModel?.auth?.isGettingPublicToken
    }
}
const CreateLeadPersonalDetailsComponent = connect(mapStateToProps, mapDispatchToProps)((props: any) => {

    const [loading, setLoading] = useState(true as boolean);
    const [agent, setAgent] = useState(null as IFranchiseAgent | null);
    const [officeid] = useState(new URLSearchParams(props.location.search).get('officeid'));
    const [axiosSource, setAxiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);

    useEffect(() => {
        if (window.self === window.top) { // application is not opened in iframe 
            props.history.push('/login');
        }
        return () => {
            if (axiosSource.cancel) {
                axiosSource.cancel(Messages.APIAborted);
            }
        }
    }, []);

    useEffect(() => {
        if (!props?.isGettingPublicToken) {
            LoadFormOptions();
        }
    }, [props?.isGettingPublicToken]);

    const LoadFormOptions = () => {
        setLoading(true);
        props?.getOfficeLeadFormOptions(officeid, axiosSource)
            .then((res: any[]) => {
                setLoading(false);
                const form = res?.find(x => x.formType === 'Lead Form');
                setAgent(form?.defaultFAgentId ? {
                    id: form?.defaultFAgentId,
                    email: form?.email,
                    firstName: form?.firstName,
                    lastName: form?.lastName
                } : null);
            }).catch((err: any) => {
                setLoading(false);
            });
    }
    return (
        <div className='public-leads'>
            {!props?.isGettingPublicToken && !loading && <LeadPersonalDetailsComponent addMode={true} isPublic={true} fAgent={agent} />}
        </div>
    )
})

export default CreateLeadPersonalDetailsComponent;