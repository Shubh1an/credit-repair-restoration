import axios, { CancelTokenSource } from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

import { ICustomerFullDetails } from '../../../../../../models/interfaces/customer-view';
import { DashboardWidget } from '../../../../../dashboard/components/dashboard-widget';
import { ClientRoutesConstants, Messages } from '../../../../../../shared/constants';
import { EnumScreens } from '../../../../../../models/enums';
import AuthService from '../../../../../../core/services/auth.service';
import { getFranchiseAgentCustomers } from '../../../../../../actions/franchise-agents.actions';


const mapStateToProps = (state: any) => {
    return {
        AuthRules: AuthService.getScreenOject(state.sharedModel?.AuthRules, EnumScreens.ViewFranchiseAgents)
    };
}
const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getFranchiseAgentCustomers
    }, dispatch);
}
export const FranchiseAgentsCustomersComponent = connect(mapStateToProps, mapDispatchToProps)(((props: any) => {

    const [customers, setCustomers] = useState([] as ICustomerFullDetails[]);
    const [axiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadCustomers();
        return () => {
            if (axiosSource?.cancel) {
                axiosSource.cancel(Messages.APIAborted);
            }
        }
    }, [props?.agentId]);

    const loadCustomers = () => {
        setLoading(true);
        props.getFranchiseAgentCustomers(props?.agentId, axiosSource)
            .then((result: any[]) => {
                setLoading(false);
                setCustomers(result || []);
            })
            .catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setLoading(false);
                    toastr.error(err?.response?.data);
                }
            })
    }
    return (
        <DashboardWidget title={'Clients ' + (!loading ? `(${customers?.length})` : '')} isLoading={loading} allowFullscreen={true} allowMaximize={true} allowMinimize={true} reload={false} >
            <div className="files-list">
                <div className="table-responsive list-scrollable custom-scrollbar">
                    <table className="dataTableCustomers table table-striped table-hover">
                        <thead className="back_table_color">
                            <tr className="secondary">
                                <th style={{ width: '20%' }}>Name</th>
                                <th style={{ width: '20%', textAlign: 'center' }}>Telephone</th>
                                <th style={{ width: '20%', textAlign: 'center' }}>Cellphone</th>
                                <th style={{ width: '20%' }}>Email</th>
                                <th style={{ width: '15%', textAlign: 'center' }}>Status</th>
                                <th style={{ width: '5%' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                customers.length ?
                                    customers?.map((cust: ICustomerFullDetails, index: number) => {
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    {cust?.fullName}
                                                </td>
                                                <td className='text-center'>
                                                    {cust?.telephone}
                                                </td>
                                                <td className='text-center'>
                                                    {cust?.cellPhone}
                                                </td>
                                                <td>
                                                    {cust?.email?.toLowerCase()}
                                                </td>
                                                <td className='text-center'>
                                                    <span className={"status " + cust?.statusName?.toLowerCase()}>{cust?.statusName}</span>
                                                </td>
                                                <td className="position-relative  d-flex justify-content-around">
                                                    <Link to={ClientRoutesConstants.customers + '/' + cust?.id} >
                                                        <Button color='secondary btn-sm'>View</Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })
                                    :
                                    <tr>
                                        <td colSpan={6} className="text-center text-danger" style={{ height: '150px' }}>
                                            {!loading && <i>No Clients available.</i>}
                                        </td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardWidget>
    );
}));