import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import axios, { CancelTokenSource } from 'axios';
import moment from 'moment';


import { ModalComponent } from '../../../../shared/components/modal';
import { ChangeAddressComponent } from '../../../../shared/components/change-address';
import { IAccountdetails, ICollectorAddress } from '../../../../models/interfaces/fast-edit-accounts';
import { Checkbox } from '../../../../shared/components/checkbox';
import { updateYellowAccount } from '../../../../actions/fast-edit.actions';
import { LargeSpinner } from '../../../../shared/components/large-spinner';

interface IInputModel {
    accountDetails: IAccountdetails;
    collectorAddress?: ICollectorAddress;
    onSave: (param: any) => any;
    isFastTrack?: boolean;
    showFastTrack?: boolean;
    onFastTrackChange?: (param: boolean) => any;
}

export const FEAccountDetails: React.FC<IInputModel> = (props: IInputModel) => {
    const [changeAddressModalClose, setChangeAddressModalClose] = useState(false);
    const [isFastTrack, setIsFastTrack] = useState(props?.isFastTrack);
    const [updating, setUpdating] = useState(false);
    const [showWarning, setShowWarning] = useState(props?.accountDetails?.showLetterWarning);
    const [axiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);

    useEffect(() => {
        setIsFastTrack(props?.isFastTrack);
    }, [props?.isFastTrack]);

    const onFastTrackChange = (checked: boolean) => {
        setIsFastTrack(checked);
        if (props?.onFastTrackChange) {
            props.onFastTrackChange(checked);
        }
    }
    const onRemoveUpdate = () => {
        setUpdating(true);
        updateYellowAccount(props.accountDetails.ccid, axiosSource)
            .then(() => {
                setUpdating(false);
                setShowWarning(false);
            })
            .catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setUpdating(false);
                }
            })
    }
    return (
        <div>
            {
                showWarning &&
                <div className="mt-2 mb-2 p-2 letter-warning w-80 spouse-name d-flex justify-content-between pt-1 align-items-center position-relative">
                    <span className="text-danger f-12 font-weight-bold">
                        Letter not Generated yet.
                    </span>
                    {
                        updating &&
                        <LargeSpinner className="small-spinner" />
                    }
                    <span className="position-relative" >
                        <i title="Account is Updated but Letter not Generated yet." className="fa fa-times pointer" onClick={onRemoveUpdate}></i>
                    </span>
                </div>
            }

            <div className={classnames({ 'mt-2': props?.accountDetails?.showLetterWarning, 'mt-4': !props?.accountDetails?.showLetterWarning })}>
                <label>Round:</label>
                <span className="f-11 pl-1">
                    {
                        props?.accountDetails?.round
                    }
                </span>
            </div>
            {moment(props?.accountDetails?.modifiedOn).format("MM/DD/YYYY") !== '01/01/0001'
                &&
                <div>
                    <label>Modified On:</label>
                    <span className="f-11 pl-1">
                        {

                            moment(props?.accountDetails?.modifiedOn).format("MM/DD/YYYY")
                        }
                    </span>
                </div>
            }
            <div>
                <label>Entered On:</label>
                <span className="f-11 pl-1">
                    {
                        moment(props?.accountDetails?.enteredOn).format("MM/DD/YYYY")
                    }
                </span>
            </div>
            {
                !!props?.accountDetails?.by
                &&
                <div>
                    <label>By:</label>
                    <span className="f-11 pl-1">
                        {
                            props?.accountDetails?.by
                        }
                    </span>
                </div>
            }
            <div className="mt-2">
                <fieldset className="customer-field-set mt-2 f-11">
                    <legend className="f-11">
                        <label>Collector Address: </label>
                    </legend>
                    <div className="row m-0 mb-2">
                        <div className="col-12">
                            <label>Address: </label>
                            <span className="pl-1">{props?.collectorAddress?.address}</span>
                        </div>
                        <div className="col-12">
                            <label>City: </label>
                            <span className="pl-1">{props?.collectorAddress?.city}</span>
                        </div>
                        <div className="col-12">
                            <label>State: </label>
                            <span className="pl-1">{props?.collectorAddress?.state}</span>
                        </div>
                        <div className="col-12">
                            <label>ZipCode: </label>
                            <span className="pl-1">{props?.collectorAddress?.zip}</span>
                        </div>
                        <div className="col-12">
                            <button className="btn btn-link f-11 p-0 mt-1" onClick={() => setChangeAddressModalClose(true)}>
                                <i className="fa fa-edit mr-1"></i> Change</button>
                        </div>
                    </div>
                </fieldset>
                <ModalComponent title={"Creditor/Collector Address"} isVisible={changeAddressModalClose} onClose={() => setChangeAddressModalClose(false)}>
                    <ChangeAddressComponent addressView={props?.collectorAddress}
                        onSave={(e: boolean) => { props?.onSave(e); setChangeAddressModalClose(false); }} onClose={() => setChangeAddressModalClose(false)} />

                </ModalComponent>
            </div>

            {
                props?.showFastTrack &&
                <div className="mt-4 fasttrack-check">
                    <Checkbox text="Is Standard & Fast Track" checked={isFastTrack} onChange={(data: any) => onFastTrackChange && onFastTrackChange(data?.checked)} />
                </div>
            }
        </div>
    );
}