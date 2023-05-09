import React, { useEffect, useState } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios, { CancelTokenSource } from 'axios';

import './form.scss';
import { DashboardWidget } from '../../../dashboard/components/dashboard-widget';
import { Messages } from '../../../../shared/constants';
import { EnumScreens, ToDoTargetTypes } from '../../../../models/enums';
import AuthService from '../../../../core/services/auth.service';
import { getFranchiseAgentDetails } from '../../../../actions/franchise.actions';
import { InfoComponent } from './tabs/info';
import { FranchiseAgentNotesComponent } from './tabs/notes';
import { FranchiseAgentsCustomersComponent } from './tabs/customers';
import { FranchiseAgentsReferralsComponent } from './tabs/referral-partners';
import { WindowUtils } from '../../../../utils/window-utils';
import { IFranchiseAgent } from '../../../../models/interfaces/franchise';
import { CustomerToDosComponent } from '../../../customer/customer-form/tabs/customer-info/components/customer-todos';

const mapStateToProps = (state: any) => {
    return {
        auth: state.authModel?.auth,
        AuthRules: AuthService.getScreenOject(state.sharedModel.AuthRules, EnumScreens.ViewLeads)
    };
}

const matDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getFranchiseAgentDetails
    }, dispatch);
}

export const FormComponent = connect(mapStateToProps, matDispatchToProps)((props: any) => {

    const [activeTab, setActiveTab] = useState(1);
    const [agent, setAgent] = useState(null as IFranchiseAgent | null);
    const [loading, setLoading] = useState(false);
    const [axiosSource, setAxiosSource] = useState({} as CancelTokenSource);

    useEffect(() => {
        const source = axios.CancelToken.source();
        setAxiosSource(source);
        if (props.id) {
            loadAgentDetails(props.id);
        }
        if (props?.addMode) {
            scrollToForm();
        }
        return () => {
            if (axiosSource?.cancel)
                axiosSource?.cancel(Messages.APIAborted);
        }
    }, [props?.id, props?.addMode]);

    const loadAgentDetails = (id: string) => {
        setLoading(true);
        props?.getFranchiseAgentDetails(id, axiosSource)
            .then((result: any) => {
                setLoading(false);
                setAgent(result);
                scrollToForm();
            }).catch((e: any) => {
                if (!axios.isCancel(e)) {
                    setLoading(false);
                    setAgent(null);
                }
            });
    }
    const scrollToForm = () => {
        WindowUtils.scrollToForm('myScrollToElement');
    }
    const toggle = (tab: number) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    }
    const onReloadData = () => {
        if(props?.onReloadList) {
           props?.onReloadList(); 
        }
        onListReload();
    }
    
    const onListReload = () => {
        if (props.id) {
            loadAgentDetails(props.id);
        }
    }
    return (
        <DashboardWidget className="customer-form" title={props?.addMode ? "Add Company Agent " : <>Company Agent Full View <b className='text-success'>({agent?.fullName || ''})</b></>}
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
                                Agent Info
                            </NavLink>
                        </NavItem>
                        {
                            !AuthService.isFieldHidden(props.AuthRules, 'NotesTab') &&
                            <NavItem>
                                <NavLink className={classnames({ active: activeTab === 2 })} onClick={() => { toggle(2); }}>
                                    <i className="fa fa-comments-o mr-2"></i>
                                    Notes
                                </NavLink>
                            </NavItem>
                        }
                        {
                            !AuthService.isFieldHidden(props.AuthRules, 'CustomersTab') &&
                            <NavItem>
                                <NavLink className={classnames({ active: activeTab === 3 })} onClick={() => { toggle(3); }}>
                                    <i className="fa fa-users mr-2"></i>
                                    Clients
                                </NavLink>
                            </NavItem>
                        }
                        {
                            !AuthService.isFieldHidden(props.AuthRules, 'ReferralTab') &&
                            <NavItem>
                                <NavLink className={classnames({ active: activeTab === 4 })} onClick={() => { toggle(4); }}>
                                    <i className="fa fa-user-circle mr-2"></i>
                                    Referral Partners
                                </NavLink>
                            </NavItem>
                        }
                        {
                            !props?.addMode && !AuthService.isFieldHidden(props.AuthRules, 'ToDoTab') &&
                            <NavItem>
                                <NavLink className={classnames({ active: activeTab === 5 })} onClick={() => { toggle(5); }}>
                                    <i className="pe-7s-note2 mr-2 font-weight-bold f-20"></i>
                                    ToDos
                                </NavLink>
                            </NavItem>
                        }
                    </Nav>
                </>
            }
            <TabContent activeTab={activeTab}>
                <TabPane tabId={1}>
                    {
                        (!props?.addMode ? !!agent : true) &&
                        <InfoComponent agent={agent} addMode={props?.addMode} onReloadList={onReloadData} />
                    }
                </TabPane>
                {
                    !props?.addMode && !!agent &&
                    <>
                        <TabPane tabId={2}>
                            {
                                activeTab === 2 && <FranchiseAgentNotesComponent agent={agent} />
                            }
                        </TabPane>
                        <TabPane tabId={3}>
                            {
                                activeTab === 3 && <FranchiseAgentsCustomersComponent agentId={agent?.id} />
                            }
                        </TabPane>
                        <TabPane tabId={4}>
                            {
                                activeTab === 4 && <FranchiseAgentsReferralsComponent agentId={agent?.id} />
                            }
                        </TabPane>
                        <TabPane tabId={5}>
                            {
                                activeTab === 5 && !props?.addMode && !!agent &&
                                <CustomerToDosComponent id={agent?.id} targetType={ToDoTargetTypes.FRANCHISE_AGENT} />

                            }
                        </TabPane>
                    </>
                }
            </TabContent>
        </DashboardWidget>
    );
});