import axios, { CancelTokenSource } from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { CommonUtils } from '../../../../../../../utils/common-utils';
import { LargeSpinner } from '../../../../../../../shared/components/large-spinner';
import { ICheckboxListNew, ISelectedAccounts } from '../../../../../../../models/interfaces/create-letter';
import { IFastEditAccount, IFastEditAccountsParams } from '../../../../../../../models/interfaces/fast-edit-accounts';
import { getFastccounts } from '../../../../../../../actions/fast-edit.actions';
import { CheckboxList } from '../../../../../../../shared/components/checkbox-list';
import { Alignment, EnumBureausShorts, Outcome } from '../../../../../../../models/enums';
import { ICheckbox } from '../../../../../../../models/interfaces/shared';
import { saveSelectedAccounts, saveAccounts } from '../../../../../../../actions/create-letter.actions';
import { Messages, Variables } from '../../../../../../../shared/constants';
import { BureauLogoComponent } from '../../../../../../../shared/components/bureau-logo';
import { Checkbox } from '../../../../../../../shared/components/checkbox';

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getFastccounts,
        saveSelectedAccounts,
        saveAccounts
    }, dispatch);
}
const mapStateToProps = (state: any) => {
    return {
        model: state?.createLetterModel
    };
}
const __defaults = {
    pageFrom: 1,
    pageTo: 500,
    orderBy: 'Enter',
    orderType: 'Desc'
};
export const CreateLetterAccountListComponent = connect(mapStateToProps, mapDispatchToProps)((props: any) => {

    const [loading, setLoading] = useState(false);
    const [allChecked, setAllChecked] = useState(false);
    const [accounts, setAccounts] = useState([] as IFastEditAccount[]);
    const [axiosSource, setAxiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);

    const [filter, setFilter] = useState({
        ...__defaults,
        customerId: props?.cid
    } as IFastEditAccountsParams);

    useEffect(() => {
        loadAccounts();
        setAllChecked(false);
        return () => {
            if (axiosSource?.cancel)
                axiosSource?.cancel(Messages.APIAborted);
        }
    }, [props?.cid]);

    const loadAccounts = () => {
        setLoading(true);
        const src = axios.CancelToken.source();
        setAxiosSource(src);
        props?.getFastccounts({ ...filter, customerId: props?.cid }, src)
            .then((result: IFastEditAccount[]) => {
                const filtered = result?.map((x: any) => ({
                    ...x,
                    isAddressEmpty: isAddressEmpty(x)
                }))
                setLoading(false);
                setAccounts(filtered);
                props.saveAccounts(filtered);
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setLoading(false);
                }
            });
    }
    const isAddressEmpty = (acc: IFastEditAccount) => {
        return !acc?.collectorAddresses && !acc?.collectorCity && !acc?.collectorState && !acc?.collectorZipCode;
    }
    const handleChange = (selectedBuireauIds: string[], account: IFastEditAccount, orgnlObj?: ICheckbox) => {
        let oldAccs = JSON.parse(JSON.stringify({ ...(props?.model?.selectedAccounts ?? {}) }));
        let bureaus = oldAccs[account.id];
        let currentBureau = bureaus?.find((x: ICheckboxListNew) => x.value === orgnlObj?.value);
        if (currentBureau) {
            currentBureau.checked = orgnlObj?.checked;
        }
        oldAccs = {
            ...oldAccs,
            [account.id]: bureaus
        } as ISelectedAccounts;
        props?.saveSelectedAccounts(oldAccs);
    }
    const getAvailableBureaus = ((account: IFastEditAccount): ICheckboxListNew[] => {
        let list: ICheckboxListNew[] = [];
        [...Variables.BUREAU_LIST1, ...Variables.BUREAU_LIST2]
            .forEach((item: any) => {
                switch (item?.value) {
                    case EnumBureausShorts.TU:
                        if (account?.tuAccountBureauId !== Variables.EMPTY_GUID) {
                            list.push({ value: account?.tuAccountBureauId, text: item?.value, disabled: isDisabled(account.id, account?.tuAccountBureauId, account?.tuOutcome) });
                        }
                        break;
                    case EnumBureausShorts.EXP:
                        if (account?.expAccountBureauId !== Variables.EMPTY_GUID) {
                            list.push({ value: account?.expAccountBureauId, text: item?.value, disabled: isDisabled(account.id, account?.expAccountBureauId, account?.expOutcome) });
                        }
                        break;
                    case EnumBureausShorts.EQF:
                        if (account?.eqfAccountBureauId !== Variables.EMPTY_GUID) {
                            list.push({ value: account?.eqfAccountBureauId, text: item?.value, disabled: isDisabled(account.id, account?.eqfAccountBureauId, account?.eqfOutcome) });
                        }
                        break;
                    case EnumBureausShorts.CREDITOR:
                        list.push({ value: item?.value, text: item?.value, disabled: isDisabled(account.id, item?.value, '') });
                        break;
                    case EnumBureausShorts.BCC:
                    case EnumBureausShorts.CC:
                        list.push({ value: item?.value, text: item?.value, disabled: true });
                        break;
                }
            });
        return list;
    });
    const isDisabled = (ccid: string, buid: string, outcome?: string): boolean => {
        const availabeToCheck = isAvailableToSelect(outcome);
        let disabled = true;
        if (props?.model?.selectedAccounts && (props?.model?.selectedAccounts)[ccid]) {
            const entry = (props?.model?.selectedAccounts as ISelectedAccounts)[ccid];
            if (!entry?.find(x => x?.value === buid)) {
                disabled = true;
            } else {
                disabled = !!entry?.find(x => x?.value === buid)?.disabled;
            }
        }
        if (!availabeToCheck) return true;
        return disabled;
    }
    const isAvailableToSelect = (outcome?: string) => {
        return CommonUtils.isAvailableToSelect(outcome);
    }
    const getAccountsSelectedCounts = ((bureau: EnumBureausShorts) => {
        let counts = 0;
        if (props?.model?.selectedAccounts) {
            const list = Object.getOwnPropertyNames(props?.model?.selectedAccounts)?.filter((key: string) => {
                return !!props?.model?.selectedAccounts[key]?.find((m: ICheckboxListNew) => m?.text === bureau && m?.checked);
            });
            counts = list?.length || 0;
        }
        return counts;
    });
    const onAllChecked = (checked: boolean) => {
        let oldAccs = JSON.parse(JSON.stringify({ ...(props?.model?.selectedAccounts ?? {}) }));
        Object.getOwnPropertyNames(oldAccs).forEach((accId: string) => {
            let bureaus = oldAccs[accId];
            bureaus = bureaus?.map((x: ICheckboxListNew) => ({ ...x, checked })) || [];
            oldAccs = {
                ...oldAccs,
                [accId]: bureaus
            } as ISelectedAccounts;
        })
        props?.saveSelectedAccounts(oldAccs);
    }
    return (
        <div className="letter-accounts-list">
            <div className="d-flex selected-accounts-counts f-12">
                <span className="mr-3">
                    <span className="font-weight-bold">Selected TU Accounts: </span>
                    <span className="curr-round head-value">{getAccountsSelectedCounts(EnumBureausShorts.TU)}</span>
                </span>
                <span className="mr-3">
                    <span className="font-weight-bold">Selected EXP Accounts: </span>
                    <span className="round-status head-value">{getAccountsSelectedCounts(EnumBureausShorts.EXP)}</span>
                </span>
                <span className="mr-3">
                    <span className="font-weight-bold">Selected EQF Accounts: </span>
                    <span className="round-date head-value">{getAccountsSelectedCounts(EnumBureausShorts.EQF)}</span>
                </span>
            </div>
            <div className="table-responsive list-scrollable custom-scrollbar position-relative">
                {loading && <LargeSpinner />}
                <table className="dataTableCustomers table table-striped table-hover">
                    <thead className="back_table_color">
                        <tr className="secondary">
                            <th style={{ width: '7%', textAlign: 'center' }}>
                                {
                                    !!props?.model?.selectedAccounts &&
                                    <Checkbox text="Select/Unselect All" checked={allChecked} onChange={(data: any) => { setAllChecked(data?.checked); onAllChecked(data?.checked); }} />
                                }
                            </th>
                            <th style={{ width: '10%' }}>
                                Account Name
                            </th>
                            <th style={{ width: '12%' }}>Account Type</th>
                            <th style={{ width: '12%' }}>Account Number</th>
                            <th style={{ width: '12%' }}>Balance</th>
                            <th style={{ width: '12%' }}>Pay Status</th>
                            <th className="text-center" style={{ width: '5%' }}>Rnd</th>
                            <th className="text-center" style={{ width: '5%' }}>
                                <BureauLogoComponent type={EnumBureausShorts.EQF} size={'sm'} />
                            </th>
                            <th className="text-center" style={{ width: '5%' }}>
                                <BureauLogoComponent type={EnumBureausShorts.EXP} size={'sm'} />
                            </th>
                            <th className="text-center" style={{ width: '5%' }}>
                                <BureauLogoComponent type={EnumBureausShorts.TU} size={'sm'} />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            accounts?.length ?
                                accounts?.map((account: IFastEditAccount, index: number) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <div className="d-flex justify-content-center mt-2 mb-2 bg-light p-2 pb-0 rounded shadow" >
                                                    <CheckboxList selectedValues={props?.model?.selectedAccounts && props?.model?.selectedAccounts[account.id]
                                                        ? props?.model?.selectedAccounts[account.id]?.filter((item: ICheckboxListNew) => item?.checked)?.map((item: ICheckboxListNew) => item?.value)
                                                        : []} alignment={Alignment.Vertical}
                                                        list={getAvailableBureaus(account)} onChange={(values, orgnlObj) => { handleChange(values, account, orgnlObj); }} />
                                                </div>
                                            </td>
                                            <td>
                                                <div className='h-100 w-100 d-flex flex-column justify-content-center align-items-center'>
                                                    <div>
                                                        {account?.collectorName}
                                                    </div>
                                                    {
                                                        account?.isAddressEmpty && <div className='text-danger mt-2 f-11'>
*address empty
                                                        </div>
                                                    }
                                                </div>
                                            </td>
                                            <td>
                                                {account?.accountTypeName}
                                            </td>
                                            <td className="text-left">
                                                <div className="d-flex flex-column">
                                                    {
                                                        !!account?.tuAccountNumber &&
                                                        <div>
                                                            <label>TU:&nbsp; </label>
                                                            <span>{account?.tuAccountNumber}</span>
                                                        </div>
                                                    }
                                                    {
                                                        !!account?.expAccountNumber &&
                                                        <div>
                                                            <label>EXP:&nbsp; </label>
                                                            <span>{account?.expAccountNumber}</span>
                                                        </div>
                                                    }
                                                    {
                                                        !!account?.eqfAccountNumber &&
                                                        <div>
                                                            <label>EQF:&nbsp; </label>
                                                            <span>{account?.eqfAccountNumber}</span>
                                                        </div>
                                                    }
                                                </div>
                                            </td>
                                            <td className="text-left">
                                                <div className="d-flex flex-column">
                                                    {
                                                        !!account?.tuBalance &&
                                                        <div>
                                                            <label>TU:&nbsp; </label>
                                                            <span>{account?.tuBalance}</span>
                                                        </div>
                                                    }
                                                    {
                                                        !!account?.expBalance &&
                                                        <div>
                                                            <label>EXP:&nbsp; </label>
                                                            <span>{account?.expBalance}</span>
                                                        </div>
                                                    }
                                                    {
                                                        !!account?.eqfBalance &&
                                                        <div>
                                                            <label>EQF:&nbsp; </label>
                                                            <span>{account?.eqfBalance}</span>
                                                        </div>
                                                    }
                                                </div>
                                            </td>
                                            <td className="text-left">
                                                <div className="d-flex flex-column">
                                                    {
                                                        !!account?.tuPayStatus &&
                                                        <div>
                                                            <label>TU:&nbsp; </label>
                                                            <span>{account?.tuPayStatus}</span>
                                                        </div>
                                                    }
                                                    {
                                                        !!account?.expPayStatus &&
                                                        <div>
                                                            <label>EXP:&nbsp; </label>
                                                            <span>{account?.expPayStatus}</span>
                                                        </div>
                                                    }
                                                    {
                                                        !!account?.eqfPayStatus &&
                                                        <div>
                                                            <label>EQF:&nbsp; </label>
                                                            <span>{account?.eqfPayStatus}</span>
                                                        </div>
                                                    }
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                {account?.scoringRound}
                                            </td>
                                            <td className="text-center">
                                                {
                                                    !account?.objeqfOutcome ?
                                                        account?.eqfAccountBureauId !== Variables.EMPTY_GUID ?
                                                            <i className="fa fa-times f-17 text-danger" title="Not Yet Disputed"></i>
                                                            : <span className="font-weight-bold">No EQF Listing</span>
                                                        : (
                                                            account?.objeqfOutcome?.toLowerCase() == Outcome.DELETED?.toLowerCase()
                                                            || account?.objeqfOutcome?.toLowerCase() == Outcome.REPAIRED?.toLowerCase()
                                                            || account?.objeqfOutcome?.toLowerCase() == Outcome.SATISFACTORY?.toLowerCase()
                                                        ) ?
                                                            <i className="fa fa-check f-17 text-success" title="Deleted / Repaired"></i>
                                                            :
                                                            (account?.objeqfOutcome?.toLowerCase() == Outcome.IN_DISPUTE?.toLowerCase()
                                                                || account?.objeqfOutcome?.toLowerCase() == Outcome.IN_PROGRESS?.toLowerCase())
                                                                ? <i className="fa fa-clock-o f-17 text-secondary" title="In Dispute"></i>
                                                                : null

                                                }
                                            </td>
                                            <td className="text-center">
                                                {
                                                    !account?.objexpOutcome ?
                                                        account?.expAccountBureauId !== Variables.EMPTY_GUID ?
                                                            <i className="fa fa-times f-17 text-danger" title="Not Yet Disputed"></i>
                                                            : <span className="font-weight-bold">No EXP Listing</span>
                                                        : (
                                                            account?.objexpOutcome?.toLowerCase() == Outcome.DELETED?.toLowerCase()
                                                            || account?.objexpOutcome?.toLowerCase() == Outcome.REPAIRED?.toLowerCase()
                                                            || account?.objexpOutcome?.toLowerCase() == Outcome.SATISFACTORY.toLowerCase()
                                                        ) ?
                                                            <i className="fa fa-check f-17 text-success" title="Deleted / Repaired"></i>
                                                            :
                                                            (account?.objexpOutcome?.toLowerCase() == Outcome.IN_DISPUTE?.toLowerCase()
                                                                || account?.objexpOutcome?.toLowerCase() == Outcome.IN_PROGRESS?.toLowerCase())
                                                                ? <i className="fa fa-clock-o f-17 text-secondary" title="In Dispute"></i>
                                                                : null

                                                }
                                            </td>
                                            <td className="text-center">
                                                {
                                                    !account?.objtuOutcome ?
                                                        account?.tuAccountBureauId !== Variables.EMPTY_GUID ?
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
                                        </tr>
                                    );
                                })
                                :
                                <tr>
                                    <td colSpan={10} className="text-center text-danger" style={{ height: '50px' }}>
                                        <i>No accounts available.</i>
                                    </td>
                                </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
});