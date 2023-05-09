import React, { useEffect, useState } from 'react';
import toastr from 'toastr';
import axios, { CancelTokenSource } from 'axios';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { Spinner } from 'reactstrap';
import { connect } from 'react-redux';


import { getCustomer } from '../../../../actions/customers.actions';
import { ICustomerFullDetails } from '../../../../models/interfaces/customer-view';
import { Messages } from '../../../../shared/constants';
import { CommonUtils } from '../../../../utils/common-utils';
import { ICustomerRoundInfo } from '../../../../models/interfaces/create-letter';
import { updateRoundInfo } from '../../../../actions/create-letter.actions';

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getCustomer,
        updateRoundInfo
    }, dispatch);
}
export const CustomerRoundInfo = connect(null, mapDispatchToProps)((props:
    {
        cid: string, getCustomer: (cid: string, source: any) => any,
        customerDetails?: (data: any) => any, updateRoundInfo: (data: any) => void
    }) => {

    const [customer, setCustomer] = useState(null as ICustomerFullDetails | null);
    const [axiosSource, setAxiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);
    const [loading, setLoading] = useState(false);
    const [displayInfo, setDisplayInfo] = useState({} as ICustomerRoundInfo);

    useEffect(() => {
        return () => {
            if (axiosSource.cancel) {
                axiosSource.cancel(Messages.APIAborted);
            }
        }
    }, []);
    useEffect(() => {
        loadCustomer();
        return () => {
            if (axiosSource.cancel) {
                axiosSource.cancel(Messages.APIAborted);
            }
        }
    }, [props?.cid]);

    const loadCustomer = () => {
        setLoading(true);
        const src = axios.CancelToken.source();
        setAxiosSource(src);
        props?.getCustomer(props?.cid, src)
            .then((res: any) => {
                setLoading(false);
                setCustomer(res?.customer);
                const info = getDisplayInfo(res?.customer);
                setDisplayInfo(info);
                props.updateRoundInfo(info);
                if (props?.customerDetails) {
                    props?.customerDetails(res.customer);
                }
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    toastr.error(Messages.GenericError);
                    setLoading(false);
                }
            })
    }
    const getDisplayInfo = (cust: ICustomerFullDetails): any => {
        let info: ICustomerRoundInfo = {};
        if (cust?.scoringRounds?.length) {
            let lastRound = cust?.scoringRounds[cust?.scoringRounds?.length - 1];
            if (lastRound) {
                info = {
                    score: {
                        eqf: lastRound?.equifaxScore?.toString(),
                        exp: lastRound?.experianScore?.toString(),
                        tu: lastRound?.transUnionScore?.toString()
                    }
                };
            }
            if (!lastRound?.closeDate || !CommonUtils.getDate(lastRound?.closeDate)) {
                info.finalRound = cust?.scoringRounds?.length + 1;
                info.roundStarted = 'Not Started';
                info.date = '-';
            } else {
                info.finalRound = cust?.scoringRounds?.length;
                info.roundStarted = 'Started';
                info.date = moment(lastRound?.closeDate).format('MM/DD/YYYY');
            }
        } else {
            info.finalRound = 0;
            info.roundStarted = 'Not Started';
            info.date = '-';
        }
        return info;
    }
    return (
        <div className="cus-round-info w-100">
            {
                loading ?
                    <Spinner size="sm" color="secondary" />
                    : <div className="round-info">
                        <span>
                            <span className="head">Create Letter for : </span><span className="customer-name head-value">{customer?.fullName}</span>
                        </span>
                        <span className="details">
                            <span className="pl-1 pr-1"><span className="head">Current Round: </span><span className="curr-round head-value">{displayInfo?.finalRound}</span></span>
                            <span className="pl-1 pr-1"><span className="head">Round Started: </span><span className="round-status head-value">{displayInfo?.roundStarted}</span></span>
                            <span className="pl-1 pr-1"><span className="head">Round Start Date: </span><span className="round-date head-value">{displayInfo?.date}</span></span>
                        </span>
                    </div>
            }
        </div>
    );
});