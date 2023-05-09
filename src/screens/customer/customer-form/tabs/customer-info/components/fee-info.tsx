import axios, { CancelTokenSource } from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Spinner } from 'reactstrap';
import { bindActionCreators } from 'redux';
import toastr from 'toastr';

import { saveFeeDetails } from '../../../../../../actions/customers.actions';
import { ButtonComponent } from '../../../../../../shared/components/button';
import { Messages } from '../../../../../../shared/constants';

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        saveFeeDetails
    }, dispatch);
}
export const FeeInfoComponent = connect(null, mapDispatchToProps)((props: { customer: any, saveFeeDetails: any, isReadOnly: boolean }) => {

    const [fee, setFee] = useState('');
    const [mfee, setMFee] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [axiosSource, setAxiosSource] = useState({} as CancelTokenSource);

    useEffect(() => {
        setFee(props?.customer?.setupFee);
        setMFee(props?.customer?.monthlyFee);
        setDueDate(props?.customer?.monthlyDueDate);
        setAxiosSource(axios?.CancelToken?.source());
    }, [props?.customer]);

    const onSave = () => {
        setIsSaving(true);
        props?.saveFeeDetails(props?.customer?.id, fee, mfee, dueDate, axiosSource)
            .then((result: any) => {
                setIsSaving(false);
                if (result) {
                    toastr.success(`Fee Info details saved successfully!`);
                } else {
                    toastr.error(Messages.GenericError);
                }
            })
            .catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setIsSaving(false);
                    toastr.error(Messages.GenericError);
                }
            })
    }
    return (
        <div>
            <div className="row">
                <div className="col-12">
                    <div className="form-group mb-0">
                        <label>Setup Fee</label>
                        <input disabled={props?.isReadOnly} name='setupFee' onChange={e => setFee(e.target.value)} value={fee || ''} className="form-control" type="number" required={true} />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="form-group mb-0">
                        <label>Monthly Fee</label>
                        <input disabled={props?.isReadOnly} name='monthlyFee' onChange={e => setMFee(e.target.value)} value={mfee || ''} className="form-control" type="number" required={true} />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="form-group mb-0">
                        <label>Monthly Due Date</label>
                        <input disabled={props?.isReadOnly} name='monthlyDueDate' onChange={e => setDueDate(e.target.value)} value={dueDate} className="form-control" placeholder="day of the month" type="text" required={true} />
                    </div>
                </div>
            </div>
            {  !props?.isReadOnly &&
                <div className="row pt-3">
                    <div className="col-12 text-right">
                        <ButtonComponent text="Save" className="btn-primary" loading={isSaving} onClick={onSave} />
                    </div>
                </div>
            }
        </div>
    );
});