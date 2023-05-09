import React, { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { ICustomerFilter, ICustomerShort, ISelectCustomer } from '../../models/interfaces/customer-view';
import { getCustomers } from '../../actions/customers.actions';
import axios from 'axios';
import { Messages } from '../constants';
import AuthService from '../../core/services/auth.service';
import { LargeSpinner } from './large-spinner';

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getCustomers,
    }, dispatch);
}
export const SelectCustomerComponent = connect(null, mapDispatchToProps)((props: ISelectCustomer) => {
    const [axiosSource] = useState(axios.CancelToken.source());
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState({
        ExcludeCancelled: true,
        ExcludeComplete: true,
        ExcludeOnHold: true,
        allMustMatch: true
    } as ICustomerFilter);
    const [customers, setCustomers] = useState([] as ICustomerShort[]);

    useEffect(() => {
        const payload = AuthService.getCurrentJWTPayload();
        setFilter({
            ...filter,
            MembershipId: payload?.membershipId,
            SiteId: payload?.siteId
        });
        return () => {
            axiosSource?.cancel(Messages.APIAborted);
        };
    }, []);

    useEffect(() => {
        const loadCustomers = () => {
            setIsLoading(true);
            props.getCustomers(filter, axiosSource)
                .then((data: any) => {
                    setCustomers(data?.customers);
                    setIsLoading(false);
                }).catch((err: any) => {
                    if (!axios.isCancel(err)) {
                        setCustomers([]);
                        setIsLoading(false);
                    }
                })
        }
        if (filter && filter?.MembershipId && filter?.SiteId) {
            loadCustomers();
        }
    }, [filter]);
    return (
        <div className="select-customer customers-list">
            <div className="customer-grid">
                <div className="table-responsive list-scrollable custom-scrollbar">
                    <table className="dataTableCustomers table table-striped table-hover">
                        <thead className="back_table_color">
                            <tr className="secondary">
                                <th style={{ width: '17%' }}>Last Name</th>
                                <th style={{ width: '18%' }}>First Name</th>
                                <th style={{ width: '20%' }}>CSS Agent</th>
                                <th style={{ width: '20%' }}>Affiliate Agent</th>
                                <th style={{ width: '15%' }}>Status</th>
                                <th align="center" style={{ width: '10%' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                customers?.map((cust: ICustomerShort, index: number) => {
                                    return (
                                        <tr key={index}>
                                            <td>{cust?.lastName} </td>
                                            <td>{cust?.firstName}</td>
                                            <td>{cust?.franchiseAgentName}</td>
                                            <td>{cust?.referralAgentName}</td>
                                            <td>{cust?.statusName}</td>
                                            <td className="table-controls">
                                                <button className="btn btn-secondary btn-sm ml-2" title="select" onClick={() => {
                                                    props.onSelect(cust);
                                                    props.onClose(cust);
                                                }}>Select</button>
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                            {
                                !customers?.length && !isLoading
                                && <tr>
                                    <td colSpan={6}>
                                        <div className="no-records">
                                            <h1> No Records Found!! </h1>
                                        </div>
                                    </td>
                                </tr>
                            }
                            {
                                isLoading &&
                                <tr>
                                    <td colSpan={6} className="p-0">
                                        <div style={{ minHeight: '200px' }} className="position-relative">
                                            <LargeSpinner />
                                        </div>
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
});