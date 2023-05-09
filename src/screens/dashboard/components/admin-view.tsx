import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';

import { ICustomerView, IRoleCounts } from '../../../models/interfaces/customer-view';
import { getRolesCounts } from '../../../actions/dashboard.actions';
import { ClientRoutesConstants, Messages } from '../../../shared/constants';
import { Link } from 'react-router-dom';


const matchDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getRolesCounts
    }, dispatch);
}
const mapStateToProps = (state: any) => {
    return {
        dashboardRoles: state.dashboardModel?.dashboardRoles,
    };
}
export const AdminViewComponent = connect(mapStateToProps, matchDispatchToProps)((props: RolesCountsType) => {

    const [axiosSource, setAxiosSource] = useState(axios.CancelToken.source());
    useEffect(() => {
        return () => {
            axiosSource?.cancel(Messages.APIAborted);
        }
    }, []);

    useEffect(() => {
        if (props.isLoading && props.getRolesCounts) {
            setAxiosSource(axios.CancelToken.source());
            props.getRolesCounts(axiosSource)
                .then((result: IRoleCounts) => {
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
                    <a href="/" onClick={e => e.preventDefault()}>User Accounts</a>
                </div>
            </div>
            {
                props?.dashboardRoles?.administrator
                &&
                <div className="row detailswork border-bottom">
                    <div className="col-10 pl-0 pr-0">
                        <a href="/" onClick={e => e.preventDefault()} className="no-cursor">Total Administrators</a>
                    </div>
                    <div className="col-2 pl-0 pr-0 text-right count">
                        <span className="label-custom label label-default">{props.dashboardRoles['administrator']}</span>
                    </div>
                </div>
            }
            {
                props.dashboardRoles && props.dashboardRoles['credit Agent'] &&
                <div className="row detailswork border-bottom">
                    <div className="col-10  pl-0 pr-0 ">
                        <Link to={ClientRoutesConstants.franchiseAgents} >Credit Agents</Link>
                    </div>
                    <div className="col-2 pl-0 pr-0 text-right count">
                        <span className="label-custom label label-default">{props.dashboardRoles['credit Agent']}</span>
                    </div>
                </div>

            }
            {
                props?.dashboardRoles?.customer &&
                <div className="row detailswork border-bottom">
                    <div className="col-10  pl-0 pr-0 ">
                        <Link to={ClientRoutesConstants.customers} >Clients</Link>
                    </div>
                    <div className="col-2 pl-0 pr-0 text-right count">
                        <Link to={ClientRoutesConstants.customers} >
                            <span className="label-custom label label-default">{props.dashboardRoles['customer']}</span>
                        </Link>
                    </div>
                </div>
            }
            {
                props?.dashboardRoles?.lead &&
                <div className="row detailswork border-bottom">
                    <div className="col-10 pl-0 pr-0">
                        <Link to={ClientRoutesConstants.leads} >Leads</Link>
                    </div>
                    <div className="col-2 pl-0 pr-0 text-right count">
                        <Link to={ClientRoutesConstants.leads} >
                            <span className="label-custom label label-default">{props.dashboardRoles['lead'] || 'NA'}</span>
                        </Link>
                    </div>
                </div>

            }
            {
                props.dashboardRoles && props.dashboardRoles['office Manager'] &&
                <div className="row detailswork border-bottom" >
                    <div className="col-10 pl-0 pr-0">
                        <a href="/" onClick={e => e.preventDefault()} className="no-cursor">Office Managers</a>
                    </div>
                    <div className="col-2 pl-0 pr-0 text-right count">
                        <span className="label-custom label label-default">{props.dashboardRoles['office Manager'] || 'NA'}</span>
                    </div>
                </div>
            }
            {
                props?.dashboardRoles && props?.dashboardRoles['referral Agent'] &&
                <div className="row detailswork border-bottom">
                    <div className="col-10 pl-0 pr-0">
                        <Link to={ClientRoutesConstants.referralAgents} >Affiliate Agents</Link>
                    </div>
                    <div className="col-2 pl-0 pr-0 text-right count">
                        <Link to={ClientRoutesConstants.referralAgents} >
                            <span className="label-custom label label-default">{props.dashboardRoles['referral Agent']}</span>
                        </Link>
                    </div>
                </div>
            }
            {
                props?.dashboardRoles && props?.dashboardRoles['referral Manager'] &&
                <div className="row detailswork">
                    <div className="col-10 pl-0 pr-0">
                        <a href="/" onClick={e => e.preventDefault()} className="no-cursor">Referral Managers</a>
                    </div>
                    <div className="col-2 pl-0 pr-0 text-right count">
                        <span className="label-custom label label-default">{props.dashboardRoles['referral Manager']}</span>
                    </div>
                </div>
            }
        </>
    );
})
type RolesCountsType = ICustomerView & {
    dashboardRoles: IRoleCounts,
    getRolesCounts: (param: any) => any,
}