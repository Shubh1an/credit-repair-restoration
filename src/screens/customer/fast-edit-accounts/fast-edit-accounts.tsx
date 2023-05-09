import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios, { CancelTokenSource } from 'axios';
import Spinner from 'reactstrap/lib/Spinner';
import classnames from 'classnames';
import toastr from 'toastr';
// @ts-ignore
import confirm from 'reactstrap-confirm';
import moment from 'moment';

import './fast-edit-accounts.scss';
import { EnumBureausShorts, EnumComponentMode, EnumScreens, GlobalParams } from '../../../models/enums';
import { IBureauChange, IFastEditAccount, IFastEditAccountsParams, IFEAccountHistoryModel, IFEAccountSavedResponse, IFEFilterModel } from '../../../models/interfaces/fast-edit-accounts';
import { DashboardWidget } from '../../dashboard/components/dashboard-widget';
import { FEAccountDetails } from './components/fe-account-details';
import { FEFilters } from './components/fe-filters';
import { FEAddEditAccountComponent } from './components/fe-add-edit-account';
import { ModalComponent } from '../../../shared/components/modal';
import { AddNewAccountComponent } from '../../../shared/components/add-new-account';
import { AddNewFullAccountComponent } from '../../../shared/components/add-new-full-account-details';
import { NavigationOptions } from '../../../shared/components/navigation-options';
import { ClientRoutesConstants, Messages, Variables } from '../../../shared/constants';
import { getFastccounts } from '../../../actions/fast-edit.actions';
import { getCustomer, removeAccount } from '../../../actions/customers.actions';
import { ICustomerFullDetails } from '../../../models/interfaces/customer-view';
import { LargeSpinner } from '../../../shared/components/large-spinner';
import { saveFEAccount } from '../../../actions/fast-edit.actions';
import AuthService from '../../../core/services/auth.service';
import { DisputeStatisticsComponent } from '../../customer/customer-form/tabs/dispute-progress/dispute-statistics';
import { withAuthorize } from '../../../shared/hoc/authorize';

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getFastccounts,
        getCustomer
    }, dispatch);
}
const __defaults = {
    pageFrom: 1,
    pageTo: 10,
    orderBy: 'Enter',
    orderType: 'Desc'
};
const StandFastTrack = Variables.STANDARD_FASTRACK;
const uniqueFormat = 'YYYY-MM-DD-HH-mm-ss';
const FastEditAccountsComponent: React.FC = connect(null, mapDispatchToProps)((props: any) => {

    const params = useParams() as { cid: string };
    const [accounts, setAccounts] = useState([] as IFastEditAccount[]);
    const [currentAccount, setCurrentAccount] = useState(null as IFastEditAccount | null);
    const [reload, setReload] = useState(false);
    const [customer, setCustomer] = useState(null as ICustomerFullDetails | null);
    const [apiCalled, setApiCalled] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isNewAccVisible, setIsNewAccVisible] = useState(false);
    const [isStatsVisible, setIsStatsVisible] = useState(false);
    const [isEditFullAccVisible, setIsEditFullAccVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [duplicating, setDuplicating] = useState(false);
    const [duplicatingData, setDuplicatingData] = useState(null as any);

    const [accountsCount, setAccountsCount] = useState(null as any);
    const [filter, setFilter] = useState({
        ...__defaults,
        customerId: params?.cid
    } as IFastEditAccountsParams);

    const [changes, setChanges] = useState({} as IFEAccountHistoryModel);
    const [axiosSource, setAxiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);

    useEffect(() => {
        loadAccounts(filter);
        loadCustomer();
        return () => {
            if (axiosSource.cancel) {
                axiosSource.cancel(Messages.APIAborted);
            }
        }
    }, []);
    const loadCustomer = () => {
        props?.getCustomer(params?.cid, axiosSource)
            .then((res: any) => {
                setCustomer(res?.customer);
                setAccountsCount(res?.customer?.collectionAccountItems?.length || 0);
            }).catch((err: any) => {

            })
    }
    const loadAccounts = (payload: IFastEditAccountsParams, replaceRecords: boolean = true) => {
        setLoading(true);
        setFilter(payload);
        props?.getFastccounts(payload, axiosSource)
            .then((result: any) => {
                setApiCalled(true);
                setLoading(false);
                setReload(false);
                if (replaceRecords) {
                    setAccounts(result);
                } else {
                    setAccounts([
                        ...accounts,
                        ...result
                    ]);
                }
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setLoading(false);
                }
            });
    }
    const updateCurrentAccount = (ccaid: string) => {
        const currentAcc = accounts.find(account => account.id == ccaid);
        setCurrentAccount(currentAcc ?? null);
    }
    const loadSingleAccount = (ccaid: string) => {
        setUpdating(true);
        const payload: IFastEditAccountsParams = {
            ...filter,
            pageFrom: 0,
            pageTo: 1,
            CCAID: ccaid
        };
        updateCurrentAccount(ccaid);
        props?.getFastccounts(payload, axiosSource)
            .then((result: any[]) => {
                const accIndex = accounts.findIndex(account => account.id === ccaid);
                let accs = [...accounts];
                accs.splice(accIndex, 1, result[0]);
                setUpdating(false);
                setAccounts([...accs]);
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setUpdating(false);
                }
            });
    }
    const onReloadAccounts = () => {
        const newFilter = {
            ...__defaults,
            customerId: params?.cid
        };
        setReload(true);
        loadAccounts(newFilter);
    }
    const onBureauChange = (data: any, ccid: string, bureau: EnumBureausShorts) => {
        setChanges({
            ...changes,
            [ccid]: {
                ...changes[ccid],
                [bureau]: data
            }
        })
    }
    const onGlobalParamsChange = (data: any, ccid: string, param: GlobalParams) => {
        setChanges({
            ...changes,
            [ccid]: {
                ...changes[ccid],
                [param]: data
            }
        });
    }
    const onAddressSave = (data: boolean, ccaid: string) => {
        if (data) {
            loadSingleAccount(ccaid);
        }
    }
    const onFilterApplied = (data: IFEFilterModel) => {
        let newfilter = {
            ...__defaults,
            customerId: params?.cid,
            orderBy: data?.sort?.split(':')[0],
            orderType: data?.sort?.split(':')[1]
        } as IFastEditAccountsParams;

        if (data?.filterBy && data?.filterBy !== '-Select-') {
            newfilter = {
                ...newfilter,
                [data?.filterBy]: data?.filterByText
            };
        }
        setReload(true);
        loadAccounts(newfilter);
    }
    const deleteAccount = async (data: any) => {
        if (accounts?.length) {
            let result = await confirm({
                title: 'Remove Account',
                message: "Are you sure you want to remove this account?",
                confirmText: "YES",
                confirmColor: "danger",
                cancelColor: "link text-secondary"
            });
            if (result) {
                updateCurrentAccount(data?.id);
                setUpdating(true);
                await removeAccount(data?.id, params?.cid, axiosSource)
                    .then((result: any) => {
                        setUpdating(false);
                        let accs = accounts?.slice();
                        const accIndex = accounts?.findIndex(account => account.id === data.id);
                        accs?.splice(accIndex, 1);
                        setAccounts([...accs]);
                        setCurrentIndex(-1);
                        setAccountsCount(accountsCount - 1);
                        setFilter({
                            ...filter,
                            pageFrom: filter.pageFrom - 1,
                            pageTo: filter.pageTo - 1
                        });
                        setCurrentAccount(null);
                        toastr.success(' Account removed successfully!!');

                        let newChanges = { ...changes };
                        delete newChanges[data?.id];
                        setChanges({
                            ...newChanges
                        });
                    })
                    .catch((err: any) => {
                        if (!axios.isCancel(err)) {
                            setUpdating(false);
                            toastr.error(err?.response?.data || Messages.GenericError);
                        }
                    })
            }
        }
    }
    const showMore = () => {
        const newfrom = filter.pageTo + 1;
        const newTo = newfrom + (filter.pageTo - filter.pageFrom);
        const filterNew = {
            ...filter,
            pageFrom: newfrom,
            pageTo: newTo
        }
        loadAccounts(filterNew, false);
    }
    const onFullAccountSave = (ccid?: string) => {
        if (ccid) {
            loadSingleAccount(ccid);
        }
        setIsEditFullAccVisible(false);
    }
    const onSingleAccountSave = (ccid: string, account: IFastEditAccount) => {
        const currentChanges = changes[ccid];
        const hasChanges = (currentChanges?.globalAccType || currentChanges?.globalOutcome || currentChanges?.globalReason
            || currentChanges?.TU || currentChanges?.EXP || currentChanges?.EQF || currentChanges?.isFastTrack !== account?.isFastTrack);

        if (currentChanges?.hasOwnProperty('globalAccType')) {
            if (typeof (currentChanges?.globalAccType) == 'object' ? !currentChanges?.globalAccType?.name : !currentChanges?.globalAccType) {
                toastr.warning('Please enter Account type');
                return;
            }
        } else if (!account?.accountTypeName) {
            toastr.warning('Please enter Account type');
            return;
        }
        if (!hasChanges || !currentChanges || Object.getOwnPropertyNames(currentChanges)?.length === 0) {
            toastr.error('There are no changes in the Account.');
            return;
        }

        setCurrentAccount(account);
        const payload = AuthService.getCurrentJWTPayload();
        setUpdating(true);
        saveFEAccount(changes, customer, payload?.membershipId, axiosSource, accounts, ccid)
            .then((result: IFEAccountSavedResponse) => {
                setUpdating(false);
                if (result) {
                    const index = accounts?.findIndex(x => x.id === ccid);
                    let accs = [...accounts];
                    accs.splice(index, 1, result[ccid][0]);
                    setAccounts(accs);
                    toastr.success(`Account ${account?.collectorName} Updated successfully!`);
                }
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setUpdating(false);
                    toastr.error(err?.response?.data || Messages.GenericError);
                }
            })
    }
    const onFastTrackChange = (checked: boolean, ccid: string) => {
        setChanges({
            ...changes,
            [ccid]: {
                ...changes[ccid],
                isFastTrack: checked
            }
        })
    }
    const getTUData = (data?: IFastEditAccount): IBureauChange => {
        return {
            accNum: data?.tuAccountNumber,
            accStatus: data?.tuAccountStatus,
            balance: data?.tuBalance,
            currentDisputeReason: data?.currentTUDisputeReason,
            currentOutcome: data?.tuOutcome,
            dateOfInquiry: data?.tuInqDate,
            dateOpened: data?.tuDateOpened,
            highCredit: data?.tuHighCreditLimit,
            payStatus: data?.tuPayStatus
        }
    }
    const getEXPData = (data?: IFastEditAccount): IBureauChange => {
        return {
            accNum: data?.expAccountNumber,
            accStatus: data?.expAccountStatus,
            balance: data?.expBalance,
            currentDisputeReason: data?.currentEXPDisputeReason,
            currentOutcome: data?.expOutcome,
            dateOfInquiry: data?.expInqDate,
            dateOpened: data?.expDateOpened,
            highCredit: data?.expHighCreditLimit,
            payStatus: data?.expPayStatus
        };
    }
    const getEQFData = (data?: IFastEditAccount): IBureauChange => {
        return {
            accNum: data?.eqfAccountNumber,
            accStatus: data?.eqfAccountStatus,
            balance: data?.eqfBalance,
            currentDisputeReason: data?.currentEQFDisputeReason,
            currentOutcome: data?.eqfOutcome,
            dateOfInquiry: data?.eqfInqDate,
            dateOpened: data?.eqfDateOpened,
            highCredit: data?.eqfHighCreditLimit,
            payStatus: data?.eqfPayStatus
        };
    }
    const onAddNewAccount = (accs: IFastEditAccount[]) => {
        const acc = [...accs, ...accounts];
        setAccounts(acc);
        setAccountsCount(accountsCount + (accs?.length || 0));
    }
    const duplicateAccount = (index: number) => {
        setIsNewAccVisible(true);
        setDuplicating(true);
        const dupData = {
            [EnumBureausShorts.TU]: getTUData(accounts[index]),
            [EnumBureausShorts.EXP]: getEXPData(accounts[index]),
            [EnumBureausShorts.EQF]: getEQFData(accounts[index]),
            accountName: accounts[index]?.collectorName,
            round: accounts[index]?.scoringRound,
            globalAccType: accounts[index]?.accountTypeName
        };
        setDuplicatingData(dupData);
    }
    return (
        <>
            <div className="fast-edit-accounts">
                <section className="content-header row">
                    <div className="col-12 col-sm-10">
                        <div className="header-icon">
                            <i className="fa fa-users"></i>
                        </div>
                        <div className="header-title ml-0">
                            <h1>Fast Edit Accounts</h1>
                            <small>Add, bulk Edit and bulk delete accounts</small>
                        </div>
                    </div>
                    <div className="col-12 col-sm-2 pt-2 pt-sm-3 p-sm-0 pl-5 pl-sm-0">
                        <NavigationOptions label="Navigation Options" current={ClientRoutesConstants.fastEditAccounts} cid={params.cid} />
                    </div>
                </section>
                <section className="content">
                    <div className="row">
                        <div className="col-12 mb-5" style={{ minHeight: '500px' }}>
                            <DashboardWidget className="all-accounts-list" title={
                                customer
                                    ? <>
                                        {(customer?.firstName + " " + customer?.lastName)}
                                        {apiCalled && !loading && <span className='records pull-right mr-3 text-success f-12'> Showing {accounts?.length} of {accountsCount} accounts.</span>}
                                    </>
                                    : <Spinner size="sm" color="secondary" />}
                                reloadHandler={onReloadAccounts} isLoading={reload} allowFullscreen={true} allowMaximize={true} allowMinimize={true} reload={true}  >
                                <div className="customer-accounts">
                                    <FEFilters onSearch={onFilterApplied} onAddNewClick={() => { setDuplicatingData(null); setIsNewAccVisible(true); }} onStatsClick={() => setIsStatsVisible(true)} />
                                    {
                                        apiCalled &&
                                        accounts?.map((data: IFastEditAccount, index) => {
                                            return (
                                                <DashboardWidget key={data.id + '-' + moment(data?.modifiedOn).format(uniqueFormat)} className=" pt-1 pb-3 " title={data?.collectorName} allowFullscreen={true} allowMaximize={true} allowMinimize={true}  >
                                                    {updating && currentAccount?.id === data?.id && <LargeSpinner />}
                                                    <div className="row">
                                                        <div className="col-xs-12 col-sm-3 pr-0">
                                                            <div className=" border-right-grad pr-4">
                                                                <FEAccountDetails
                                                                    accountDetails={{
                                                                        round: data?.scoringRound,
                                                                        by: data?.modifierAgentName,
                                                                        enteredOn: data?.dateEntered,
                                                                        modifiedOn: data?.modifiedOn,
                                                                        showLetterWarning: data?.updated === '1',
                                                                        ccid: data.id
                                                                    }}
                                                                    collectorAddress={{
                                                                        address: data?.collectorAddresses,
                                                                        city: data?.collectorCity,
                                                                        collectorName: data?.collectorName,
                                                                        state: data?.collectorState,
                                                                        zip: data?.collectorZipCode,
                                                                        ccaId: data?.id,
                                                                        collectorId: data?.collectorId,
                                                                        collectorAddressId: data?.collectorAddressId,
                                                                        modifierAgentId: data?.modifierAgentId
                                                                    }}
                                                                    isFastTrack={data?.isFastTrack}
                                                                    showFastTrack={customer?.processingType === StandFastTrack}
                                                                    onFastTrackChange={(checked: boolean) => onFastTrackChange(checked, data?.id)}
                                                                    onSave={(e) => onAddressSave(e, data?.id)} />
                                                            </div>
                                                        </div>
                                                        <div className="col-xs-12 col-sm-9">
                                                            <FEAddEditAccountComponent
                                                                mode={EnumComponentMode.Edit}
                                                                accountType={data?.accountTypeName}
                                                                transUnion={getTUData(data)}
                                                                experian={getEXPData(data)}
                                                                equifax={getEQFData(data)}
                                                                isTUAvailable={!!data?.tuAccountBureauId && data?.tuAccountBureauId !== Variables.EMPTY_GUID}
                                                                isEXPAvailable={!!data?.expAccountBureauId && data?.expAccountBureauId !== Variables.EMPTY_GUID}
                                                                isEQFAvailable={!!data?.eqfAccountBureauId && data?.eqfAccountBureauId !== Variables.EMPTY_GUID}
                                                                onTUChange={(d: any) => onBureauChange(d, data?.id, EnumBureausShorts.TU)}
                                                                onEXPChange={(d: any) => onBureauChange(d, data?.id, EnumBureausShorts.EXP)}
                                                                onEQChange={(d: any) => onBureauChange(d, data?.id, EnumBureausShorts.EQF)}
                                                                onReasonChange={(d: any) => onGlobalParamsChange(d, data?.id, GlobalParams.globalReason)}
                                                                onOutcomeChange={(d: any) => onGlobalParamsChange(d, data?.id, GlobalParams.globalOutcome)}
                                                                onAccTypeChange={(d: any) => onGlobalParamsChange(d, data?.id, GlobalParams.globalAccType)}
                                                            />
                                                            <div className="row mt-2">
                                                                <div className="col-12 col-sm-6">
                                                                    <button className="btn btn-sm btn-danger f-11 pl-2 pr-2 w-100 w-sm-auto" onClick={() => deleteAccount(data)}>
                                                                        <i className="fa fa-trash mr-1"></i>Delete Account</button>
                                                                    <button className="btn btn-sm btn-info f-11 pl-2 pr-2 w-100 w-sm-auto ml-2" onClick={() => duplicateAccount(index)}>
                                                                        <i className="fa fa-clone mr-1"></i>Duplicate Account</button>
                                                                </div>
                                                                <div className="col-12 col-sm-6">
                                                                    <div className="d-flex justify-content-end flex-column flex-sm-row pt-1 pb-2">
                                                                        <button className="btn btn-sm btn-secondary f-11  pl-sm-2 pr-sm-2 mr-sm-2 w-100 w-sm-auto" onClick={e => { setIsEditFullAccVisible(true); setCurrentIndex(index); }}>
                                                                            <i className="fa fa-edit mr-1"></i>Edit Full Details</button>
                                                                        <button className="btn btn-sm btn-primary f-11 pl-sm-2 pr-sm-2 w-100 w-sm-auto mt-2 mt-sm-auto" onClick={() => onSingleAccountSave(data?.id, data)}>
                                                                            <i className="fa fa-save mr-1"></i>Save Account</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DashboardWidget>
                                            );
                                        })
                                    }
                                    {
                                        apiCalled && !accounts?.length ?
                                            <div className="no-accounts text-danger text-center">
                                                <h1>No Accounts Available!!</h1>
                                            </div>
                                            :
                                            (((accountsCount - (accounts?.length ?? 0)) > 0) || !apiCalled)
                                            &&
                                            <div className={classnames("row mt-5 mb-3 rounded text-white show-more-panel m-0",
                                                { 'bg-light': loading, 'bg-secondary': !!(accountsCount - (accounts?.length ?? 0)) })}>
                                                <div className="col-4 d-flex align-items-center justify-content-center">
                                                    {
                                                        !loading &&
                                                        <label >
                                                            Showing - {accounts?.length}
                                                        </label>
                                                    }
                                                </div>
                                                <div className="col-4 p-3 position-relative d-flex justify-content-center">
                                                    {
                                                        loading
                                                            ? <Spinner size="lg" color="secondary" />
                                                            : <div className="show-more-link font-weight-bold text-center pointer" onClick={showMore}>
                                                                Show More
                                                            </div>
                                                    }
                                                </div>
                                                <div className="col-4 d-flex align-items-center justify-content-center">
                                                    {
                                                        !loading &&
                                                        <label >
                                                            Remaining - {accountsCount - accounts?.length}
                                                        </label>
                                                    }
                                                </div>
                                            </div>
                                    }
                                </div>
                            </DashboardWidget>
                        </div>
                    </div>
                </section>
                <ModalComponent fullscreen={true} title={"Add New Account"} isVisible={isNewAccVisible} onClose={() => { setDuplicating(false); setIsNewAccVisible(false); setDuplicatingData(null) }}>
                    <AddNewAccountComponent showFastTrack={customer?.processingType === StandFastTrack}
                        customer={customer} cid={params?.cid} onAddNewAccount={onAddNewAccount}
                        onClose={() => setIsNewAccVisible(false)}
                        duplicateAccData={duplicatingData}
                        isDuplicating={duplicating}
                    />
                </ModalComponent>
                <ModalComponent fullscreen={true} bodyClass={"bg-white p-0"} title={"Dispute Stats"} isVisible={isStatsVisible} onClose={() => setIsStatsVisible(false)}>
                    <DisputeStatisticsComponent customer={customer} cid={params?.cid} />
                </ModalComponent>
                <ModalComponent bodyClass="pb-2" fullscreen={true} title={"Edit Full Account details"} isVisible={isEditFullAccVisible} onClose={() => setIsEditFullAccVisible(false)}>
                    <AddNewFullAccountComponent
                        cid={params?.cid}
                        customer={customer}
                        ccid={accounts[currentIndex]?.id}
                        accountName={accounts[currentIndex]?.collectorName}
                        accountType={accounts[currentIndex]?.accountTypeName}
                        dateEntered={accounts[currentIndex]?.dateEntered}
                        dateModifiedOn={accounts[currentIndex]?.modifiedOn}
                        round={accounts[currentIndex]?.scoringRound}
                        isFastTrack={accounts[currentIndex]?.isFastTrack}
                        showFastTrack={customer?.processingType === StandFastTrack}
                        onClose={() => setIsEditFullAccVisible(false)}
                        onSave={onFullAccountSave}
                    />
                </ModalComponent>
            </div>
        </>
    );
})
export default withAuthorize(FastEditAccountsComponent, EnumScreens.FastEdit);