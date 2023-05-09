import axios, { CancelTokenSource } from 'axios';
import moment from 'moment';
import React, { useState } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import toastr from 'toastr';

import { addNewRound } from '../../../../../../actions/customers.actions';
import { IRoundAddModel } from '../../../../../../models/interfaces/shared';
import { ButtonComponent } from '../../../../../../shared/components/button';
import { Messages } from '../../../../../../shared/constants';


const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        addNewRound
    }, dispatch);
}

export const AddRoundComponent = connect(null, mapDispatchToProps)((props:
    { onSave: any, cid: string, addNewRound: any }) => {

    const [changes, setChanges] = useState(null as IRoundAddModel | null);
    const [isSaving, setIsSaving] = useState(false);
    const [axiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);

    const handleChanges = (e: any) => {
        const { name, value } = e.target;
        setChanges({
            ...changes,
            [name]: value
        });
    }
    const getDateForPicker = (d?: string): string => {
        if (!d) { return ''; };
        const dd = moment(d).format("YYYY-MM-DD");
        return (dd !== '0001-01-01' && dd !== '1900-01-01') ? dd : '';
    }

    const isEnabled = () => {
        return !!(changes?.tuScore && changes?.expScore && changes?.eqfScore && changes?.startDate);
    }
    const onSave = () => {
        setIsSaving(true);
        props?.addNewRound(changes, props?.cid, axiosSource)
            .then((result: string) => {
                toastr.success(result);
                setIsSaving(false);
                props?.onSave(true);
            }).catch((e: any) => {
                if (!axios.isCancel(e)) {
                    setIsSaving(false);
                    toastr.error(Messages.GenericError);
                }
            })
    }
    return (
        <div className='round-data  mt-3'>
            <div className='row'>
                <div className='col-3 d-none d-sm-block'></div>
                <div className="col-12 col-sm-6  text-right">
                    <div className="form-group form-inline">
                        <label style={{ minWidth: '100px' }} className='mr-2 mr-sm-0 text-orange-red'>TU Score*</label>
                        <div className="input-group flex-1">
                            <input name='tuScore' type="number" value={changes?.tuScore ?? ''}
                                onChange={handleChanges} className="form-control" />
                        </div>
                    </div>
                </div></div>
            <div className='row'>
                <div className='col-3 d-none d-sm-block'></div>
                <div className="col-12 col-sm-6  text-right">
                    <div className="form-group form-inline">
                        <label style={{ minWidth: '100px' }} className='mr-2 mr-sm-0 text-orange-red'>EXP Score*</label>
                        <div className="input-group flex-1">
                            <input name='expScore' type="number" value={changes?.expScore ?? ''}
                                onChange={handleChanges} className="form-control" />
                        </div>
                    </div>
                </div></div>
            <div className='row'>
                <div className='col-3 d-none d-sm-block'></div>
                <div className="col-12 col-sm-6  text-right">
                    <div className="form-group form-inline">
                        <label style={{ minWidth: '100px' }} className='mr-2 mr-sm-0 text-orange-red'>EQF Score*</label>
                        <div className="input-group flex-1">
                            <input name='eqfScore' type="number" value={changes?.eqfScore ?? ''}
                                onChange={handleChanges} className="form-control" />
                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-3 d-none d-sm-block'></div>
                <div className="col-12 col-sm-6  text-right">
                    <div className="form-group form-inline">
                        <label style={{ minWidth: '100px' }} className='mr-2 mr-sm-0 text-orange-red'>Start Date*</label>
                        <div className="input-group flex-1">
                            <input name='startDate' type="date" max={moment().format('YYYY-MM-DD')} value={getDateForPicker(changes?.startDate) ?? ''}
                                onChange={handleChanges} className="form-control" />
                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-3 d-none d-sm-block'></div>
                <div className="col-12 col-sm-6  text-right">
                    <div className="form-group form-inline">
                        <label style={{ minWidth: '100px' }} className='mr-2 mr-sm-0'>End Date</label>
                        <div className="input-group flex-1">
                            <input name='endDate' type="date" value={getDateForPicker(changes?.endDate) ?? ''}
                                onChange={handleChanges} className="form-control" />
                        </div>
                    </div>
                </div>
            </div>
            <div className='row mt-4 mb-2'>
                <div className='col-6 d-none d-sm-block'></div>

                <div className='col-12 col-sm-3 text-right'>
                    <ButtonComponent text="Add Round" disabled={!isEnabled()} loading={isSaving} className=" btn-primary w-100 ml-sm-2 mt-1 mt-sm-0" onClick={onSave} >
                        <i className="fa fa-floppy-o mr-2"></i>
                    </ButtonComponent>
                </div>
            </div>
        </div>
    )
});

