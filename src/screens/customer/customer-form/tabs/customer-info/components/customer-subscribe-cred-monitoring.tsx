import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toastr from 'toastr';
import { connect } from 'react-redux';
// @ts-ignore
import confirm from 'reactstrap-confirm';
import moment from 'moment';
import { bindActionCreators } from 'redux';

import { subscribeToCMCustomer, getSubscribeToCMCustomer } from '../../../../../../actions/customers.actions';
import { ButtonComponent } from '../../../../../../shared/components/button'
import { Messages } from '../../../../../../shared/constants';


const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        subscribeToCMCustomer,
        getSubscribeToCMCustomer
    }, dispatch);
}
export const CustomerSubscribeToCreditMonitoring = connect(null, mapDispatchToProps)((props: {
    cid: string, subscribeToCMCustomer: any,
    getSubscribeToCMCustomer: any
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

    const onCustomerSubscribeCreditMonitoring = async () => {
        let result = await confirm({
            title: 'Subscribe Client For Credit Monitoring?',
            message: 'Are you sure you would like to subscribe your client for Credit Monitoring?',
            confirmText: "YES",
            confirmColor: "primary",
            cancelColor: "link text-secondary"
        });
        if (result) {
            setIsSubscribing(true);
            props?.subscribeToCMCustomer(props?.cid, axiosSource)
                .then((result: any) => {
                    setIsSubscribing(false);
                    if (result) {
                        toastr.success('Client Subscribed successfully for Credit Monitoring.');
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
        props?.getSubscribeToCMCustomer(props?.cid, axiosSource)
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
                <ButtonComponent text="Subscribed For Credit Monitoring" loading={isSubscribing} sizeClass={'btn-md'} className="btn-success w-100" onClick={onCustomerSubscribeCreditMonitoring}>
                    <i className="fa fa-check-circle mr-2"></i>
                </ButtonComponent >
                {
                    !!arraySubscribedBy &&
                    <div className='d-flex f-10 text-success ml-sm-2'><span className='mr-2'>{arraySubscribedBy}</span><span>at {moment(arraySubscribedOn).format('MM/DD/YYYY h:mm a')}</span> </div>
                }
            </div>
            :
            <ButtonComponent text="Subscribe For Credit Monitoring" loading={isSubscribing} sizeClass={'btn-md'} className="btn-md btn-secondary w-100" onClick={onCustomerSubscribeCreditMonitoring}>
                <i className="fa fa-user-plus mr-2"></i>
            </ButtonComponent>
    )
});
