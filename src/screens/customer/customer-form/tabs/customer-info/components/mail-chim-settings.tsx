import React, { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios, { CancelTokenSource } from 'axios';
import classnames from 'classnames';
import { Nav, NavItem, NavLink, Spinner, TabContent, TabPane } from 'reactstrap';
import toastr from 'toastr';

import { checkSubscriberListsByEmail, getMailchimpLists, checkSubscriberCampaignsByEmail, setMailchimpList } from '../../../../../../actions/customers.actions';
import { Messages } from '../../../../../../shared/constants';
import { IMailChimpSubscriber } from '../../../../../../models/interfaces/customer-view';
import { Checkbox } from '../../../../../../shared/components/checkbox';
import { ButtonComponent } from '../../../../../../shared/components/button';


const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        setMailchimpList
    }, dispatch);
}

export const MailChimpSettingsComponent = connect(null, mapDispatchToProps)((props: { customer: any, onClose: any, setMailchimpList: any }) => {
    const [axiosSource, setAxiosSource] = useState({} as CancelTokenSource);
    const [activeTab, setActiveTab] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const [isLoading3, setIsLoading3] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [subscribers, setSubscribers] = useState<null | IMailChimpSubscriber[]>(null);
    const [list, setList] = useState(null as any);
    const [campaignList, setcampaignList] = useState([] as any[]);
    const [notSubscribed, setnotSubscribed] = useState('');
    const [selectedList, setSelectedList] = useState([] as string[]);
    const [currentSelectedList, setCurrentSelectedList] = useState([] as string[]);

    useEffect(() => {
        const source = axios.CancelToken.source();
        setAxiosSource(source);
        const fetchCampaigns = () => {
            setIsLoading3(true);
            checkSubscriberCampaignsByEmail(props?.customer?.email, source)
                .then((results: any[]) => {
                    setIsLoading3(false);
                    setcampaignList(results);
                }).catch((errors: any[]) => {
                    if (!axios.isCancel(errors)) {
                        setIsLoading3(false);
                        setcampaignList([]);
                    }
                });
        }
        const fetchList = (subs: null | IMailChimpSubscriber[]) => {
            setIsLoading2(true);
            getMailchimpLists(source)
                .then((results: any[]) => {
                    setIsLoading2(false);
                    setList(results);
                    if (results?.length && subs?.length) {
                        const ids = results?.filter((x: any) => subs?.some(m => m?.id === x?.id))?.map((x: any) => x?.id);
                        setSelectedList(ids);
                        setCurrentSelectedList(ids);
                    }
                }).catch((errors: any[]) => {
                    if (!axios.isCancel(errors)) {
                        setIsLoading2(false);
                        setList([]);
                    }
                });
        }
        setIsLoading(true);
        checkSubscriberListsByEmail(props?.customer?.email, source)
            .then((result: any) => {
                setIsLoading(false);
                setSubscribers(result);
                fetchList(result);
                fetchCampaigns();
                if (!result?.length) {
                    setnotSubscribed(Messages.MailChimpNotSubscribed);
                }
            }).catch(error => {
                if (!axios.isCancel(error)) {
                    setIsLoading(false);
                    setSubscribers(null);
                    setnotSubscribed(error?.response?.data);
                    fetchList(null);
                    fetchCampaigns();
                }
            });
        return () => {
            if (axiosSource?.cancel)
                axiosSource?.cancel(Messages.APIAborted);
        }
    }, []);

    const toggle = (tab: number) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    }
    const onChange = (e: any) => {
        if (e?.checked) {
            setCurrentSelectedList([
                ...currentSelectedList,
                e.value
            ]);
        }
        else {
            setCurrentSelectedList([
                ...currentSelectedList?.filter(x => x !== e.value)
            ]);
        }
    }
    const onSave = () => {
        setIsSaving(true);
        let ids = selectedList?.length
            ? selectedList?.map(x => x + ':' + currentSelectedList?.some(m => m === x).toString())
            : currentSelectedList?.map(x => x + ':' + true);
        props?.setMailchimpList(ids, props?.customer?.email, props?.customer?.firstName, props?.customer?.lastName, axiosSource)
            .then((result: any) => {
                setIsSaving(false);
                if (!result) {
                    setnotSubscribed('');
                    toastr.success(`User ${props?.customer?.fullName} updated successfully with MailChimp list!`);
                } else {
                    toastr.error(result);
                }
            })
            .catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setIsSaving(false);
                    toastr.error(Messages?.GenericError);
                }
            });
    }
    return (
        <div className='mail-chimp-settings'>
            <div className="row">
                <div className='col-12'>
                    {props?.customer?.fullName}
                </div>
            </div>
            <div className="row mb-2">
                <div className='col-12 mt-3 mb-2 position-relative'>

                    {
                        notSubscribed && <div className='text-danger font-weight-bold mb-3'>
                            <i className='fa fa-exclamation-triangle mr-1'></i>
                            {notSubscribed}
                        </div>
                    }
                    {
                        !isLoading && !isLoading2 && !isLoading3 ?
                            <>
                                <Nav tabs className="mb-0">
                                    <NavItem className="mr-2">
                                        <NavLink className={classnames('f-11 p-2', { active: activeTab === 1 })}
                                            onClick={() => { toggle(1); }}>
                                            <i className="fa fa-list mr-1"></i>
                                Mail Chimp List
                            </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink className={classnames('f-11 p-2', { active: activeTab === 2 })}
                                            onClick={() => { toggle(2); }}>
                                            <i className="fa fa-line-chart mr-1"></i>
                                Champaigns
                            </NavLink>
                                    </NavItem>
                                </Nav>
                                <TabContent activeTab={activeTab}>
                                    <TabPane tabId={1}>
                                        {
                                            list?.length ?
                                                <div className="table-responsive pt-2">
                                                    <table className="table table-striped table-hover mb-0">
                                                        <tbody>
                                                            {
                                                                list?.map((x: any, index: number) =>
                                                                    <tr key={index}>
                                                                        <td colSpan={2} className='border-0'>
                                                                            <Checkbox key={index}
                                                                                value={x?.id}
                                                                                text={x?.name}
                                                                                checked={currentSelectedList?.some(m => m === x?.id)}
                                                                                onChange={onChange} />
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                                :
                                                <div className="text-center mt-2">
                                                    <i className="text-danger">No MailChimps Available!</i>
                                                </div>
                                        }
                                    </TabPane>
                                    <TabPane tabId={2}>
                                        <div className="table-responsive pt-2">
                                            <table className="table table-striped table-hover mb-0">
                                                <thead>
                                                    <tr>
                                                        <th className='border-0'></th>
                                                        <th className='border-0'>Campaigns Sent</th>
                                                        <th className='border-0'>Send Time</th>
                                                        <th className='border-0'>Campaign Type</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        campaignList?.length ?
                                                            campaignList?.map((item: any, index: number) =>
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{item?.title}</td>
                                                                    <td>{item?.sendTime}</td>
                                                                    <td>{item?.campaignType}</td>
                                                                </tr>
                                                            )
                                                            : <tr>
                                                                <td colSpan={4} align="center">
                                                                    <i className="text-danger">No Campaigns Available!</i>
                                                                </td>
                                                            </tr>
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </TabPane>
                                </TabContent>
                            </>
                            :
                            <div className="section-spinner">
                                <Spinner size="md" color="secondary" />
                            </div>
                    }
                </div>
            </div>
            <div className='row'>
                <div className='col-12 d-flex justify-content-end'>
                    {
                        list?.length && activeTab == 1 ?
                            <ButtonComponent text="Save" className="btn-primary" loading={isSaving} onClick={onSave} />
                            : null
                    }
                    <button type="button" className="btn btn-secondary btn-sm ml-3" onClick={props?.onClose}>Close</button>
                </div>
            </div>
        </div >
    );
});