import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

import { ICustomerView, IFranchiseCounts, IReferralCounts } from '../../../models/interfaces/customer-view';
import { getFranchiseCounts } from '../../../actions/dashboard.actions';
import { ClientRoutesConstants, Messages } from '../../../shared/constants';
import { Link } from 'react-router-dom';


const matchDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getFranchiseCounts
    }, dispatch);
}
const mapStateToProps = (state: any) => {
    return {
        franchises: state.dashboardModel?.franchises,
    };
}
export const FranchiseViewComponent = connect(mapStateToProps, matchDispatchToProps)((props: FranchCountsType) => {
    const [axiosSource, setAxiosSource] = useState(axios.CancelToken.source());
    useEffect(() => {
        return () => {
            axiosSource?.cancel(Messages.APIAborted);
        }
    }, []);

    useEffect(() => {
        if (props.isLoading && props.getFranchiseCounts) {
            setAxiosSource(axios.CancelToken.source());
            props.getFranchiseCounts(axiosSource)
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
                    <Link to={ClientRoutesConstants.franchiseOffices} >Company Office</Link>
                </div>
            </div>
            <div className="row detailswork">
                <div className="col-10 pl-0 pr-0">
                    <a href="/" onClick={e => e.preventDefault()} className="no-cursor">Total Company Offices</a>
                </div>
                <div className="col-2 pl-0 pr-0 text-right count">
                    <Link to={ClientRoutesConstants.franchiseOffices} >
                        <span className="label-custom label label-default">{props?.franchises?.franchiseOfficesTotal}</span>
                    </Link>
                </div>
            </div>
            <br />
            <div className="row detailswork">
                <div className="col-12 title-widget pl-0">
                    <Link to={ClientRoutesConstants.franchiseAgents} >Company Agents</Link>
                </div>
            </div>
            <div className="row detailswork border-bottom">
                <div className="col-10 pl-0 pr-0">
                    <Link to={ClientRoutesConstants.franchiseAgents} >Total Company Agents</Link>
                </div>
                <div className="col-2 pl-0 pr-0 text-right count">
                    <Link to={ClientRoutesConstants.franchiseAgents} >
                        <span className="label-custom label label-default">{props?.franchises?.franchiseAgentsTotal}</span>
                    </Link>
                </div>
            </div>
            <div className="row detailswork border-bottom">
                <div className="col-10  pl-0 pr-0 ">
                    <a href="/" onClick={e => e.preventDefault()} className="no-cursor">Total Entered Today</a>
                </div>
                <div className="col-2 pl-0 pr-0 text-right count">
                    <span className="label-custom label label-default">{props?.franchises?.franchiseAgentsToday}</span>
                </div>
            </div>
            <div className="row detailswork">
                <div className="col-10 pl-0 pr-0">
                    <a href="/" onClick={e => e.preventDefault()} className="no-cursor">Total Entered This Week</a>
                </div>
                <div className="col-2 pl-0 pr-0 text-right count">
                    <span className="label-custom label label-default">{props?.franchises?.franchiseAgentsThisWeek}</span>
                </div>
            </div>
        </>
    );
})

type FranchCountsType = ICustomerView & {
    franchises: IFranchiseCounts,
    getFranchiseCounts: (param: any) => any
}