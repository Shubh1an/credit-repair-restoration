import axios, { CancelTokenSource } from 'axios';
import React, { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import toastr from 'toastr';
import { connect } from 'react-redux';

import { IScoringRound } from '../../../../../../models/interfaces/customer-view';
import { ButtonComponent } from '../../../../../../shared/components/button';
import { updateRound } from '../../../../../../actions/customers.actions';
import { Messages } from '../../../../../../shared/constants';
import AuthService from '../../../../../../core/services/auth.service';

const matDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        updateRound
    }, dispatch);
}
export const EditRoundsComponent = connect(null, matDispatchToProps)((props: any) => {

    const [editRound, setEditRound] = useState({} as IScoringRound);
    const [isLoading, setIsLoading] = useState(false);
    const [axiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);
    const [showDerogatory] = useState((!AuthService.isFieldHidden(props.AuthRules, 'HideRoundDerogatory') && !AuthService.isFieldReadOnly(props.AuthRules, 'HideRoundDerogatory')));
    const [showInquiry] = useState((!AuthService.isFieldHidden(props.AuthRules, 'HideRoundInquiry') && !AuthService.isFieldReadOnly(props.AuthRules, 'HideRoundInquiry')));
    const [showSlowLate] = useState((!AuthService.isFieldHidden(props.AuthRules, 'HideRoundSlowLate') && !AuthService.isFieldReadOnly(props.AuthRules, 'HideRoundSlowLate')));

    useEffect(() => {
        if (props?.round)
            setEditRound(props?.round);
        return () => {
            if (axiosSource.cancel) {
                axiosSource.cancel(Messages.APIAborted);
            }
        }
    }, [props?.round]);
    const isEnabled = () => {
        return !!(editRound?.equifaxScore && editRound?.experianScore && editRound?.transUnionScore);
    }
    const onSave = () => {
        setIsLoading(true);
        props?.updateRound(editRound, axiosSource)
            .then((result: any) => {
                setIsLoading(false);
                toastr.success('Round Updated successfully!');
                props?.onSave();
                props?.onClose();
            })
            .catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setIsLoading(false);
                    toastr.error(err?.response?.data);
                }
            })
    }
    const handleChange = (e: any) => {
        setEditRound({
            ...editRound,
            [e.target.name]: e.target.value
        });
    }
    return (
        <div className="edit-round">
            <span className="f-11">You may edit the data of the round here;
                however, changes made on this page have no effect on the status of the round, or number of days left in each round.</span>

            <div className="row mt-3">
                <div className="col-12 col-sm-4 form-group">
                    <label className='text-orange-red'>Equifax Score*</label>
                    <div className="input-group">
                        <input type="number" name="equifaxScore" value={editRound?.equifaxScore || ''} onChange={handleChange} className="form-control input-sm" />
                    </div>
                </div>
                <div className="col-12 col-sm-4 form-group">
                    <label className='text-orange-red'>Experian Score*</label>
                    <div className="input-group">
                        <input type="number" name="experianScore" value={editRound?.experianScore || ''} onChange={handleChange} className="form-control input-sm" />
                    </div>
                </div>
                <div className="col-12 col-sm-4 form-group">
                    <label className='text-orange-red'>TransUnion Score*</label>
                    <div className="input-group ">
                        <input type="number" name="transUnionScore" value={editRound?.transUnionScore || ''} onChange={handleChange} className="form-control input-sm" />
                    </div>
                </div>
                {
                    showDerogatory &&
                    <>
                        <div className="col-12 col-sm-4 form-group">
                            <label>Number of Derogatory Accounts:</label>
                            <div className="input-group">
                                <input type="number" name="derogatories" value={editRound?.derogatories || ''} onChange={handleChange} className="form-control input-sm" />
                            </div>
                        </div>
                    </>
                }
                {
                    showInquiry &&
                    <>
                        <div className="col-12 col-sm-4 form-group">
                            <label>Number of Inquiries:</label>
                            <div className="input-group">
                                <input type="number" name="inquiries" value={editRound?.inquiries || ''} onChange={handleChange} className="form-control input-sm" />
                            </div>
                        </div>
                    </>
                }
                {
                    showSlowLate &&
                    <>
                        <div className="col-12 col-sm-4 form-group">
                            <label>Number of Slow/Late Pays:</label>
                            <div className="input-group">
                                <input type="number" name="slowPays" value={editRound?.slowPays || ''} onChange={handleChange} className="form-control input-sm" />
                            </div>
                        </div>
                    </>
                }
            </div>
            <div className="row mb-2 mt-3">
                <div className="col-4 text-right"></div>
                <div className="col-12 col-sm-4 text-right">
                    <ButtonComponent text={"Close"} className="btn-secondary" onClick={props?.onClose} >
                        <i className="fa fa-times mr-2"></i>
                    </ButtonComponent>
                    <ButtonComponent text={"Save Changes"} className="btn-primary ml-4" disabled={!isEnabled()} loading={isLoading} onClick={onSave} >
                        <i className="fa fa-floppy-o mr-2"></i>
                    </ButtonComponent>
                </div>
            </div>
        </div>
    )
})