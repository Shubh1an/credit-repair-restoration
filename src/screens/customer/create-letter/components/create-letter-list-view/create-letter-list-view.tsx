import React, { useState } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';
import { useParams } from 'react-router-dom';
import './create-letter-list-view.scss';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { DashboardWidget } from './../../../../dashboard/components/dashboard-widget';
import { CreateDisputeLetterHistoryComponent } from './tabs/dispute-letter-history/';
import { CreateTempLetterQueueComponent } from './tabs/temp-letter-queue/index';
import { CreateLetterAccountListComponent } from './tabs/accounts/index';
import { saveActiveTabNumber } from '../../../../../actions/create-letter.actions';

const mapStateToProps = (state: any) => {
    return {
        model: state.createLetterModel
    }
}
const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        saveActiveTabNumber
    }, dispatch);
}
export const CreateLetterListViewComponent = connect(mapStateToProps, mapDispatchToProps)((props: any) => {
    const { cid } = useParams() as { cid: string };

    return (
        <DashboardWidget hideHeader={true} className="create-letter-list-view" title="Temp letter">
            <Nav tabs className={classnames("create-letter-list-view-tabs")}>
                <NavItem>
                    <NavLink className={classnames({ active: props?.model?.activeTab === 1 })} onClick={() => { props.saveActiveTabNumber(1); }}>
                        <i className="fa fa-user mr-1"></i>
                            Accounts
                        </NavLink>
                </NavItem>

                <NavItem>
                    <NavLink className={classnames({ active: props?.model?.activeTab === 2 })} onClick={() => { props.saveActiveTabNumber(2); }}>
                        <i className="fa fa-line-chart mr-1"></i>
                              Temp Letter Queue
                            </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className={classnames({ active: props?.model?.activeTab === 3 })} onClick={() => { props.saveActiveTabNumber(3); }} >
                        <i className="fa fa-comments-o mr-1"></i>
                            Dispute Letter History
                            </NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={props?.model?.activeTab || 1}>
                <TabPane tabId={1}>
                    <CreateLetterAccountListComponent cid={cid} />
                </TabPane>
                <TabPane tabId={2}>
                    <CreateTempLetterQueueComponent cid={cid} customer={props?.customer} />
                </TabPane>
                <TabPane tabId={3}>
                    <CreateDisputeLetterHistoryComponent cid={cid} />
                </TabPane>
            </TabContent>
        </DashboardWidget>
    );
});