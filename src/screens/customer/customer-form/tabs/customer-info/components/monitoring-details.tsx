import axios, { CancelTokenSource } from 'axios';
import classnames from 'classnames';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import toastr from 'toastr';

import { saveCreditMonitoringDetails } from '../../../../../../actions/customers.actions';
import { IValueTextExtra } from '../../../../../../models/interfaces/shared';
import { ButtonComponent } from '../../../../../../shared/components/button';
import { Messages } from '../../../../../../shared/constants';
import { CommonUtils } from '../../../../../../utils/common-utils';
import { leadMonitoring } from '../../../../../../actions/leads.actions';
import AuthService from '../../../../../../core/services/auth.service';

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        saveCreditMonitoringDetails,
        leadMonitoring
    }, dispatch);
}
export const MonitoringDetailsComponent = connect(null, mapDispatchToProps)((props: {
    isLead?: boolean, isReadOnly: boolean, customer: any,
    saveCreditMonitoringDetails: any,
    leadMonitoring: any
}) => {

    const [monitoringService, setmonitoringService] = useState('');
    const [monitoringUserName, setmonitoringUserName] = useState('');
    const [monitoringPassword, setmonitoringPassword] = useState('');
    const [monitoringSecretWord, setmonitoringSecretWord] = useState('');
    const [reportPullDate, setReportPullDate] = useState('');
    const [monitoringOptions, setMonitoringOptions] = useState(CommonUtils.CreditMOnitoringOptions());
    const [viewPass, setViewPass] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [axiosSource, setAxiosSource] = useState({} as CancelTokenSource);
    const [selectedService, setSelectedService]: [IValueTextExtra, any] = useState(CommonUtils.CreditMOnitoringOptions()[0]);


    useEffect(() => {
        setmonitoringService(props?.customer?.monitoringService || '');
        setmonitoringUserName(props?.customer?.monitoringUserName || '');
        setmonitoringPassword(props?.customer?.monitoringPassword || '');
        setmonitoringSecretWord(props?.customer?.monitoringSecretWord || '');
        setReportPullDate(props?.customer?.reportPullDate || '');
        setSelectedService(monitoringOptions.find(x => x.value === props?.customer?.monitoringService));
        const isOutsourced = AuthService.getCurrentJWTPayload()?.isOutsourced?.toString() === 'true';
        setMonitoringOptions(CommonUtils.CreditMOnitoringOptions()?.filter(x => isOutsourced ? x?.isOutsourced === isOutsourced : true));
    }, [props?.customer]);

    const onSave = () => {
        setIsSaving(true);

        const pullDate = reportPullDate && reportPullDate !== 'Invalid date' ? moment(reportPullDate).format('MM/DD/YYYY')
            : null;

        const promise = !props?.isLead ? props?.saveCreditMonitoringDetails(props?.customer?.id, monitoringService,
            monitoringUserName, monitoringPassword, monitoringSecretWord, pullDate, axiosSource)
            : props?.leadMonitoring({
                creditCustomerQueueId: props?.customer?.id,
                service: monitoringService,
                userName: monitoringUserName,
                password: monitoringPassword,
                secretWord: monitoringSecretWord,
                reportPullDate: pullDate,
            }, axiosSource);

        promise.then((result: any) => {
            setIsSaving(false);
            if (result) {
                toastr.success(`Credit Monitoring details saved successfully!`);
            } else {
                toastr.error(Messages.GenericError);
            }
        })
            .catch((error: any) => {
                if (!axios.isCancel(error)) {
                    setIsSaving(false);
                    toastr.error(Messages.GenericError);
                }
            })
    }
    const setMonitoring = (val: string) => {
        setmonitoringService(val);
        setSelectedService(monitoringOptions.find(x => x.value === val));
    }
    const getPath = () => {
        if (selectedService?.value === 'CreditBliss') {
            let path = CommonUtils.formatString(selectedService?.path, props?.customer?.cbRefreshTok, props?.customer?.email);
            return path;
        }
        else
            return selectedService?.path;
    }
    const getWebName = () => {
        let text = selectedService?.websiteName;
        if (selectedService?.value === 'CreditBliss' && !props?.customer?.cbRefreshTok) {
            text = 'By Pass Login';
        }
        return <span className='text-danger change-button font-weight-bold'>{text}</span>;
    }
    return (
        <div>
            <div className="row">
                <div className="col-12">
                    <div className="form-group mb-0">
                        <label>Monitoring Service:</label>
                        <select disabled={props?.isReadOnly} value={monitoringService || ''} onChange={e => setMonitoring(e.target.value)} name="monitoringService" className="form-control input-sm" required={true}>
                            {
                                monitoringOptions?.map((item, index) => <option key={index} value={item?.value}>{item?.text}</option>)
                            }
                        </select>
                    </div>
                </div>
            </div>
            {selectedService?.path ?
                <div className="row">
                    <div className="col-12 pt-1">
                        <div className="form-group mb-0">
                            <label>CM Link:</label>
                            <div className="d-flex justify-content-between">
                                {
                                    (!props?.customer?.cbRefreshTok && selectedService?.value === 'CreditBliss') ? <div className='text-danger f-11 font-weight-bold'>NO TOKEN EXISTS</div> : null
                                }
                                <a href={getPath()} target="_blank" className="d-flex align-items-center">
                                    {getWebName()}
                                    <i className="fa fa-external-link ml-1" aria-hidden="true"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                : null
            }
            <div className="row">
                <div className="col-12">
                    <div className="form-group mb-0">
                        <label>CM User Name:</label>
                        <input disabled={props?.isReadOnly} className="form-control" name="monitoringUserName" value={monitoringUserName || ''} onChange={e => setmonitoringUserName(e.target.value)} type="text" required={true} />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="form-group mb-0">
                        <label>CM Password:</label>
                        <div className="input-group d-flex align-items-center position-relative">
                            <input disabled={props?.isReadOnly} autoComplete="new-password" value={monitoringPassword || ''}
                                onChange={e => setmonitoringPassword(e.target.value)} name="monitoringPassword" type={viewPass ? 'text' : "password"} className="form-control" placeholder="User Password" required={true} />
                            <i title="Long press to view password" onMouseDown={() => setViewPass(true)} onMouseUp={() => setViewPass(false)}
                                className={classnames("fa  ml-1 pointer view-pass", { 'fa-eye': viewPass, 'fa-eye-slash': !viewPass })} aria-hidden="true"></i>
                        </div>
                    </div>
                </div>
            </div><div className="row">
                <div className="col-12">
                    <div className="form-group mb-0">
                        <label>CM Secret Word:</label>
                        <input disabled={props?.isReadOnly} className="form-control" name='monitoringSecretWord' value={monitoringSecretWord} onChange={e => setmonitoringSecretWord(e.target.value)} type="text" required={true} />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="form-group mb-0">
                        <label>Last Report Date:</label>
                        <input disabled={props?.isReadOnly} className="form-control" name='reportPullDate' onChange={e => setReportPullDate(e.target.value)} value={moment(reportPullDate || '').format('YYYY-MM-DD')} type="date" required={true} />
                    </div>
                </div>
            </div>
            {
                !props?.isReadOnly &&
                <div className="row pt-3">
                    <div className="col-12 text-right">
                        <ButtonComponent text="Save" className="btn-primary" loading={isSaving} onClick={onSave} />
                    </div>
                </div>
            }
        </div>
    );
});