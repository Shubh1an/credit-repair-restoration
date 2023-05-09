import axios, { CancelTokenSource } from 'axios';
import classnames from 'classnames';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import toastr from 'toastr';

import { updateAccountMini } from '../../../../../../actions/fast-edit.actions';
import AuthService from '../../../../../../core/services/auth.service';
import { CollectionEntryTypes, EnumBureausShorts, EnumComponentMode, GlobalParams } from '../../../../../../models/enums';
import { ICollectionAccountItem } from '../../../../../../models/interfaces/customer-view';
import { IBureauChange, IFastEditAccount, IFEAccountHistoryModel, IFEAccountSavedResponse } from '../../../../../../models/interfaces/fast-edit-accounts';
import { BureauLogoComponent } from '../../../../../../shared/components/bureau-logo';
import { ButtonComponent } from '../../../../../../shared/components/button';
import { SearchCollectionEntries } from '../../../../../../shared/components/search-collection-entries';
import { Messages } from '../../../../../../shared/constants';
import { FEBureauDetailsMini } from '../../../../fast-edit-accounts/components/fe-bureau-details-mini';
import { saveFEAccount } from '../../../../../../actions/fast-edit.actions';


const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        updateAccountMini
    }, dispatch);
}

export const EditAccountMiniComponent = connect(null, mapDispatchToProps)((props: {
    cid: string,
    updateAccountMini: any, isTUAvailable: boolean, isEXPAvailable: boolean, isEQFAvailable: boolean,
    acc: ICollectionAccountItem | null, onSave?: any, onClose?: any,
    mode: EnumComponentMode,
    customer?: any
}) => {

    const [transunion, settransunion] = useState({} as IBureauChange);
    const [experian, setexperian] = useState({} as IBureauChange);
    const [equifax, setequifax] = useState({} as IBureauChange);
    const [updating, setUpdating] = useState(false as boolean);
    const [axiousSource] = useState(axios.CancelToken.source() as CancelTokenSource);
    const [changes, setChanges] = useState({} as IFEAccountHistoryModel);

    useEffect(() => {
        settransunion(getTUData(props.acc));
        setexperian(getEXPData(props.acc));
        setequifax(getEQFData(props.acc));
    }, [props?.acc])


    const getTUData = (data?: ICollectionAccountItem | null): IBureauChange => {
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
    const getEXPData = (data?: ICollectionAccountItem | null): IBureauChange => {
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
    const getEQFData = (data?: ICollectionAccountItem | null): IBureauChange => {
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

    const onBureauChange = (data: any, ccid: string, bureau: EnumBureausShorts) => {
        const c = {
            ...changes,
            [ccid]: {
                ...changes[ccid],
                [bureau]: data
            }
        };
        console.log(c);
        setChanges(c);
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
    const updateAccount = () => {
        const currentChanges = changes[props?.acc?.id || ''];
        const hasChanges = (currentChanges?.globalAccType || currentChanges?.TU || currentChanges?.EXP || currentChanges?.EQF);

        if (!hasChanges || !currentChanges || Object.getOwnPropertyNames(currentChanges)?.length === 0) {
            toastr.error('There are no changes in the Account.');
            return;
        }
        const payload = AuthService.getCurrentJWTPayload();
        setUpdating(true);
        saveFEAccount(changes, props?.customer, payload?.membershipId, axiousSource, [props.acc as IFastEditAccount], props?.acc?.id || '')
            .then((result: IFEAccountSavedResponse) => {
                setUpdating(false);
                toastr.success('Account updated successfully!');
                props?.onSave();
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setUpdating(false);
                    toastr.error(err?.response?.data || Messages.GenericError);
                }
            })
    }
    return <div className='account-mini'>
        <div className="row mb-1 mt-4">
            <div className="col-12 col-sm-6">
                <div className="form-group">
                    <label>Account Name</label>
                    <div className=''>{props?.acc?.collectorName}</div>
                </div>
            </div>
            <div className="col-12 col-sm-6">
                <div className="form-group">
                    <div className="d-flex align-items-center">
                        <label className='mb-2'>Account Type</label>
                    </div>
                    <div>
                        <SearchCollectionEntries minSearchLength={2}
                            defaultValue={props?.acc?.accountTypeName || ''}
                            type={CollectionEntryTypes.AccountType} onChange={(d: any) => onGlobalParamsChange(d, props?.acc?.id || 'NA', GlobalParams.globalAccType)} placeholder="Type to search..." />
                    </div>
                </div>
            </div>
        </div>
        <div className='col-12 p-0'>
            <div className='h-line mb-3'></div>
            <div className="row">
                <div className="col-4 tu-head d-none d-sm-block">
                    <BureauLogoComponent type={EnumBureausShorts.TU} size={'md'} />
                </div>
                <div className="col-4 exp-head d-none d-sm-block">
                    <BureauLogoComponent type={EnumBureausShorts.EXP} size={'md'} />
                </div>
                <div className="col-4 eq-head d-none d-sm-block">
                    <div className='d-flex justify-content-center align-items-center h-100'>
                        <BureauLogoComponent type={EnumBureausShorts.EQF} size={'md'} />
                    </div>
                </div>
                <div className={classnames("col-12 col-sm-4 mt-3 mt-sm-0 border-right-grad flex-column flex-sm-row", { 'd-flex justify-content-center align-items-center': !props?.isTUAvailable })}>
                    <div className="d-block d-sm-none text-center mb-2 mb-sm-0">
                        <BureauLogoComponent type={EnumBureausShorts.TU} size={'md'} />
                    </div>
                    {
                        props?.isTUAvailable ?
                            <FEBureauDetailsMini {...props} data={transunion} onChange={(d: any) => onBureauChange(d, props?.acc?.id || 'NA', EnumBureausShorts.TU)} />
                            : <span className="text-danger font-weight-bold mt-2 mt-sm-0">No TU Listing</span>
                    }
                </div>
                <div className={classnames("col-12 col-sm-4 border-right-grad flex-column flex-sm-row", { 'd-flex justify-content-center align-items-center': !props?.isEXPAvailable })}>
                    <div className="d-block d-sm-none text-center mt-4">
                        <BureauLogoComponent type={EnumBureausShorts.EXP} size={'md'} />
                    </div>
                    {
                        props?.isEXPAvailable ?
                            <FEBureauDetailsMini {...props} data={experian} onChange={(d: any) => onBureauChange(d, props?.acc?.id || 'NA', EnumBureausShorts.EXP)} />
                            : <span className="text-danger font-weight-bold mt-2 mt-sm-0">No EXP Listing</span>
                    }
                </div>
                <div className={classnames("col-12 col-sm-4  flex-column flex-sm-row mb-3 mb-sm-0", { 'd-flex justify-content-center align-items-center': !props?.isEQFAvailable })}>
                    <div className="d-block d-sm-none text-center mt-4">
                        <BureauLogoComponent type={EnumBureausShorts.EQF} size={'md'} />
                    </div>
                    {
                        props?.isEQFAvailable ?
                            <FEBureauDetailsMini {...props} data={equifax} onChange={(d: any) => onBureauChange(d, props?.acc?.id || 'NA', EnumBureausShorts.EQF)} />
                            : <span className="text-danger font-weight-bold mt-2 mt-sm-0">No EQF Listing</span>
                    }
                </div>
            </div>
            <div className=' h-line mb-4 mt-4'></div>
        </div>
        <div className="col-12 mt-4">
            <div className="d-flex justify-content-end">
                <ButtonComponent text="Close" className="btn-sm btn-secondary" onClick={props?.onClose} >
                    <i className="fa fa-close mr-1"></i>
                </ButtonComponent>
                <ButtonComponent text="Save Account" loading={updating} className="btn-sm btn-primary ml-3" onClick={updateAccount} >
                    <i className="fa fa-save mr-1"></i>
                </ButtonComponent>
            </div>
        </div>
    </div>;
});
