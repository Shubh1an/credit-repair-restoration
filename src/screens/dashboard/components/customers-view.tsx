import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import { ICustomerCounts, ICustomerView } from '../../../models/interfaces/customer-view';
import { ClientRoutesConstants, Messages } from '../../../shared/constants';
import { getCustomerCounts } from '../../../actions/dashboard.actions';
import axios, { CancelTokenSource } from 'axios';


const matchDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getCustomerCounts
    }, dispatch);
}
const mapStateToProps = (state: any) => {
    return {
        customerCounts: state.dashboardModel?.customerCounts,
    };
}
export const CustomersViewComponent = connect(mapStateToProps, matchDispatchToProps)((props: CustomerCountsType) => {
    const [axiosSource, setAxiosSource] = useState(axios.CancelToken.source());


    useEffect(() => {
        if (props.isLoading && props.getCustomerCounts) {
            setAxiosSource(axios.CancelToken.source());
            props.getCustomerCounts(axiosSource)
                .then((result: ICustomerCounts) => {
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
                    <Link to={ClientRoutesConstants.customers}>Clients View</Link>
                </div>
            </div>
            <div className="row detailswork border-bottom">
                <div className="col-10   pl-0 pr-0">
                    <Link to={ClientRoutesConstants.customers} >Total Clients</Link>
                </div>
                <div className="col-2   pl-0 pr-0 text-right count">
                    <Link to={ClientRoutesConstants.customers} >
                        <span className="label-custom label label-default">{props?.customerCounts?.customersTotal}</span>
                    </Link>
                </div>
            </div>
            <div className="row detailswork border-bottom">
                <div className="col-10  pl-0 pr-0 col-xs-12">
                    <a href="/" onClick={e => e.preventDefault()} className="no-cursor">Total Entered Today</a>
                </div>
                <div className="col-2  pl-0 pr-0 text-right count">
                    <span className="label-custom label label-default">{props?.customerCounts?.customersToday}</span>
                </div>
            </div>
            <div className="row detailswork">
                <div className="col-10  pl-0 pr-0">
                    <a href="/" onClick={e => e.preventDefault()} className="no-cursor">Total Entered This Week</a>
                </div>
                <div className="col-2  pl-0 pr-0 text-right count">
                    <span className="label-custom label label-default">{props?.customerCounts?.customersThisWeek}</span>
                </div>
            </div>
            <br />
            <div className="row detailswork">
                <div className="col-12 title-widget pl-0">
                    <Link to={ClientRoutesConstants.leads} >Sales Leads</Link>
                </div>
            </div>
            <div className="row detailswork">
                <div className="col-10  pl-0 pr-0">
                    <Link to={ClientRoutesConstants.leads} >Total Sales Leads</Link>
                </div>
                <div className="col-2 pl-0 pr-0 text-right count">
                    <Link to={ClientRoutesConstants.leads} >
                        <span className="label-custom label label-default">{props?.customerCounts?.customersQueue}</span>
                    </Link>
                </div>
            </div>
        </>
    );
});
type CustomerCountsType = ICustomerView & {
    customerCounts: ICustomerCounts,
    getCustomerCounts: (param: any) => any,
}