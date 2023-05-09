import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import './dashboard.scss';

import { StatisticsComponent } from './components/statistics-box';
import { DashboardWidget } from './components/dashboard-widget';
import { ClientRoutesConstants } from '../../shared/constants';
import { CustomersViewComponent } from './components/customers-view';
import { ReferralViewComponent } from './components/referral-view';
import { FranchiseViewComponent } from './components/franchise-view';
import { AdminViewComponent } from './components/admin-view';
import { LettersViewComponent } from './components/letter-manager';
import { connect } from 'react-redux';
import AuthService from '../../core/services/auth.service';
import { EnumRoles, EnumScreens } from '../../models/enums';
import { withAuthorize } from '../../shared/hoc/authorize';

const mapStateToProps = (state: any) => {
    return {
        totalCustomers: state.dashboardModel?.customerCounts?.customersTotal,
        totalLeads: state.dashboardModel?.customerCounts?.customersQueue,
        franchiseAgents: state.dashboardModel?.franchises?.franchiseAgentsTotal,
        referralAgents: state.dashboardModel?.referrals?.referralAgentsTotal,
        AuthRules: AuthService.getScreenOject(state.sharedModel?.AuthRules, EnumScreens.Dashboard)
    };
}
class DashboardComponent extends React.PureComponent<any, any> {
    constructor(props: any) {
        super(props);
        this.state = { payload: {}, reloadCustomer: true, reloadReferral: true, reloadFranch: true, reloadAdmin: true, reloadLetter: true };
        this.onCustomerReload = this.onCustomerReload.bind(this);
        this.onAdminReload = this.onAdminReload.bind(this);
        this.onFranchReload = this.onFranchReload.bind(this);
        this.onReferrelReload = this.onReferrelReload.bind(this);
        this.onLettersReload = this.onLettersReload.bind(this);
    }
    componentDidMount() {
        this.setState({
            payload: AuthService.getCurrentJWTPayload()
        });
    }
    onCustomerReload(isError?: boolean) {
        if (!isError)
            this.setState({ reloadCustomer: !this.state.reloadCustomer });
    }
    onAdminReload(isError?: boolean) {
        if (!isError)
            this.setState({ reloadAdmin: !this.state.reloadAdmin });
    }
    onFranchReload(isError?: boolean) {
        if (!isError)
            this.setState({ reloadFranch: !this.state.reloadFranch });
    }
    onReferrelReload(isError?: boolean) {
        if (!isError)
            this.setState({ reloadReferral: !this.state.reloadReferral });
    }
    onLettersReload(isError?: boolean) {
        if (!isError)
            this.setState({ reloadLetter: !this.state.reloadLetter });
    }
    render() {
        const { payload } = this.state;
        return (
            <div className="dashboard">
                <section className="content-header">
                    <div className="header-icon">
                        <i className="fa fa-dashboard"></i>
                    </div>
                    <div className="header-title">
                        <h1>Dashboard</h1>
                        <small>Account Summary and Access to Details.</small>
                    </div>
                </section>
                <section className="content">
                    <div className="row">
                        {
                            payload?.roles === EnumRoles.Customer
                                ?
                                <Redirect to={ClientRoutesConstants.customers + '/' + payload?.cid} />
                                :
                                <>
                                    {
                                        !AuthService.isFieldHidden(this.props.AuthRules, 'ClientsCount')
                                        &&
                                        <div id="totalcustwidget" className=" col-sm-6 col-md-6 col-lg-3">
                                            <Link to={ClientRoutesConstants.customers}>
                                                <StatisticsComponent cssClass={"fa fa-user-plus fa-3x"} param={"  Total Clients"} count={this.props?.totalCustomers} />
                                            </Link>
                                        </div>
                                    }
                                    {
                                        !AuthService.isFieldHidden(this.props.AuthRules, 'LeadsCount')
                                        &&
                                        <div className=" col-sm-6 col-md-6 col-lg-3">
                                            <Link to={ClientRoutesConstants.leads}>
                                                <StatisticsComponent cssClass={"fa fa-files-o fa-3x"} param={" Leads"} count={this.props?.totalLeads} />
                                            </Link>
                                        </div>
                                    }
                                    {
                                        !AuthService.isFieldHidden(this.props.AuthRules, 'FranchiseAgentsCount')
                                        &&
                                        <div className=" col-sm-6 col-md-6 col-lg-3">
                                            <Link to={ClientRoutesConstants.franchiseAgents}>
                                                <StatisticsComponent cssClass={"fa fa-user-secret fa-3x"} param={"  Company Agents"} count={this.props?.franchiseAgents} />
                                            </Link>
                                        </div>
                                    }
                                    {
                                        !AuthService.isFieldHidden(this.props.AuthRules, 'ReferralAgentsCount')
                                        &&
                                        <div className=" col-sm-6 col-md-6 col-lg-3">
                                            <Link to={ClientRoutesConstants.referralAgents}>
                                                <StatisticsComponent cssClass={"fa fa-handshake-o fa-3x"} param={"  Affiliate Agents"} count={this.props?.referralAgents} />
                                            </Link>
                                        </div>
                                    }
                                </>
                        }

                    </div>
                    {payload?.roles !== EnumRoles.Customer &&
                        <>
                            <div className="row">
                                {
                                    !AuthService.isFieldHidden(this.props.AuthRules, 'ClientWidget')
                                    &&
                                    <div className="col-12 col-sm-6 col-lg-4  pinpin lobicard-parent-sortable ui-sortable" >
                                        <DashboardWidget title={"Clients View"} className="min-height-260" reloadHandler={this.onCustomerReload}
                                            isLoading={this.state.reloadCustomer}
                                            allowFullscreen={true} allowMaximize={true} allowMinimize={true} reload={true} >
                                            <CustomersViewComponent isLoading={this.state.reloadCustomer} reloadComplete={this.onCustomerReload} />
                                        </DashboardWidget>

                                    </div>
                                }
                                {
                                    !AuthService.isFieldHidden(this.props.AuthRules, 'FranchiseWidget')
                                    &&
                                    <div className="col-12 col-sm-6 col-lg-4 pinpin lobicard-parent-sortable ui-sortable" >
                                        <DashboardWidget title={"Company View"} className="min-height-260" reloadHandler={this.onFranchReload}
                                            isLoading={this.state.reloadFranch}
                                            allowFullscreen={true} allowMaximize={true} allowMinimize={true} reload={true} >
                                            <FranchiseViewComponent isLoading={this.state.reloadFranch} reloadComplete={this.onFranchReload} />
                                        </DashboardWidget>
                                    </div>
                                }
                                {
                                    !AuthService.isFieldHidden(this.props.AuthRules, 'ReferralWidget')
                                    &&
                                    <div className="col-12 col-sm-6 col-lg-4 pinpin lobicard-parent-sortable ui-sortable" >
                                        <DashboardWidget title={"Affiliate View"} className="min-height-260" reloadHandler={this.onReferrelReload}
                                            isLoading={this.state.reloadReferral}
                                            allowFullscreen={true} allowMaximize={true} allowMinimize={true} reload={true} >
                                            <ReferralViewComponent isLoading={this.state.reloadReferral} reloadComplete={this.onReferrelReload} />
                                        </DashboardWidget>
                                    </div>
                                }
                                {
                                    !AuthService.isFieldHidden(this.props.AuthRules, 'LetterWidget')
                                    &&
                                    <div className="col-12 col-sm-6 col-lg-4 pinpin lobicard-parent-sortable ui-sortable">
                                        <DashboardWidget title={"Letter Manager"} reloadHandler={this.onLettersReload}
                                            isLoading={this.state.reloadLetter} className=" pt-1 min-height-260 "
                                            allowFullscreen={true} allowMaximize={true} allowMinimize={true} reload={true} >
                                            <LettersViewComponent isLoading={this.state.reloadLetter} reloadComplete={this.onLettersReload} />
                                        </DashboardWidget>
                                    </div>
                                }
                                {
                                    !AuthService.isFieldHidden(this.props.AuthRules, 'AdminWidget')
                                    &&
                                    <div className="col-12 col-sm-6  col-lg-4 pinpin lobicard-parent-sortable ui-sortable">
                                        <DashboardWidget title={"Administration View"} className="min-height-260" reloadHandler={this.onAdminReload}
                                            isLoading={this.state.reloadAdmin}
                                            allowFullscreen={true} allowMaximize={true} allowMinimize={true} reload={true} >
                                            <AdminViewComponent isLoading={this.state.reloadAdmin} reloadComplete={this.onAdminReload} />
                                        </DashboardWidget>
                                    </div>
                                }
                            </div>
                        </>
                    }
                </section>
            </div>
        );
    }
}
export default connect(mapStateToProps)(withAuthorize(DashboardComponent, EnumScreens.Dashboard));