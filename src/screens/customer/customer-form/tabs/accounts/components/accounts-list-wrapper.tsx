import classnames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';

import { AccountTypes } from '../../../../../../models/enums';
import { AccountsListComponent } from '../components/accounts-list';
import { ICollectionAccountItem } from '../../../../../../models/interfaces/customer-view';

export const AccountsWrapperComponent = (props: { onReloadCustomer: any, customer?: any, cid: string, accounts: ICollectionAccountItem[], isFastTrack: boolean }) => {

    const [activeTab, setActiveTab] = useState(1); // 1 for accounts , 2 for Inquiries
    const [filteredAccounts, setfilteredAccounts] = useState([] as ICollectionAccountItem[]);
    const [filteredInquiries, setfilteredInquiries] = useState([] as ICollectionAccountItem[]);

    useEffect(() => {
        filterAccounts(activeTab);
    }, [props.accounts]);

    const filterAccounts = (tab: number) => {
        setfilteredAccounts(props.accounts?.filter(x => (x.accountTypeName?.trim()?.toLowerCase() !== AccountTypes.Inquiry
            || x.accountTypeName?.trim()?.toLowerCase() === AccountTypes.PersonalInfo)));
        setfilteredInquiries(props.accounts?.filter(x => x.accountTypeName?.trim()?.toLowerCase() === AccountTypes.Inquiry));
    }
    const toggle = (tab: number) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    }
    return (
        <div>
            <Nav tabs className={classnames("accounts-full-view-tabs")}>
                <NavItem>
                    <NavLink className={classnames({ active: activeTab === 1 })} onClick={() => { toggle(1); }}>
                        <i className="fa fa-address-book mr-1"></i>
                        Accounts in Dispute({filteredAccounts?.length || 0})
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className={classnames({ active: activeTab === 2 })} onClick={() => { toggle(2); }}>
                        <i className="pe-7s-wallet mr-1"></i>
                        Inquiries in Dispute({filteredInquiries?.length || 0})
                    </NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
                <TabPane tabId={1}>
                    <AccountsListComponent cid={props?.cid} onReloadCustomer={props?.onReloadCustomer} customer={props?.customer} isFastTrack={props?.isFastTrack} accounts={filteredAccounts} />
                </TabPane>
                <TabPane tabId={2}>
                    <AccountsListComponent cid={props?.cid} onReloadCustomer={props?.onReloadCustomer} customer={props?.customer} isFastTrack={props?.isFastTrack} accounts={filteredInquiries} />
                </TabPane>
            </TabContent>
        </div>
    );
}
