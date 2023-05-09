import React, { useEffect, useState } from 'react';
import moment from 'moment';
import axios, { CancelTokenSource } from 'axios';
import toastr from 'toastr';
// @ts-ignore
import confirm from 'reactstrap-confirm';

import { CollectionEntryTypes, EnumBureausShorts, EnumComponentMode, EnumControlTypes, GlobalParams } from '../../models/enums';
import { FastEditSingleAccountModel, IAccountdetails, ICollectorAddress, IDataItem, IFastFullDetailsRequest, IFullBureauDetails } from '../../models/interfaces/fast-edit-accounts';
import { FEAccountField } from './fe-account-field';
import { FEAddEditFullAccountComponent } from '../../screens/customer/fast-edit-accounts/components/fe-add-edit-full-account';
import { SearchCollectionEntries } from './search-collection-entries';
import { deleteBureauDetail, getFEFullAccountDetails, getFELetterData, saveFEFullAccount } from '../../actions/fast-edit.actions';
import { Messages } from '../constants';
import { Checkbox } from './checkbox';
import { LargeSpinner } from './large-spinner';
import { ICustomerFullDetails } from '../../models/interfaces/customer-view';
import AuthService from '../../core/services/auth.service';

export const AddNewFullAccountComponent = (props: {
    cid: string;
    ccid: string;
    dateEntered?: string;
    dateModifiedOn?: string;
    customer: ICustomerFullDetails | null;
    round?: string;
    accountName?: string;
    accountType?: string;
    showFastTrack?: boolean;
    isFastTrack?: boolean;
    accountDetails?: IAccountdetails;
    collectorAddress?: ICollectorAddress;
    onSave?: (data: any) => any;
    onClose?: () => any
}) => {

    const [transUnion, setTransUnion] = useState(null as IFullBureauDetails | null);
    const [experian, setExperian] = useState(null as IFullBureauDetails | null);
    const [equifax, setEquifax] = useState(null as IFullBureauDetails | null);
    const [loading, setLoading] = useState(false);
    const [changes, setChanges] = useState({} as FastEditSingleAccountModel);
    const [axiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);
    const [account, setAccount] = useState(null as any);
    const [names, setNames] = useState([] as IDataItem[]);
    const [addresses, setAddresses] = useState([] as IDataItem[]);
    const [isFastTrack, setIsFastTrack] = useState(props?.isFastTrack);

    useEffect(() => {
        setIsFastTrack(props?.isFastTrack);
    }, [props?.isFastTrack]);

    useEffect(() => {
        setChanges({
            ...changes,
            accountName: props?.accountName
        })
    }, [props?.accountName])
    const getTUData = (data?: any): IFullBureauDetails => {
        const bureau = data?.bureauData?.find((x: any) => x.bureau === 3);
        const obj = getObject(bureau);
        obj.isInserted = bureau?.isInsertedTU;
        return obj;
    }
    const getEXPData = (data?: any): IFullBureauDetails => {
        const bureau = data?.bureauData?.find((x: any) => x.bureau === 2);
        const obj = getObject(bureau);
        obj.isInserted = bureau?.isInsertedEXP;
        return obj;
    }
    const getEQFData = (data?: any): IFullBureauDetails => {
        const bureau = data?.bureauData?.find((x: any) => x.bureau === 1);
        const obj = getObject(bureau);
        obj.isInserted = bureau?.isInsertedEQF;
        return obj;
    }
    const getObject = (bureau: any) => {
        return {
            id: bureau?.id,
            accNum: bureau?.accountNumber,
            accStatus: bureau?.status?.value,
            balance: bureau?.balance,
            currentDisputeReason: bureau?.tailEndDisputeReason?.value,
            currentOutcome: bureau?.outcome?.value,
            dateOfInquiry: bureau?.dateOfInquiry,
            dateOpened: bureau?.dateOpened,
            highCredit: bureau?.highCreditLimit,
            highCreditLimit: bureau?.highCreditLimit,
            payStatus: bureau?.payStatus,
            isInserted: bureau?.isInsertedTU,
            originalCreditor: bureau?.originalCreditor,
            courtOrPlaintiff: bureau?.courtPlaintiff,
            dateLastActivity: bureau?.lastActivity,
            responsibility: bureau?.responsibility,
            dateLastReported: bureau?.lastDateReported,
            monthlyPayment: bureau?.monthlyPayment,
            pastDueAmount: bureau?.pastDueAmount,
            payments30: bureau?.payHistory30,
            payments60: bureau?.payHistory60,
            payments90: bureau?.payHistory90,
            incorrectNames: bureau?.names,
            incorrectAddreses: bureau?.addresses,
            notes: bureau?.notes,
            accountNotes: bureau?.notes
        }
    }
    useEffect(() => {
        loadAccountData();
        loadLetterData();
        return () => {
            if (axiosSource.cancel) {
                axiosSource.cancel(Messages.APIAborted);
            }
        }
    }, []);
    const loadLetterData = () => {
        setLoading(true);
        getFELetterData(props?.cid, axiosSource)
            .then((res: any) => {
                setNames(res?.name);
                setAddresses(res?.address);
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setLoading(false);
                }
            })
    }
    const loadAccountData = () => {
        setLoading(true);
        getFEFullAccountDetails(props?.ccid, axiosSource)
            .then((res: any) => {
                setLoading(false);
                setAccount(res);
                setTransUnion(getTUData(res));
                setExperian(getEXPData(res));
                setEquifax(getEQFData(res));
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setLoading(false);
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
    const onSave = () => {
        const hasChanges = (changes?.globalAccType || changes?.accountName || changes?.TU || changes?.EXP || changes?.EQF
            || changes?.isFastTrack !== account?.isFastTrack || changes?.round !== account?.scoringRound);
        if (!changes?.accountName) {
            toastr.error('Please enter a value for Account Name or enter an EMPTY space using SPACEBAR in your keyboard.');
            return;
        }
        if (Object.getOwnPropertyNames(changes)?.length !== 0) {
            if (changes?.globalAccType !== undefined && !((changes?.globalAccType?.name || changes?.globalAccType)?.trim() || changes?.globalAccType?.name)) {
                toastr.warning('Please enter Account type');
                return;
            }
        } else if (!(account && account?.accountType && account?.accountType?.value)) {
            toastr.warning('Please enter Account type');
            return;
        }

        if (!hasChanges || !changes || Object.getOwnPropertyNames(changes)?.length === 0) {
            toastr.error('There are no changes in the Account.');
            return;
        }
        setLoading(true);

        let newChanges = { ...changes };
        newChanges.accountName = newChanges.accountName || props?.accountName;
        newChanges.globalAccType = newChanges.globalAccType || props?.accountType;
        newChanges.isFastTrack = (newChanges.isFastTrack === true || newChanges.isFastTrack === false) ? newChanges.isFastTrack : isFastTrack;
        newChanges.round = newChanges.round || props?.round;
        newChanges.names = names;
        newChanges.addresses = addresses;
        const modifierAgentId = AuthService.getCurrentJWTPayload()?.membershipId;
        saveFEFullAccount(
            {
                changes: newChanges,
                cid: props.customer?.id ?? '',
                modifierAgentId,
                axiosSource,
                account,
                ccid: props?.ccid
            } as IFastFullDetailsRequest)
            .then((res: any) => {
                setLoading(false);
                toastr.success('Account details saved successfully.');
                if (props?.onSave) {
                    props.onSave(props?.ccid);
                }
            }).
            catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setLoading(false);
                    toastr.error(err?.response?.data || Messages.GenericError);
                }
            })

    }
    const onCopyClick = (source: EnumBureausShorts, destination: EnumBureausShorts) => {
        let d;
        switch (source) {
            case EnumBureausShorts.TU:
                d = changes[EnumBureausShorts.TU] || { ...transUnion };
                if (destination === EnumBureausShorts.EXP) {
                    setExperian(d);
                    onBureauChange(d, EnumBureausShorts.EXP);
                } else if (destination === EnumBureausShorts.EQF) {
                    setEquifax(d);
                    onBureauChange(d, EnumBureausShorts.EQF);
                }
                break;
            case EnumBureausShorts.EXP:
                d = changes[EnumBureausShorts.EXP] || { ...experian };
                if (destination === EnumBureausShorts.TU) {
                    setTransUnion(d);
                    onBureauChange(d, EnumBureausShorts.TU);
                } else if (destination === EnumBureausShorts.EQF) {
                    setEquifax(d);
                    onBureauChange(d, EnumBureausShorts.EQF);
                }
                break;
            case EnumBureausShorts.EQF:
                d = changes[EnumBureausShorts.EQF] || { ...equifax };
                if (destination === EnumBureausShorts.EXP) {
                    setExperian(d);
                    onBureauChange(d, EnumBureausShorts.EXP);
                } else if (destination === EnumBureausShorts.TU) {
                    setTransUnion(d);
                    onBureauChange(d, EnumBureausShorts.TU);
                }
                break;
        }
    }
    const onBureauDelete = async (bureau: EnumBureausShorts, cabId: string) => {
        let result = await confirm({
            title: 'Remove Bureau Data?',
            message: "Are you sure you want to remove this Bureau Data?",
            confirmText: "YES",
            confirmColor: "danger",
            cancelColor: "link text-secondary"
        });
        if (result) {
            setLoading(true);
            await deleteBureauDetail(cabId, props?.ccid, axiosSource)
                .then((result: any) => {
                    loadAccountData();
                    setLoading(false);
                    toastr.success('Bureau Data removed successfully!');
                    if (props?.onSave) {
                        props.onSave(props?.ccid);
                    }
                })
                .catch((err: any) => {
                    if (!axios.isCancel(err)) {
                        setLoading(false);
                        toastr.error(err?.response?.data || Messages.GenericError);
                    }
                })
        }
    }
    return (
        <div className="add-new-account row position-relative">
            {loading && <LargeSpinner />}
            <div className="col-xs-12 col-sm-9 border-right-grad">
                <FEAddEditFullAccountComponent
                    mode={EnumComponentMode.Add}
                    transUnion={transUnion}
                    experian={experian}
                    equifax={equifax}
                    names={names}
                    addresses={addresses}
                    onTUChange={(d: any) => onBureauChange(d, EnumBureausShorts.TU)}
                    onEXPChange={(d: any) => onBureauChange(d, EnumBureausShorts.EXP)}
                    onEQChange={(d: any) => onBureauChange(d, EnumBureausShorts.EQF)}
                    onAccountNotesChange={(field: string, value: string) => onGlobalParamsChange(value, field)}
                    onCopyClick={onCopyClick}
                    notes={account?.notes}
                    onDelete={onBureauDelete}
                />
            </div>
            <div className="col-xs-12 col-sm-3 d-flex flex-column">
                <div className="row">
                    <div className="col-12">
                        <div>
                            <label>Entered On:</label>
                            <span className="f-11 pl-1">
                                {
                                    moment(props?.dateEntered).format('MM/DD/YYYY')
                                }
                            </span>
                        </div>
                        <div>
                            <label>Modified On:</label>
                            <span className="f-11 pl-1">
                                {
                                    moment(props?.dateModifiedOn).format('MM/DD/YYYY')
                                }
                            </span>
                        </div>
                        <div>
                            <fieldset className="customer-field-set mt-2 f-11">
                                <legend className="f-11">
                                    <label>Collector Address: </label>
                                </legend>
                                <div className="row m-0 mb-2">
                                    <div className="col-12">
                                        <label>Address: </label>
                                        <span className="pl-1">{account?.collectorAddress?.collectorAddresses}</span>
                                    </div>
                                    <div className="col-12">
                                        <label>City: </label>
                                        <span className="pl-1">{account?.collectorAddress?.collectorCity}</span>
                                    </div>
                                    <div className="col-12">
                                        <label>State: </label>
                                        <span className="pl-1">{account?.collectorAddress?.collectorState}</span>
                                    </div>
                                    <div className="col-12">
                                        <label>ZipCode: </label>
                                        <span className="pl-1">{account?.collectorAddress?.collectorZipCode}</span>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        {
                            props?.showFastTrack &&
                            <div className="row mt-3">
                                <div className="col-12">
                                    <div className="mt-2 fasttrack-check">
                                        <Checkbox text="Is Standard & Fast Track" checked={isFastTrack || false} onChange={(data: any) => {
                                            setIsFastTrack(data?.checked);
                                            onGlobalParamsChange(data?.checked, 'isFastTrack');
                                        }} />
                                    </div>
                                </div>
                            </div>
                        }
                        <br />
                        <div className="form-group mb-3">
                            <label className='text-orange-red'>Account Name*</label>
                            <div className="input-group">
                                <SearchCollectionEntries minSearchLength={2} defaultValue={props?.accountName} type={CollectionEntryTypes.AccountName}
                                    onChange={(e: any) => onGlobalParamsChange(e, 'accountName')} placeholder="Type to search..." />
                            </div>
                        </div>
                        <div className="form-group mb-3">
                            <label className='text-orange-red'>Account Type*</label>
                            <div className="input-group">
                                <SearchCollectionEntries minSearchLength={2} defaultValue={props?.accountType} type={CollectionEntryTypes.AccountType}
                                    onChange={(e: any) => onGlobalParamsChange(e, 'globalAccType')} placeholder="Type to search..." />
                            </div>
                        </div>
                        <div className="form-group w-80">
                            <div className="input-group">
                                <FEAccountField label="Round" mode={EnumComponentMode.Add} type={EnumControlTypes.Number} value={props?.round ?? ''} onChange={(val) => onGlobalParamsChange(val, 'round')} />
                            </div>
                        </div>
                    </div>
                    <div className="col-12 p-0">
                        <br />
                        <br />
                        <div className="row m-0">
                            <div className="col-6">
                                <button className="btn btn-sm btn-secondary f-11  pl-2 pr-2" onClick={props.onClose}>
                                    <i className="fa fa-close mr-1"></i>Close</button>
                            </div>
                            <div className="col-6">
                                <div className="d-flex justify-content-end pt-1 pb-2">
                                    <button className="btn btn-sm btn-primary f-11 pl-2 pr-2" onClick={onSave}>
                                        <i className="fa fa-save mr-1"></i>Save Account</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}