import axios, { CancelTokenSource } from 'axios';
import React, { useEffect, useState } from 'react';
import toastr from 'toastr';

import AuthService from '../../core/services/auth.service';
import { CollectionEntryTypes, EnumBureausShorts, EnumComponentMode, EnumControlTypes, GlobalParams } from '../../models/enums';
import { FastEditSingleAccountModel, IBureauChange, IFastEditAccount, IFEAccountSavedResponse } from '../../models/interfaces/fast-edit-accounts';
import { FEAccountField } from './fe-account-field';
import { FEAddEditAccountComponent } from '../../screens/customer/fast-edit-accounts/components/fe-add-edit-account';
import { Messages } from '../constants';
import { SearchCollectionEntries } from './search-collection-entries';
import { createNewAccount } from '../../actions/fast-edit.actions';
import { Checkbox } from './checkbox';
import { ButtonComponent } from './button';

export const AddNewAccountComponent = (props: any) => {

    const [changes, setChanges] = useState({} as FastEditSingleAccountModel);
    const [axiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        return () => {
            if (axiosSource.cancel) {
                axiosSource.cancel(Messages.APIAborted);
            }
        }
    }, []);

    useEffect(() => {
        if (props?.isDuplicating && props?.duplicateAccData) {
            setChanges({
                ...changes,
                ...(props?.duplicateAccData || {})
            });
        }
    }, [props?.isDuplicating, props?.duplicateAccData]);

    const addNewAccount = () => {
        const currentChanges = changes;
        const hasChanges = (!currentChanges?.accountName || !currentChanges?.round || currentChanges?.globalAccType
            || currentChanges?.globalOutcome || currentChanges?.TU || currentChanges?.EXP || currentChanges?.EQF);
        if (!currentChanges?.accountName) {
            toastr.error('Please enter a value for Account Name or enter an EMPTY space using SPACEBAR in your keyboard.');
            return;
        }
        if (currentChanges?.hasOwnProperty('globalAccType')) {
            if (typeof (currentChanges?.globalAccType) == 'object' ? !currentChanges?.globalAccType?.name : !currentChanges?.globalAccType) {
                toastr.warning('Please enter Account type');
                return;
            }
        } else {
            toastr.warning('Please enter Account type');
            return;
        }
        if (!hasChanges || !currentChanges || Object.getOwnPropertyNames(currentChanges)?.length === 0) {
            toastr.error('Please add some details in the Account.');
            return;
        }
        const payload = AuthService.getCurrentJWTPayload();
        setUpdating(true);
        createNewAccount(changes, props?.customer, payload?.membershipId, axiosSource)
            .then((result: IFEAccountSavedResponse) => {
                setUpdating(false);
                if (result) {
                    toastr.success(`Account Added Successfully!`);
                    props?.onAddNewAccount(result);
                    props?.onClose();
                }
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setUpdating(false);
                    toastr.error(err?.response?.data || Messages.GenericError);
                }
            })
    }
    const onBureauChange = (data: any, bureau: EnumBureausShorts) => {
        setChanges({
            ...changes,
            [bureau]: data
        });
    }
    const onGlobalParamsChange = (data: any, param: GlobalParams | string) => {
        setChanges({
            ...changes,
            [param]: data
        });
    }
    const onCopyClick = (source: EnumBureausShorts, destination: EnumBureausShorts) => {
        switch (source) {
            case EnumBureausShorts.TU:
                if (destination === EnumBureausShorts.EXP) {
                    onBureauChange(changes[EnumBureausShorts.TU], EnumBureausShorts.EXP);
                } else if (destination === EnumBureausShorts.EQF) {
                    onBureauChange(changes[EnumBureausShorts.TU], EnumBureausShorts.EQF);
                }
                break;
            case EnumBureausShorts.EXP:
                if (destination === EnumBureausShorts.TU) {
                    onBureauChange(changes[EnumBureausShorts.EXP], EnumBureausShorts.TU);
                } else if (destination === EnumBureausShorts.EQF) {
                    onBureauChange(changes[EnumBureausShorts.EXP], EnumBureausShorts.EQF);
                }
                break;
            case EnumBureausShorts.EQF:
                if (destination === EnumBureausShorts.EXP) {
                    onBureauChange(changes[EnumBureausShorts.EQF], EnumBureausShorts.EXP);
                } else if (destination === EnumBureausShorts.TU) {
                    onBureauChange(changes[EnumBureausShorts.EQF], EnumBureausShorts.TU);
                }
                break;
        }
    }
    return (
        <div className="add-new-account row">
            <div className="col-xs-12 col-sm-9 border-right-grad">
                <FEAddEditAccountComponent
                    mode={EnumComponentMode.Add}
                    transUnion={(changes[EnumBureausShorts.TU])}
                    experian={(changes[EnumBureausShorts.EXP])}
                    equifax={(changes[EnumBureausShorts.EQF])}
                    onTUChange={(d: any) => onBureauChange(d, EnumBureausShorts.TU)}
                    onEXPChange={(d: any) => onBureauChange(d, EnumBureausShorts.EXP)}
                    onEQChange={(d: any) => onBureauChange(d, EnumBureausShorts.EQF)}
                    onReasonChange={(d: any) => onGlobalParamsChange(d, GlobalParams.globalReason)}
                    onOutcomeChange={(d: any) => onGlobalParamsChange(d, GlobalParams.globalOutcome)}
                    onAccTypeChange={(d: any) => onGlobalParamsChange(d, GlobalParams.globalAccType)}
                    onCopyClick={onCopyClick}
                    isTUAvailable={true}
                    isEXPAvailable={true}
                    isEQFAvailable={true}
                    allowCopy={true}
                    accountType={changes?.globalAccType?.name || ''}
                />
            </div>
            <div className="col-xs-12 col-sm-3">
                {
                    props?.showFastTrack &&
                    <div className="row mt-3">
                        <div className="col-12">
                            <div className="mt-2 fasttrack-check">
                                <Checkbox text="Is Standard & Fast Track" checked={changes?.isFastTrack || false} onChange={(data: any) => {
                                    onGlobalParamsChange(data?.checked, 'isFastTrack');
                                }} />
                            </div>
                        </div>
                    </div>
                }
                <div className="row mt-3 mb-5">
                    <div className="col-12">
                        <div className="form-group">
                            <label className='text-orange-red'>Account Name*</label>
                            <div className="input-group">
                                <SearchCollectionEntries minSearchLength={2} defaultValue={changes?.accountName || ''} type={CollectionEntryTypes.AccountName}
                                    onChange={(e: any) => onGlobalParamsChange(e, 'accountName')} placeholder="Type to search..."
                                />
                            </div>
                        </div>
                        <div className="form-group w-80">
                            <div className="input-group">
                                <FEAccountField label="Round" mode={EnumComponentMode.Add} type={EnumControlTypes.Number} value={changes?.round || ''} onChange={(val) => onGlobalParamsChange(val, 'round')} />
                            </div>
                        </div>
                    </div>

                </div>
                <div className="row mt-4">
                    <div className="col-12 d-flex justify-content-between">
                        <ButtonComponent text="Close" className="btn-sm btn-secondary" onClick={props?.onClose} >
                            <i className="fa fa-close mr-1"></i>
                        </ButtonComponent>
                        <ButtonComponent text="Save Account" loading={updating} className="btn-sm btn-primary" onClick={addNewAccount} >
                            <i className="fa fa-save mr-1"></i>
                        </ButtonComponent>
                    </div>
                </div>
            </div>
        </div>
    );
}