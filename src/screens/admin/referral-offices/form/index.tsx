import React, { useEffect, useState } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';
import { scroller } from 'react-scroll';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios, { CancelTokenSource } from 'axios';
import toastr from 'toastr';

import './form.scss';
import { DashboardWidget } from '../../../dashboard/components/dashboard-widget';
import { ReferralOfficeInfoComponent } from './tabs/info';
import { getReferralOfficeDetails, getReferralAgents } from '../../../../actions/referral.actions';
import { getFranchiseAgents } from '../../../../actions/customers.actions';
import { getStates } from '../../../../shared/actions/shared.actions';
import { Messages } from '../../../../shared/constants';
import { EnumScreens } from '../../../../models/enums';
import { IDropdown, IScreenProps } from '../../../../models/interfaces/shared';
import AuthService from '../../../../core/services/auth.service';
import { ReferralAgentsComponent } from './tabs/agents';
import { IFranchiseAgent, IReferralOffice } from '../../../../models/interfaces/franchise';

const mapStateToProps = (state: any) => {
    return {
        auth: state.authModel?.auth,
        AuthRules: AuthService.getScreenOject(state.sharedModel.AuthRules, EnumScreens.ViewReferralOffices)
    };
}

const matDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getReferralOfficeDetails,
        getReferralAgents,
    }, dispatch);
}

export const ReferralOfficeFormComponent = connect(mapStateToProps, matDispatchToProps)((props: {
    id?: string;
    addMode?: boolean;
    getReferralOfficeDetails: any,
    getReferralAgents: any,
    onReloadOfficesList?: any;
    AuthRules: IScreenProps | null
}) => {

    const [activeTab, setActiveTab] = useState(1);
    const [referralOffice, setReferralOffice] = useState(null as IReferralOffice | null);
    const [loading, setLoading] = useState(false);
    const [axiosSource, setAxiosSource] = useState({} as CancelTokenSource);
    const [agents, setAgents] = useState([] as IFranchiseAgent[]);
    const [fAgents, setFAgents] = useState([] as IFranchiseAgent[]);
    const [states, setStates] = useState([] as IDropdown[]);

    useEffect(() => {
        const source = axios.CancelToken.source();
        setAxiosSource(source);
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

    useEffect(() => {
        loadFranchiseAgentsAndStates();
    }, []);

    const loadOfficeDetails = (id: string) => {
        setLoading(true);
        props?.getReferralOfficeDetails(id, axiosSource)
            .then((result: any) => {
                setLoading(false);
                setReferralOffice(result);
            }).catch((e: any) => {
                if (!axios.isCancel(e)) {
                    setLoading(false);
                    setReferralOffice(null);
                }
            });
    }
    const loadAgents = () => {
        setLoading(true);
        props?.getReferralAgents(props.id, axiosSource)
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
    const loadFranchiseAgentsAndStates = () => {
        Promise.all([getFranchiseAgents(axiosSource), getStates(axiosSource)])
            .then((results: any[]) => {
                setFAgents(results[0]);
                setStates(results[1]);
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
        <DashboardWidget className="customer-form" title={props?.addMode ? "Add Affiliate Office " : <>Affiliate Office Full View <b className='text-success'>({referralOffice?.name || ''})</b></>}
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
                    </Nav>
                </>
            }
            <TabContent activeTab={activeTab}>
                <TabPane tabId={1}>
                    {
                        (!props?.addMode ? !!referralOffice : true) &&
                        <ReferralOfficeInfoComponent office={referralOffice} agents={agents} fAgents={fAgents} states={states} addMode={props?.addMode}
                            onReloadOfficesList={onReloadData} />
                    }
                </TabPane>
                {
                    !props?.addMode && !!referralOffice &&
                    <>
                        <TabPane tabId={2}>
                            <ReferralAgentsComponent loadOffices={props.onReloadOfficesList} loadAgents={loadAgents} agents={agents} officeId={referralOffice?.id} />
                        </TabPane>
                    </>
                }
            </TabContent>
        </DashboardWidget>
    );
});