import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toastr from 'toastr';
import { connect } from 'react-redux';
// @ts-ignore
import confirm from 'reactstrap-confirm';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import { Messages } from '../../../../../shared/constants';
import { ButtonComponent } from '../../../../../shared/components/button';
import { getSubscribeToCMLead, subscribeToCMLead } from '../../../../../actions/leads.actions';


const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        subscribeToCMLead,
        getSubscribeToCMLead
    }, dispatch);
}
export const LeadSubscribeToCreditMonitoring = connect(null, mapDispatchToProps)((props: {
    cid: string, subscribeToCMLead: any,
    getSubscribeToCMLead: any
}) => {

    const [isSubscribing, setIsSubscribing] = useState(false);
    const [axiosSource, setAxiosSource] = useState(axios.CancelToken.source());
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [arraySubscribedBy, setArraySubscribedBy] = useState('' as string);
    const [arraySubscribedOn, setArraySubscribedOn] = useState('' as string);

    useEffect(() => {
        setAxiosSource(axios.CancelToken.source());
        loadStatus();
        return () => {
            if (axiosSource.cancel) {
                axiosSource.cancel(Messages.APIAborted);
            }
        }
    }, [props?.cid])

    const onCustomerSubscribeArray = async () => {
        let result = await confirm({
            title: 'Subscribe Lead for Credit Monitoring?',
            message: 'Are you sure you would like to subscribe your lead for Credit Monitoring?',
            confirmText: "YES",
            confirmColor: "danger",
            cancelColor: "link text-secondary"
        });
        if (result) {
            setIsSubscribing(true);
            props?.subscribeToCMLead(props?.cid, axiosSource)
                .then((result: any) => {
                    setIsSubscribing(false);
                    if (result) {
                        toastr.success('Lead Subscribed successfully!!');
                        loadStatus();
                    } else {
                        toastr.error(Messages.GenericError);
                    }
                }).catch((err: any) => {
                    if (!axios.isCancel(err)) {
                        setIsSubscribing(false);
                        toastr.error(err?.response?.data || Messages.GenericError);
                    }
                });
        }
    }
    const loadStatus = () => {
        setIsSubscribing(true);
        props?.getSubscribeToCMLead(props?.cid, axiosSource)
            .then((result: any) => {
                setIsSubscribing(false);
                setIsSubscribed(result?.isCMSubscribed);
                setArraySubscribedBy(result?.cmSubscribedBy);
                setArraySubscribedOn(result?.cmSubscribedOn);
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setIsSubscribing(false);
                    toastr.error(err?.response?.data || Messages.GenericError);
                }
            });
    }
    return (
        isSubscribed ?
            <div>
                <ButtonComponent text="Subscribed For Credit Monitoring" loading={isSubscribing} sizeClass={'btn-md'} className="btn-success w-100" onClick={onCustomerSubscribeArray}>
                    <i className="fa fa-check-circle mr-2"></i>
                </ButtonComponent >
                {
                    !!arraySubscribedBy &&
                    <div className='d-flex f-10 text-success ml-sm-2'><span className='mr-2'>{arraySubscribedBy}</span><span>at {moment(arraySubscribedOn).format('MM/DD/YYYY h:mm a')}</span> </div>
                }
            </div>
            :
            <ButtonComponent text="Subscribe For Credit Report" loading={isSubscribing} sizeClass={'btn-md'} className="btn-md btn-secondary w-100" onClick={onCustomerSubscribeArray}>
                <i className="fa fa-user-plus mr-2"></i>
            </ButtonComponent>
    )
});
