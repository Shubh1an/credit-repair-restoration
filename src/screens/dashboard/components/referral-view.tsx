import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

import { ICustomerView, IReferralCounts } from '../../../models/interfaces/customer-view';
import { getReferralCounts } from '../../../actions/dashboard.actions';
import { ClientRoutesConstants, Messages } from '../../../shared/constants';
import { Link } from 'react-router-dom';


const matchDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getReferralCounts
    }, dispatch);
}
const mapStateToProps = (state: any) => {
    return {
        referrals: state.dashboardModel?.referrals
    };
}

export const ReferralViewComponent = connect(mapStateToProps, matchDispatchToProps)((props: ReferralCountsType) => {
    const [axiosSource, setAxiosSource] = useState(axios.CancelToken.source());
    useEffect(() => {
        return () => {
            axiosSource?.cancel(Messages.APIAborted);
        }
    }, []);

    useEffect(() => {
        if (props.isLoading && props.getReferralCounts) {
            setAxiosSource(axios.CancelToken.source());
            props.getReferralCounts(axiosSource)
                .then((result: IReferralCounts) => {
                    props.reloadComplete();
                })
                .catch((error: any) => {
                    props.reloadComplete(true);
                })
        }
    }, [props.isLoading])
    return (
        <>
            <div className="row detailswork">
                <div className="col-12 title-widget pl-0">
                    <Link to={ClientRoutesConstants.referralOffices} >Affiliate Offices</Link>
                </div>
            </div>
            <div className="row detailswork border-bottom">
                <div className="col-10 pl-0 pr-0">
                    <a href="/" onClick={e => e.preventDefault()} className="no-cursor">Total Affiliate Offices</a>
                </div>
                <div className="col-2 pl-0 pr-0 text-right count">
                    <span className="label-custom label label-default">{props?.referrals?.referralOfficesTotal}</span>
                </div>
            </div>
            <div className="row detailswork border-bottom">
                <div className="col-10  pl-0 pr-0">
                    <a href="/" onClick={e => e.preventDefault()} className="no-cursor">Total Entered Today</a>
                </div>
                <div className="col-2 pl-0 pr-0 text-right count">
                    <span className="label-custom label label-default">{props?.referrals?.referralOfficesToday}</span>
                </div>
            </div>
            <div className="row detailswork">
                <div className="col-10 pl-0 pr-0">
                    <a href="/" onClick={e => e.preventDefault()} className="no-cursor">Total Entered This Week</a>
                </div>
                <div className="col-2 pl-0 pr-0 text-right count">
                    <span className="label-custom label label-default">{props?.referrals?.referralOfficesThisWeek}</span>
                </div>
            </div>
            <br />
            <div className="row detailswork">
                <div className="col-12 title-widget pl-0">
                    <Link to={ClientRoutesConstants.referralAgents} >Affiliate Agents</Link>
                </div>
            </div>
            <div className="row detailswork border-bottom">
                <div className="col-10 pl-0 pr-0">
                    <Link to={ClientRoutesConstants.referralAgents} >Total Affiliate Agents</Link>
                </div>
                <div className="col-2 pl-0 pr-0 text-right count">
                    <Link to={ClientRoutesConstants.referralAgents} >
                        <span className="label-custom label label-default">{props?.referrals?.referralAgentsTotal}</span>
                    </Link>
                </div>
            </div>
            <div className="row detailswork border-bottom">
                <div className="col-10  pl-0 pr-0">
                    <a href="/" onClick={e => e.preventDefault()} className="no-cursor">Total Entered Today</a>
                </div>
                <div className="col-2 pl-0 pr-0 text-right count">
                    <span className="label-custom label label-default">{props?.referrals?.referralAgentsToday}</span>
                </div>
            </div>
            <div className="row detailswork">
                <div className="col-10 pl-0 pr-0">
                    <a href="/" onClick={e => e.preventDefault()} className="no-cursor">Total Entered This Week</a>
                </div>
                <div className="col-2 pl-0 pr-0 text-right count">
                    <span className="label-custom label label-default">{props?.referrals?.referralAgentsThisWeek}</span>
                </div>
            </div>
        </>
    );
})

type ReferralCountsType = ICustomerView & {
    referrals: IReferralCounts,
    getReferralCounts: (param: any) => any
}