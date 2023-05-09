import axios, { CancelTokenSource } from 'axios';
import React, { useEffect, useState } from 'react';
// @ts-ignore
import confirm from 'reactstrap-confirm';
import toastr from 'toastr';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { ICollectionAccountItem } from '../../../../../../models/interfaces/customer-view';
import { ButtonComponent } from '../../../../../../shared/components/button';
import { Checkbox } from '../../../../../../shared/components/checkbox';
import { removeAccounts, removeAccount } from '../../../../../../actions/customers.actions';
import { ClientRoutesConstants, Messages, Variables } from '../../../../../../shared/constants';
import { LargeSpinner } from '../../../../../../shared/components/large-spinner';
import { EnumBureausShorts, EnumComponentMode, EnumScreens, GlobalParams, SortOrderType } from '../../../../../../models/enums';
import AuthService from '../../../../../../core/services/auth.service';
import { AccountsMatrixComponent } from '../components/accounts-matrix';
import { BureauLogoComponent } from '../../../../../../shared/components/bureau-logo';
import { ModalComponent } from '../../../../../../shared/components/modal';
import { EditAccountMiniComponent } from './edit-account-mini';
import { IBureauChange, IFastEditAccount, IFEAccountHistoryModel } from '../../../../../../models/interfaces/fast-edit-accounts';
import { Sortable } from '../../../../../../shared/components/sortable';

const mapStateToProps = (state: any) => {
    return {
        AuthRules: AuthService.getScreenOject(state.sharedModel.AuthRules, EnumScreens.CustomerDetails)
    };
}
export const AccountsListComponent = connect(mapStateToProps)((props: { AuthRules: any, onReloadCustomer: any, cid: string, customer?: any, accounts: ICollectionAccountItem[], isFastTrack: boolean }) => {

    const [axiosSource, setAxiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);
    const [loading, setLoading] = useState(false);
    const [singleLoading, setSingleLoading] = useState(false);
    const [allChecked, setAllChecked] = useState(false);
    const [checkedCount, setcheckedCount] = useState(0);
    const [deletingId, setdeletingId] = useState('');
    const [editAcc, setEditAcc] = useState(null as ICollectionAccountItem | null);
    const [isEdit, setIsEdit] = useState(false);
    const [sortColumn, setSortColumn] = useState('');

    const [accounts, setAccounts] = useState([] as ICollectionAccountItem[]);

    useEffect(() => {
        setAccounts(props?.accounts);
        setAllChecked(false);
        setcheckedCount(0);
        setdeletingId('');
    }, [props?.accounts]);

    const onAllChecked = (checked: boolean) => {
        setcheckedCount(checked ? accounts?.length : 0);
        setAccounts([
            ...accounts?.map((account: ICollectionAccountItem) => {
                return {
                    ...account,
                    checked
                }
            })]
        );
    }
    const onDelete = async (account: ICollectionAccountItem) => {
        let result = await confirm({
            title: 'Remove Account',
            message: "Are you sure you want to remove this account?",
            confirmText: "YES",
            confirmColor: "danger",
            cancelColor: "link text-secondary"
        });
        if (result) {
            setdeletingId(account.id);
            setSingleLoading(true);
            await removeAccount(account?.id, props?.cid, axiosSource)
                .then((result: any) => {
                    setSingleLoading(false);
                    toastr.success(' Account removed successfully!!');
                    props?.onReloadCustomer();
                    setdeletingId('');
                })
                .catch((err: any) => {
                    if (!axios.isCancel(err)) {
                        setSingleLoading(false);
                        toastr.error(err?.response?.data || Messages.GenericError);
                    }
                })
        }
    }
    const onAccountChecked = (account: ICollectionAccountItem, checked: boolean) => {

        setcheckedCount(checked ? checkedCount + 1 : checkedCount - 1);
        if (!checked) {
            setAllChecked(false);
        }
        setAccounts([
            ...accounts?.map((f: ICollectionAccountItem) => {
                return {
                    ...f,
                    checked: f.id === account.id ? checked : f.checked
                }
            })]);
    }
    const onDeleteAll = async () => {
        let result = await confirm({
            title: 'Remove Accounts',
            message: "Are you sure you want to remove selected "
                + (checkedCount === accounts?.length ? 'All' : checkedCount)
                + " account" + ((checkedCount > 1) ? 's' : '') + "?",
            confirmText: "YES",
            confirmColor: "danger",
            cancelColor: "link text-secondary"
        });
        if (result) {
            const ids = accounts?.filter(x => x.checked).map(x => x.id)?.join(',');
            setLoading(true);
            removeAccounts(ids, axiosSource)
                .then((result: any) => {
                    setLoading(false);
                    toastr.success(checkedCount + ' Account' + ((checkedCount > 1) ? 's' : '') + ' removed successfully!!');
                    props?.onReloadCustomer();
                })
                .catch((err: any) => {
                    if (!axios.isCancel(err)) {
                        setLoading(false);
                        toastr.error(err?.response?.data || Messages.GenericError);
                    }
                })
        }
    }
    const onEdit = (acc: ICollectionAccountItem) => {
        setEditAcc(acc);
        setIsEdit(true);
    }
    const onSave = () => {
        setEditAcc(null);
        setIsEdit(false);
        props?.onReloadCustomer();
    }
    const onSort = (accounts: any, currentKey: string) => {
        setSortColumn(currentKey);
        setAccounts([...accounts])
    }
    return (
        <div className="files-list">
            {
                checkedCount > 0 &&
                <div className="pb-1 clearfix mt-2">
                    {
                        (!AuthService.isFieldHidden(props.AuthRules, 'AccountDelete') && !AuthService.isFieldReadOnly(props.AuthRules, 'AccountDelete')) &&
                        <ButtonComponent text={"Delete " + `(${checkedCount})`} className="btn-danger pull-left" loading={loading} onClick={onDeleteAll} >
                            <i className="fa fa-trash mr-2"></i>
                        </ButtonComponent>
                    }
                    <div className="clearfix"></div>

                </div>
            }
            <div className="table-responsive list-scrollable custom-scrollbar accounts-list-table">
                <table className="dataTableCustomers table table-striped table-hover" cellSpacing={0} cellPadding={0}>
                    <thead className="back_table_color">
                        <tr className="secondary">
                            <th style={{ width: '30px' }} rowSpan={2} className="text-center">
                                {
                                    !!accounts?.length && (!AuthService.isFieldHidden(props.AuthRules, 'AccountDelete') && !AuthService.isFieldReadOnly(props.AuthRules, 'AccountDelete')) &&
                                    <Checkbox text="" checked={allChecked} onChange={(data: any) => { setAllChecked(data?.checked); onAllChecked(data?.checked); }} />
                                }
                            </th>
                            <th style={{ width: '20%' }} rowSpan={2}>
                                <Sortable data={accounts} sortKey='collectorName' currentKey={sortColumn} sort={onSort}>Name </Sortable></th>
                            <th style={{ width: '10%' }} rowSpan={2}>
                                <Sortable data={accounts} sortKey='accountTypeName' currentKey={sortColumn} sort={onSort}>Type </Sortable></th>
                            <th style={{ width: '5%' }} rowSpan={2} className="text-center">
                                <Sortable data={accounts} sortKey='scoringRound' currentKey={sortColumn} sort={onSort}>Round </Sortable></th>
                            <th style={{ width: '25%' }} rowSpan={2} className="text-center">Acc#</th>
                            <th style={{ width: '25%', textAlign: 'center' }} colSpan={3}>
                                Dispute Outcome
                            </th>
                            <th style={{ width: '10%' }} rowSpan={2}></th>
                        </tr>
                        <tr>
                            <th className="text-center" style={{ width: '70px' }}>
                                <BureauLogoComponent type={EnumBureausShorts.TU} size={'sm'} />
                            </th>
                            <th className="text-center" style={{ width: '70px' }}>
                                <BureauLogoComponent type={EnumBureausShorts.EXP} size={'sm'} />
                            </th>
                            <th className="text-center" style={{ width: '70px' }}>
                                <BureauLogoComponent type={EnumBureausShorts.EQF} size={'sm'} />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            !!accounts?.length ?
                                accounts?.map((account: ICollectionAccountItem, index: number) => {
                                    return (
                                        <tr key={index}>
                                            <td className="text-center">
                                                {
                                                    (!AuthService.isFieldHidden(props.AuthRules, 'AccountDelete') && !AuthService.isFieldReadOnly(props.AuthRules, 'AccountDelete')) &&
                                                    <Checkbox text="" checked={!!account?.checked} onChange={(data: any) => onAccountChecked(account, data?.checked)} />
                                                }
                                            </td>
                                            <td>
                                                {account?.collectorName}
                                            </td>
                                            <td>
                                                {account?.accountTypeName}
                                            </td>
                                            <td className="text-center">
                                                {account?.scoringRound}
                                            </td>
                                            <td className="text-left">
                                                <div className="d-flex flex-column">
                                                    {
                                                        !!account?.tuAccountNumber &&
                                                        <div>
                                                            <label>TU# </label>
                                                            <span>{account?.tuAccountNumber}</span>
                                                        </div>
                                                    }
                                                    {
                                                        !!account?.expAccountNumber &&
                                                        <div>
                                                            <label>EXP# </label>
                                                            <span>{account?.expAccountNumber}</span>
                                                        </div>
                                                    }
                                                    {
                                                        !!account?.eqfAccountNumber &&
                                                        <div>
                                                            <label>EQF# </label>
                                                            <span>{account?.eqfAccountNumber}</span>
                                                        </div>
                                                    }
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                {
                                                    !account?.objtuOutcome ?
                                                        account?.isTransUnion ?
                                                            <i className="fa fa-times f-17 text-danger" title="Not Yet Disputed"></i>
                                                            : <span className="font-weight-bold">No TU Listing</span>
                                                        : (
                                                            account?.objtuOutcome?.toLowerCase() == "deleted"
                                                            || account?.objtuOutcome?.toLowerCase() == "repaired"
                                                            || account?.objtuOutcome?.toLowerCase() == "satisfactory"
                                                        ) ?
                                                            <i className="fa fa-check f-17 text-success" title="Deleted / Repaired"></i>
                                                            :
                                                            (account?.objtuOutcome?.toLowerCase()?.replace(" ", "") == "indispute"
                                                                || account?.objtuOutcome?.toLowerCase()?.replace(" ", "") == "inprogress")
                                                                ? <i className="fa fa-clock-o f-17 text-secondary" title="In Dispute"></i>
                                                                : null

                                                }
                                            </td>
                                            <td className="text-center">
                                                {
                                                    !account?.objexpOutcome ?
                                                        account?.isExperian ?
                                                            <i className="fa fa-times f-17 text-danger" title="Not Yet Disputed"></i>
                                                            : <span className="font-weight-bold">No EXP Listing</span>
                                                        : (
                                                            account?.objexpOutcome?.toLowerCase() == "deleted"
                                                            || account?.objexpOutcome?.toLowerCase() == "repaired"
                                                            || account?.objexpOutcome?.toLowerCase() == "satisfactory"
                                                        ) ?
                                                            <i className="fa fa-check f-17 text-success" title="Deleted / Repaired"></i>
                                                            :
                                                            (account?.objexpOutcome?.toLowerCase()?.replace(" ", "") == "indispute"
                                                                || account?.objexpOutcome?.toLowerCase()?.replace(" ", "") == "inprogress")
                                                                ? <i className="fa fa-clock-o f-17 text-secondary" title="In Dispute"></i>
                                                                : null

                                                }
                                            </td>
                                            <td className="text-center">
                                                {
                                                    !account?.objeqfOutcome ?
                                                        account?.isEquifax ?
                                                            <i className="fa fa-times f-17 text-danger" title="Not Yet Disputed"></i>
                                                            : <span className="font-weight-bold">No EQF Listing</span>
                                                        : (
                                                            account?.objeqfOutcome?.toLowerCase() == "deleted"
                                                            || account?.objeqfOutcome?.toLowerCase() == "repaired"
                                                            || account?.objeqfOutcome?.toLowerCase() == "satisfactory"
                                                        ) ?
                                                            <i className="fa fa-check f-17 text-success" title="Deleted / Repaired"></i>
                                                            :
                                                            (account?.objeqfOutcome?.toLowerCase()?.replace(" ", "") == "indispute"
                                                                || account?.objeqfOutcome?.toLowerCase()?.replace(" ", "") == "inprogress")
                                                                ? <i className="fa fa-clock-o f-17 text-secondary" title="In Dispute"></i>
                                                                : null

                                                }
                                            </td>
                                            <td >
                                                <div className="text-center position-relative d-flex justify-content-end align-items-center">
                                                    {
                                                        singleLoading && deletingId === account?.id ? <LargeSpinner className="small-spinner" />
                                                            : <>
                                                                <>
                                                                    {(!AuthService.isFieldHidden(props.AuthRules, 'AccountEdit'))
                                                                        && (!AuthService.isFieldReadOnly(props.AuthRules, 'AccountEdit'))
                                                                        && <i className="fa fa-pencil pointer" title="edit" onClick={() => onEdit(account)}></i>}
                                                                </>
                                                                {
                                                                    (!AuthService.isFieldHidden(props.AuthRules, 'AccountDelete') && !AuthService.isFieldReadOnly(props.AuthRules, 'AccountDelete')) &&
                                                                    <i className="fa fa-trash text-danger f-15 ml-3 pointer" title="remove" onClick={() => onDelete(account)}></i>
                                                                }
                                                            </>
                                                    }
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                                : null
                        }
                        {
                            !accounts?.length &&
                            <tr>
                                <td colSpan={9} className="text-center text-danger" style={{ height: '50px', paddingTop: '40px' }}>
                                    <i>No  {props?.isFastTrack ? " Fast-Track" : ""} Accounts Available!!</i><br />
                                    <Link to={(ClientRoutesConstants.fastEditAccounts).replace(':cid', props?.cid)}>
                                        <ButtonComponent className="btn btn-primary mt-2 mb-2" text="Add new Account" >
                                            <i className="fa fa-plus mr-2"></i>
                                        </ButtonComponent>
                                    </Link>
                                </td>
                            </tr>

                        }
                    </tbody>
                </table>
            </div>
            <div className="d-flex justify-content-start justify-content-sm-end pt-1">
                {!!accounts?.length && <AccountsMatrixComponent accounts={accounts} />}
            </div>
            {
                !!accounts?.length &&
                <>
                    <div className="h-line"></div>
                    <div className="row">
                        <div className="col-12 f-12 d-flex flex-column flex-sm-row align-items-start align-items-sm-center  justify-content-end p-2" >
                            <div className="d-flex align-items-center mr-2">Deleted/Repaired/Satifactory <i className="ml-1 f-19 fa fa-check text-success" title="Deleted / Repaired"></i></div>
                            <div className="d-flex align-items-center mr-2">In Dispute/In Progress  <i className="ml-1 f-19 fa fa-clock-o text-secondary" title="In Dispute"></i></div>
                            <div className="d-flex align-items-center mr-2">Not Yet Disputed  <i className="ml-1 f-19 fa fa-times text-danger" title="Not Yet Disputed"></i></div>
                        </div>
                    </div>
                </>
            }
            <ModalComponent title={'Edit Account'}
                isVisible={isEdit} onClose={() => { setIsEdit(false); setEditAcc(null); }}>
                {
                    isEdit && <EditAccountMiniComponent cid={props?.cid} acc={editAcc}
                        isTUAvailable={!!editAcc?.tuAccountBureauId && editAcc?.tuAccountBureauId !== Variables.EMPTY_GUID}
                        isEXPAvailable={!!editAcc?.expAccountBureauId && editAcc?.expAccountBureauId !== Variables.EMPTY_GUID}
                        isEQFAvailable={!!editAcc?.eqfAccountBureauId && editAcc?.eqfAccountBureauId !== Variables.EMPTY_GUID}
                        mode={EnumComponentMode.Add}
                        customer={props?.customer}
                        onSave={onSave} onClose={() => { setIsEdit(false); setEditAcc(null); }} />
                }
            </ModalComponent>
        </div>
    );
});