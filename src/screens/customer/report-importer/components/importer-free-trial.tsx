import axios, { CancelTokenSource } from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// @ts-ignore
import confirm from 'reactstrap-confirm';

import { GetFreeTrialCredit } from '../../../../actions/importer.actions';

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        GetFreeTrialCredit
    }, dispatch);
}


export const ImporterFreeTrial = connect(null, mapDispatchToProps)((props: any) => {

    const [loading, setLoading] = useState(false);
    const [credits, setCredits] = useState(null as number | null);
    const [axiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);

    useEffect(() => {
        GetFreeTrialCredit();

    }, [props?.cid]);

    const GetFreeTrialCredit = () => {
        setLoading(true);
        props?.GetFreeTrialCredit(axiosSource).then((result: any) => {
            setLoading(false);
            setCredits(result);
            if (result) {

            } else {

            }
        }).catch((err: any) => {
            if (!axios.isCancel(err)) {
                setLoading(false);
            }
        })
    }
    const showAlertMessage = async (message: string, title: string | null) => {
        await confirm({
            title,
            message,
            confirmText: "OK",
            confirmColor: "primary",
            cancelText: null
        });
    }
    return (
        <div className="row">
            <div className="col-12">

            </div>
        </div>
    );
});
