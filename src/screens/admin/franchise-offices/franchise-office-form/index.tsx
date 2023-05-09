import React, { useEffect, useState } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';
import { scroller } from 'react-scroll';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios, { CancelTokenSource } from 'axios';
import toastr from 'toastr';

import './franchise-office-form.scss';
import { DashboardWidget } from '../../../dashboard/components/dashboard-widget';
import { CustomerFranchiseOfficeInfoComponent } from './tabs/franchise-office-info';
import { getFranchiseOfficeDetails, getFranchiseOfficePaymentMethods, getFranchiseOfficeServices } from '../../../../actions/franchise.actions';
import { Messages } from '../../../../shared/constants';
import { EnumScreens } from '../../../../models/enums';
import { IScreenProps } from '../../../../models/interfaces/shared';
import AuthService from '../../../../core/services/auth.service';
import { FranchiseAgentsComponent } from './tabs/agents';
import { FranchiseOfficeServicesComponent } from './tabs/services';
import { FranchiseOfficePaymentComponent } from './tabs/payment-methods';
import { IFranchiseAgent, IFranchiseOffice } from '../../../../models/interfaces/franchise';
import { getFranchiseAgents } from '../../../../actions/franchise.actions';
import { SiteForms } from './tabs/site-forms';
import { OfficeEmailTemplates } from './tabs/email-templates';
import { asyncComponent } from '../../../../shared/components/async-component';

const AsyncOutsourcedFranchiseServicesComponent = asyncComponent(() => import('./tabs/services/outsourced-services/index'));


const mapStateToProps = (state: any) => {
    return {
        auth: state.authModel?.auth,
        AuthRules: AuthService.getScreenOject(state.sharedModel.AuthRules, EnumScreens.ViewFranchiseOffices)
    };
}

const matDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getFranchiseOfficeDetails,
        getFranchiseOfficePaymentMethods, getFranchiseOfficeServices,
        getFranchiseAgents,
    }, dispatch);
}

export const FranchiseOfficeFormComponent = connect(mapStateToProps, matDispatchToProps)((props: {
    id?: string;
    addMode?: boolean;
    getFranchiseOfficeDetails: any,
    getFranchiseOfficePaymentMethods: any,
    getFranchiseOfficeServices: any,
    getFranchiseAgents: any,
    getAdminSettings?: any;
    onReloadOfficesList?: any;
    AuthRules: IScreenProps | null
}) => {

    const [activeTab, setActiveTab] = useState(1);
    const [isSiteOutsourced, setIsSiteOutsourced] = useState(false);
    const [franchiseOffice, setFranchiseOffice] = useState(null as IFranchiseOffice | null);
    const [loading, setLoading] = useState(false);
    const [axiosSource, setAxiosSource] = useState({} as CancelTokenSource);
    const [agents, setAgents] = useState([] as IFranchiseAgent[]);

    useEffect(() => {
        const source = axios.CancelToken.source();
        setAxiosSource(source);
        setIsSiteOutsourced(AuthService.getCurrentJWTPayload()?.isOutsourced?.toString() === 'true');
        if (props.id) {
            loadOfficeDetails(props.id);
            loadAgents();
        }
        setTimeout(() => {
            scroller.scrollTo('myScrollToElement', {
                duration: 1000,
                delay: 10,
                smooth: true
            });
        }, 0);
        return () => {
            if (axiosSource?.cancel)
                axiosSource?.cancel(Messages.APIAborted);
        }
    }, [props?.id, props?.addMode]);

    const loadOfficeDetails = (id: string) => {
        setLoading(true);
        props?.getFranchiseOfficeDetails(id, axiosSource)
            .then((result: any) => {
                setLoading(false);
                setFranchiseOffice(result);
            }).catch((e: any) => {
                if (!axios.isCancel(e)) {
                    setLoading(false);
                    setFranchiseOffice(null);
                }
            });
    }
    const loadAgents = () => {
        setLoading(true);
        props?.getFranchiseAgents(props.id, axiosSource)
            .then((result: any) => {
                setLoading(false);
                setAgents(result);
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setLoading(false);
                    toastr.error(err?.response?.data);
                }
            })
    }
    const toggle = (tab: number) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    }
    const onReloadData = () => {
        if(props?.onReloadOfficesList) {
           props?.onReloadOfficesList(); 
        }
        onListReload();
    }
    const onListReload = () => {
        if (props.id) {
            loadOfficeDetails(props.id);
            loadAgents();
        }
    }
    return (
        <DashboardWidget className="customer-form" title={props?.addMode ? "Add Company Office " : <>Company Office Full View <b className='text-success'>({franchiseOffice?.name || ''})</b></>}
            isLoading={loading} reloadHandler={onListReload}
            allowFullscreen={true} allowMaximize={true} allowMinimize={true}
            reload={true} >
            {
                !props?.addMode &&
                <>
                    <Nav tabs className={classnames("customers-full-view-tabs")}>
                        <NavItem>
                            <NavLink className={classnames({ active: activeTab === 1 })} onClick={() => { toggle(1); }}>
                                <i className="fa fa-user mr-2"></i>
                                Office Info
                            </NavLink>
                        </NavItem>
                        {
                            !AuthService.isFieldHidden(props.AuthRules, 'AgentsTab') &&
                            <NavItem>
                                <NavLink className={classnames({ active: activeTab === 2 })} onClick={() => { toggle(2); }}>
                                    <i className="fa fa-users mr-2"></i>
                                    Agents
                                </NavLink>
                            </NavItem>
                        }
                        {
                            !AuthService.isFieldHidden(props.AuthRules, 'ServicesTab') &&
                            <NavItem>
                                <NavLink className={classnames({ active: activeTab === 3 })} onClick={() => { toggle(3); }}>
                                    <i className="fa fa-tasks mr-2"></i>
                                    Services
                                </NavLink>
                            </NavItem>
                        }
                        {
                            !AuthService.isFieldHidden(props.AuthRules, 'PaymentsTab') &&
                            <NavItem>
                                <NavLink className={classnames({ active: activeTab === 4 })} onClick={() => { toggle(4); }} >
                                    <i className="fa fa-money mr-2"></i>
                                    Payments
                                </NavLink>
                            </NavItem>
                        }
                        {
                            !AuthService.isFieldHidden(props.AuthRules, 'FormsTab') &&
                            <NavItem>
                                <NavLink className={classnames({ active: activeTab === 5 })} onClick={() => { toggle(5); }} >
                                    <i className="fa fa-table mr-2"></i>
                                    Form Options
                                </NavLink>
                            </NavItem>
                        }
                        {
                            !AuthService.isFieldHidden(props.AuthRules, 'EmailTemplatesTab') &&
                            <NavItem>
                                <NavLink className={classnames({ active: activeTab === 6 })} onClick={() => { toggle(6); }} >
                                    <i className="fa fa-envelope-o mr-2"></i>
                                    Email Templates
                                </NavLink>
                            </NavItem>
                        }
                    </Nav>
                </>
            }
            <TabContent activeTab={activeTab}>
                <TabPane tabId={1}>
                    {
                        (!props?.addMode ? !!franchiseOffice : true) &&
                        <CustomerFranchiseOfficeInfoComponent office={franchiseOffice} agents={agents} addMode={props?.addMode}
                            onReloadOfficesList={onReloadData} />
                    }
                </TabPane>
                {
                    !props?.addMode && !!franchiseOffice &&
                    <>
                        <TabPane tabId={2}>
                            <FranchiseAgentsComponent loadOffices={props.onReloadOfficesList} loadAgents={loadAgents} agents={agents} officeId={franchiseOffice?.id} />
                        </TabPane>
                        <TabPane tabId={3}>
                            {activeTab === 3 && !isSiteOutsourced && <FranchiseOfficeServicesComponent officeId={franchiseOffice?.id} />}
                            {activeTab === 3 && isSiteOutsourced && <AsyncOutsourcedFranchiseServicesComponent officeId={franchiseOffice?.id} />}
                        </TabPane>
                        <TabPane tabId={4}>
                            {activeTab === 4 && <FranchiseOfficePaymentComponent officeId={franchiseOffice?.id} />}
                        </TabPane>
                        <TabPane tabId={5}>
                            {activeTab === 5 && <SiteForms officeId={franchiseOffice?.id} />}
                        </TabPane>
                        <TabPane tabId={6}>
                            {activeTab === 6 && <OfficeEmailTemplates officeId={franchiseOffice?.id} />}
                        </TabPane>
                    </>
                }
            </TabContent>
        </DashboardWidget>
    );
});