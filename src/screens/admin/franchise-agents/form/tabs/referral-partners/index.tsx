import axios, { CancelTokenSource } from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

import { DashboardWidget } from '../../../../../dashboard/components/dashboard-widget';
import { ClientRoutesConstants, Messages } from '../../../../../../shared/constants';
import { EnumScreens } from '../../../../../../models/enums';
import AuthService from '../../../../../../core/services/auth.service';
import { getFranchiseAgentReferrals } from '../../../../../../actions/franchise-agents.actions';
import { IReferralPartner } from '../../../../../../models/interfaces/franchise';


const mapStateToProps = (state: any) => {
    return {
        AuthRules: AuthService.getScreenOject(state.sharedModel?.AuthRules, EnumScreens.ViewFranchiseAgents)
    };
}
const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getFranchiseAgentReferrals
    }, dispatch);
}
export const FranchiseAgentsReferralsComponent = connect(mapStateToProps, mapDispatchToProps)(((props: any) => {

    const [referrals, setReferrals] = useState([] as IReferralPartner[]);
    const [axiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadReferrals();
        return () => {
            if (axiosSource?.cancel) {
                axiosSource.cancel(Messages.APIAborted);
            }
        }
    }, [props?.agentId]);

    const loadReferrals = () => {
        setLoading(true);
        props.getFranchiseAgentReferrals(props?.agentId, axiosSource)
            .then((result: any[]) => {
                setLoading(false);
                setReferrals(result || []);
            })
            .catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setLoading(false);
                    toastr.error(err?.response?.data);
                }
            })
    }
    return (
        <DashboardWidget title={'Referral Partners ' + (!loading ? `(${referrals?.length})` : '')} isLoading={loading} allowFullscreen={true} allowMaximize={true} allowMinimize={true} reload={false} >
            <div className="files-list">
                <div className="table-responsive list-scrollable custom-scrollbar">
                    <table className="dataTableCustomers table table-striped table-hover">
                        <thead className="back_table_color">
                            <tr className="secondary">
                                <th style={{ width: '20%' }}>Classification</th>
                                <th style={{ width: '30%' }}>Office Name</th>
                                <th style={{ width: '20%', textAlign: 'center' }}>Telephone</th>
                                <th style={{ width: '20%', textAlign: 'center' }}>Fax</th>
                                <th style={{ width: '10%' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                referrals.length ?
                                    referrals?.map((cust: IReferralPartner, index: number) => {
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    {cust?.classification}
                                                </td>
                                                <td>
                                                    {cust?.name}
                                                </td>
                                                <td className="text-center">
                                                    {cust?.telephone}
                                                </td>
                                                <td className="text-center">
                                                    {cust?.fax}
                                                </td>
                                                <td className="position-relative  d-flex justify-content-around">
                                                    <Link to={ClientRoutesConstants.referralOffices + '/' + cust?.id} >
                                                        <Button color='secondary btn-sm'>View</Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })
                                    :
                                    <tr>
                                        <td colSpan={5} className="text-center text-danger" style={{ height: '150px' }}>
                                            {!loading && <i>No Referral Partners available.</i>}
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