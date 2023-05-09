import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useState } from 'react';
import axios from 'axios';
import toastr from 'toastr';

import { Checkbox } from '../../../../../shared/components/checkbox';
import { ButtonComponent } from '../../../../../shared/components/button';
import { convertToCustomer } from '../../../../../actions/leads.actions';


const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        convertToCustomer
    }, dispatch);
}
export const ConvertToCustomerComponent = connect(null, mapDispatchToProps)(
    (props: { leadId: string, onClose: any, convertToCustomer: any, onConvert?: any }) => {

        const [notifyAgent, setNotifyAgent] = useState(false);
        const [loading, setLoading] = useState(false);
        const [axiosSource] = useState(axios.CancelToken.source());

        const convertToCustomer = () => {
            setLoading(true);
            props?.convertToCustomer(props?.leadId, notifyAgent, axiosSource).
                then((result: string) => {
                    setLoading(false);
                    toastr.success(result);
                    props?.onConvert();
                }).catch((err: any) => {
                    if (!axios.isCancel(err)) {
                        toastr.error(err?.response?.data);
                        setLoading(false);
                    }
                })
        }

        return (
            <>
                <div className="row mt-5 mb-5">
                    <div className="col-12 col-sm-3"></div>
                    <div className="col-12 col-sm-6">
                        <div className="form-group ml-sm-4">
                            <Checkbox text="Notify Affiliate Agent Upon Converting" title="Notify Affiliate Agent Upon Converting"
                                checked={notifyAgent}
                                onChange={(data: any) => setNotifyAgent(data?.checked)} />
                        </div>
                    </div>

                </div>
                <div className="row mb-4">
                    <div className="col-12 col-sm-5"></div>
                    <div className="col-12 col-sm-7">
                        <ButtonComponent text="Cancel" disabled={loading} className="btn-link" onClick={() => props.onClose()} >
                        </ButtonComponent>
                        <ButtonComponent text={loading ? "Converting... Please wait..." : "Convert"} loading={loading} className="btn-primary" onClick={() => convertToCustomer()} >
                            <i className="fa fa-exchange mr-2"></i>
                        </ButtonComponent>
                    </div>
                </div>
            </>
        );
    });