import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import axios, { CancelTokenSource } from 'axios';
import ReactTooltip from 'react-tooltip';
import { bindActionCreators } from 'redux';
import toastr from 'toastr';
import classnames from 'classnames';
// @ts-ignore
import confirm from 'reactstrap-confirm';

import { IScoringRound } from '../../../../../../models/interfaces/customer-view';
import { Checkbox } from '../../../../../../shared/components/checkbox';
import { RadioCheckboxList } from '../../../../../../shared/components/radio-checkbox-list';
import { Alignment, EnumBureausShorts, EnumScreens } from '../../../../../../models/enums';
import { ModalComponent } from '../../../../../../shared/components/modal';
import { EditRoundsComponent } from './edit-rounds';
import { ButtonComponent } from '../../../../../../shared/components/button';
import { Messages } from '../../../../../../shared/constants';
import { submitRounds, startRound, deleteRound } from '../../../../../../actions/customers.actions';
import { CommonUtils } from '../../../../../../utils/common-utils';
import AuthService from '../../../../../../core/services/auth.service';
import { BureauLogoComponent } from '../../../../../../shared/components/bureau-logo';

const mapStateToProps = (state: any) => {
    return {
        adminSettings: state?.customerViewModel?.adminSettings,
        AuthRules: AuthService.getScreenOject(state.sharedModel?.AuthRules, EnumScreens.CustomerDetails)
    }
}
const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        submitRounds,
        startRound,
        deleteRound
    }, dispatch);
}
export const RoundsComponent = connect(mapStateToProps, mapDispatchToProps)((props: any) => {

    const [customer, setCustomer] = useState(null as any);
    const [actionType, setActionType] = useState(1);
    const [startRow, setStartRow]: [any, any] = useState({} as IScoringRound);
    const [updateRound, setUpdateRound]: [any, any] = useState({} as IScoringRound);
    const [notify, setNotify] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isStartLoading, setIsStartLoading] = useState(false);
    const [disableEndCurrentRound, setDisableEndCurrentRound] = useState(false);
    const [dueDaysText, setDueDaysText] = useState('' as any);
    const [axiosSource, setAxiosSource] = useState({} as CancelTokenSource);
    const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
    const [showDerogatory] = useState(!(!AuthService.isFieldHidden(props.AuthRules, 'HideRoundDerogatory') && !AuthService.isFieldReadOnly(props.AuthRules, 'HideRoundDerogatory')));
    const [showInquiry] = useState(!(!AuthService.isFieldHidden(props.AuthRules, 'HideRoundInquiry') && !AuthService.isFieldReadOnly(props.AuthRules, 'HideRoundInquiry')));
    const [showSlowLate] = useState(!(!AuthService.isFieldHidden(props.AuthRules, 'HideRoundSlowLate') && !AuthService.isFieldReadOnly(props.AuthRules, 'HideRoundSlowLate')));

    const startRowHandle = (name: string, value: string) => {
        setStartRow({
            ...startRow,
            [name]: value
        });
    };
    useEffect(() => {
        if (props?.customer) {
            setDisableEndCurrentRound(false);
            setStartDate(moment().format("YYYY-MM-DD"));
            setActionType(1);
            setNotify(false);
            setCustomer({
                ...props?.customer
            });
            const row = props?.customer?.scoringRounds?.find((x: IScoringRound) => getEditRow(x, x.statusName));
            setStartRow(row);
            setDueDaysText(getDueDays());
        }
        return () => {
            if (axiosSource?.cancel) {
                axiosSource.cancel(Messages.APIAborted);
            }
        }
    }, [props?.customer])

    const onEdit = (round: IScoringRound) => {
        setShowModal(true);
        setUpdateRound(round);
    }

    const onDelete = async (round: IScoringRound) => {
        let result = await confirm({
            title: 'Remove round',
            message: "Are you sure you want to remove this round?",
            confirmText: "YES",
            confirmColor: "danger",
            cancelColor: "link text-secondary"
        });
        if (result) {
             setIsLoading(true);
             props?.deleteRound(round?.id, axiosSource)
                .then((result: any) => {
                    setIsLoading(false);
                    toastr.success('round removed successfully!!');
                    props?.onReloadCustomer();
                })
                .catch((err: any) => {
                    if (!axios.isCancel(err)) {
                        setIsLoading(false);
                        toastr.error(err?.response?.data || Messages.GenericError);
                    }
                })
        }
    }
    const getEditRow = (round: IScoringRound, statusName: string): boolean => {
        switch (statusName) {
            case 'New File':
                return true;
            case 'Cancelled':
            case 'On Hold':
            case 'CM Hold':
            case 'Problem':
            case 'Completed':
            case 'NSF':
            case 'Alert':
                return !round.isClosed;
            default:
                switch (customer?.transactionType) {
                    case 'Cancelled':
                    case 'Problem':
                    case 'NSF':
                    case 'On Hold':
                    case 'CM Hold':
                    case 'Completed':
                        {
                            return getEditRow(round, customer?.transactionType);
                        }
                    default:
                        return false;
                }
        }
        return false;
    }
    const getRow = (round: IScoringRound, statusName: string, sno: number): any => {
        switch (statusName) {
            case 'Complete':
                return (<tr className={classnames({ 'table-warning current-round': sno === customer?.scoringRounds?.length })}>
                    <td >{sno} </td>
                    <td >{round?.equifaxScore}</td>
                    <td >{round?.experianScore}</td>
                    <td >{round?.transUnionScore}</td>
                    {showDerogatory && <td >{round?.derogatories}</td>}
                    {showInquiry && <td >{round?.inquiries}</td>}
                    {showSlowLate && <td >{round?.slowPays}</td>}
                    <td >{CommonUtils.getDate(round?.closeDate)}</td>
                    <td >-</td>
                    <td ><span className={"status " + round?.statusName?.toLowerCase()}>{round?.statusName}</span></td>
                    <td >{CommonUtils.getDate(round?.roundEndDate)}</td>
                    <td className="table-controls">
                        {
                            (!AuthService.isFieldHidden(props.AuthRules, 'EditRound')
                                && !AuthService.isFieldReadOnly(props.AuthRules, 'EditRound')) &&
                                <div className='text-center position-relative d-flex align-items-center'>
                                <i className="fa fa-pencil ml-2 pointer" title="edit" onClick={() => onEdit(round)}></i>
                                {sno !== 1 && 
                                    <i className="fa fa-trash text-danger f-15 ml-2 pointer" onClick={() => onDelete(round)} title="remove"></i>
                                }
                                
                                </div>
                        }
                    </td>
                </tr>);
            case 'New File':
                return EditRow(round, '', sno);
            case 'Cancelled':
            case 'On Hold':
            case 'CM Hold':
            case 'Problem':
            case 'Completed':
            case 'Pull':
            case 'NSF':
                if (round.isClosed) {
                    return (<tr className={classnames({ 'table-warning': sno === customer?.scoringRounds?.length })}>
                        <td >{sno} </td>
                        <td >{round?.equifaxScore}</td>
                        <td >{round?.experianScore}</td>
                        <td >{round?.transUnionScore}</td>
                        {showDerogatory && <td >{round?.derogatories}</td>}
                        {showInquiry && <td >{round?.inquiries}</td>}
                        {showSlowLate && <td ></td>}
                        <td >{CommonUtils.getDate((round?.closeDate))}</td>
                        <td >{round?.daysToClose}</td>
                        <td >
                            <span className={"status " + customer?.transactionType?.toLowerCase()}>{customer?.statusName === 'Waiting' ? 'Waiting' : customer?.transactionType}</span>
                        </td>
                        <td >{CommonUtils.getDate((round?.roundEndDate))}</td>
                        <td className="table-controls">
                            {
                                (!AuthService.isFieldHidden(props.AuthRules, 'EditRound')
                                    && !AuthService.isFieldReadOnly(props.AuthRules, 'EditRound')) &&
                                    <div className='text-center position-relative d-flex align-items-center'>
                                    <i className="fa fa-pencil ml-2 pointer" title="edit" onClick={() => onEdit(round)}></i>
                                    {sno !== 1 &&
                                        <i className="fa fa-trash text-danger f-15 ml-2 pointer" onClick={() => onDelete(round)} title="remove"></i>
                                    }
                                    </div>
                            }
                        </td>
                    </tr>);
                } else {
                    return EditRow(round, statusName, sno);
                }
            case 'Alert':
                if (round.isClosed) {
                    return (<tr className={classnames({ 'table-warning current-round': sno === customer?.scoringRounds?.length })}>
                        <td >{sno} </td>
                        <td >{round?.equifaxScore}</td>
                        <td >{round?.experianScore}</td>
                        <td >{round?.transUnionScore}</td>
                        {showDerogatory && <td >{round?.derogatories}</td>}
                        {showInquiry && <td >{round?.inquiries}</td>}
                        {showSlowLate && <td ></td>}
                        <td >{CommonUtils.getDate((round?.closeDate))}</td>
                        <td >{round?.daysToClose}</td>
                        <td ><span className={"status " + 'Alert'}>Alert</span></td>
                        <td >{CommonUtils.getDate((round?.roundEndDate))}</td>
                        <td className="table-controls">
                            {
                                (!AuthService.isFieldHidden(props.AuthRules, 'EditRound')
                                    && !AuthService.isFieldReadOnly(props.AuthRules, 'EditRound')) &&
                                    <div className='text-center position-relative d-flex align-items-center'>
                                    <i className="fa fa-pencil ml-2 pointer" title="edit" onClick={() => onEdit(round)}></i>
                                    {sno !== 1 &&
                                        <i className="fa fa-trash text-danger f-15 ml-2 pointer" onClick={() => onDelete(round)} title="remove"></i>
                                    }
                                    </div>
                            }
                        </td>
                    </tr>);
                } else {
                    return EditRow(round, statusName, sno);
                }
            case 'Waiting':
                return (<tr className={classnames({ 'table-warning current-round': sno === customer?.scoringRounds?.length })}>
                    <td >{sno} </td>
                    <td >{round?.equifaxScore}</td>
                    <td >{round?.experianScore}</td>
                    <td >{round?.transUnionScore}</td>
                    {showDerogatory && <td >{round?.derogatories}</td>}
                    {showInquiry && <td >{round?.inquiries}</td>}
                    {showSlowLate && <td ></td>}
                    <td >{CommonUtils.getDate((round?.closeDate))}</td>
                    <td >{round?.daysToClose}</td>
                    <td >
                        <span className={round?.isClosed ? "status " + getWaitingStatus(round)?.toLowerCase() : "status " + round?.statusName?.toLowerCase()}>
                            {round?.isClosed ? getWaitingStatus(round) : round?.statusName}
                        </span>
                    </td>
                    <td ></td>
                    <td className="table-controls">
                        {
                            (!AuthService.isFieldHidden(props.AuthRules, 'EditRound')
                                && !AuthService.isFieldReadOnly(props.AuthRules, 'EditRound')) &&
                                <div className='text-center position-relative d-flex align-items-center'>
                                <i className="fa fa-pencil ml-2 pointer" title="edit" onClick={() => onEdit(round)}></i>
                                {sno !== 1 &&
                                    <i className="fa fa-trash text-danger f-15 ml-2 pointer" onClick={() => onDelete(round)} title="remove"></i>
                                }
                                </div>
                        }
                    </td>
                </tr>);
            default:
                switch (customer?.transactionType) {
                    case 'Cancelled':
                    case 'Problem':
                    case 'NSF':
                    case 'On Hold':
                    case 'CM Hold':
                    case 'Completed':
                        {
                            return getRow(round, customer?.transactionType, sno);
                        }
                }
        }
    }
    const getWaitingStatus = (round: IScoringRound): string => {
        switch (customer?.transactionType) {
            case 'Active':
                return 'Waiting';
            case 'Problem':
                return 'Alert';
            case 'Completed':
                return 'Complete';
            default:
                return customer?.transactionType;
        }
    }
    const EditRow = (round: IScoringRound, statusName: string, sno: number) => {
        return (
            <tr className={classnames({ 'table-warning current-round': sno === customer?.scoringRounds?.length })}>
                <td>
                    {sno} </td>
                <td>
                    <input type="number" className="form-control input-sm  text-center" name="equifaxScore" onChange={(e) => startRowHandle(e.target.name, e.target.value)} value={startRow?.equifaxScore} />
                </td>
                <td>
                    <input type="number" className="form-control input-sm text-center" name="experianScore" onChange={(e) => startRowHandle(e.target.name, e.target.value)} value={startRow?.experianScore} />
                </td>
                <td>
                    <input type="number" className="form-control input-sm text-center" name="transUnionScore" onChange={(e) => startRowHandle(e.target.name, e.target.value)} value={startRow?.transUnionScore} />
                </td>
                {
                    showDerogatory && <td>
                        <input type="number" className="form-control input-sm text-center" name="derogatories" onChange={(e) => startRowHandle(e.target.name, e.target.value)} value={startRow?.derogatories} />
                    </td>
                }
                {
                    showInquiry && <td>
                        <input type="number" className="form-control input-sm text-center" name="inquiries" onChange={(e) => startRowHandle(e.target.name, e.target.value)} value={startRow?.inquiries} />
                    </td>
                }
                {
                    showSlowLate && <td>
                        <input type="number" className="form-control input-sm text-center" name="slowPays" onChange={(e) => startRowHandle(e.target.name, e.target.value)} value={startRow?.slowPays} />
                    </td>
                }
                <td className="text-center text-danger font-weight-bold" >{statusName}</td>
                <td></td>
                <td colSpan={3} className="table-controls text-right p-0">
                    {
                        !AuthService.isFieldHidden(props.AuthRules, 'StartRound') &&
                        <ButtonComponent disabled={AuthService.isFieldReadOnly(props.AuthRules, 'StartRound')} text={"Start Round"} className="btn-primary" loading={isStartLoading} onClick={() => onStartRound(sno)} >
                            <i className="fa fa-arrow-right mr-2"></i>
                        </ButtonComponent>
                    }
                </td>
            </tr>
        );
    }
    const onUpdateRound = () => {
        props?.onReloadCustomer();
    }
    const getDueDays = (): any => {
        let str = 'Days OverDue: ';
        if (customer?.scoringRounds?.length && customer?.scoringRounds[0]?.statusName === 'Waiting') {
            str += ' 0';
        }
        if (props?.previousRound) {
            const endDate = moment(props?.previousRound?.roundEndDate).format('MM/DD/YYYY');
            if (endDate === '01/01/0001') {
                str += '0';
            } else {
                const today = moment();
                const daysToPull = today.diff(endDate, 'days');
                str += daysToPull;
            }
        }
        const lastRoundStartDate = props?.customer?.scoringRounds?.length ? CommonUtils.getDate(props?.customer?.scoringRounds[0]?.closeDate) : '';
        if (lastRoundStartDate === moment().format("MM/DD/YYYY")) {
            setDisableEndCurrentRound(true);
            setActionType(2);
            return <div className="f-14 text-danger d-flex text-left"><i className='fa mt-1 fa-info-circle mr-1'></i>You cannot end the current round when the current round started today. Must allow at least 1 day for round to be ended</div>;
        }
        return str;
    }
    const onSubmit = () => {
        if (!startDate) {
            toastr.warning(actionType === 1 ? 'Please select round start date.' : 'Please select round restart date.');
            return;
        }
        setIsLoading(true);
        props?.submitRounds({
            customerId: customer?.id,
            currentRoundId: customer?.scoringRounds?.find((x: IScoringRound) => !x.isComplete)?.id || '69696969-0000-0000-0000-000000000000',
            startDate: moment(startDate).format("MM/DD/YYYY"),
            currentRound: actionType === 1,
            notifyEmail: notify,
            restartCurrentRound: actionType === 2,
            restartDate: moment(startDate).format("MM/DD/YYYY")
        }, axiosSource)
            .then((result: any) => {
                setIsLoading(false);
                toastr.success(actionType === 1 ? 'Round Submitted successfully!' : 'Round Re-Started successfully!');
                props?.onReloadCustomer();
                setActionType(1);
                setStartDate(moment().format("YYYY-MM-DD"));
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setIsLoading(false);
                    toastr.error(err?.response?.data);
                }
            })
    }
    const onStartRound = (roundIndex: number) => {
        if (!startRow?.equifaxScore || !startRow?.experianScore || !startRow?.transUnionScore) {
            toastr.warning('Please fill all the fields.');
            return;
        }
        setIsStartLoading(true);
        const RoundDetails = startRow?.id + '@' + 'Complete' + "@" + startRow?.equifaxScore + "@" + startRow?.experianScore + "@" + startRow?.transUnionScore + "@" + startRow?.derogatories + "@" + startRow?.inquiries + "@" + startRow?.slowPays + "@" + roundIndex + "@" + customer?.id;
        props?.startRound(RoundDetails, axiosSource)
            .then((result: any) => {
                setIsStartLoading(false);
                toastr.success('Round Started successfully!');
                props?.onReloadCustomer();
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setIsStartLoading(false);
                    toastr.error(err?.response?.data);
                }
            })
    }
    return (
        <div className="rounds">
            <div className="row">
                <div className="col-12 pl-1 pr-1">
                    <div className="table-responsive list-scrollable custom-scrollbar" style={{ height: '200px' }}>
                        <table className="dataTableCustomers table table-striped table-hover">
                            <thead className="back_table_color">
                                <tr className="secondary">
                                    <th style={{ width: '6%' }}>Round</th>
                                    <th style={{ width: '12%' }}>
                                        <BureauLogoComponent type={EnumBureausShorts.EQF} size={'sm'} />
                                    </th>
                                    <th style={{ width: '12%' }}>
                                        <BureauLogoComponent type={EnumBureausShorts.EXP} size={'sm'} />
                                    </th>
                                    <th style={{ width: '12%' }}>
                                        <BureauLogoComponent type={EnumBureausShorts.TU} size={'sm'} />
                                    </th>
                                    {showDerogatory && <th style={{ width: '9%' }}>Derogatories</th>}
                                    {showInquiry && <th style={{ width: '9%' }}>Inquiries</th>}
                                    {showSlowLate && <th style={{ width: '9%' }}>Late/Slow</th>}
                                    <th style={{ width: showDerogatory ? '6%' : '15%' }}>Start Date</th>
                                    <th style={{ width: showInquiry ? '6%' : '15%' }}>Counter</th>
                                    <th style={{ width: showSlowLate ? '6%' : '15%' }}>Status</th>
                                    <th style={{ width: '9%' }}>End Date</th>
                                    <th style={{ width: '4%' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    customer?.scoringRounds?.map((round: IScoringRound, index: number) => {
                                        return (
                                            <Fragment key={index}>
                                                {
                                                    getRow(round, round.statusName, customer?.scoringRounds?.length - index)
                                                }
                                            </Fragment>
                                        );
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {
                !props?.adminSettings?.hideTargetScore &&
                <div className="row mt-2">
                    <div className="col-3">
                        <div className="form-group">
                            <label>Target Score :</label>
                            <input type="number" className="form-control" readOnly={true} disabled={true} value={customer?.targetScore} />
                        </div>
                    </div>
                </div>
            }
            {startRow?.statusName !== 'New File' && !AuthService.isFieldHidden(props.AuthRules, 'SubmitRound') &&
                <>
                    <div className="row mb-2 mt-4">
                        <div className="col-12 col-sm-3">
                            <h6 className="d-flex align-items-center">Round Options:
                                <i data-tip="React-tooltip" className="fa fa-question-circle ml-2 pointer days-overdue"></i>
                                <ReactTooltip place="right" type="dark" effect="float" >
                                    <div className="text-left">
                                        You can choose to end the current round and start a new round.<br />
                                        This will end the current round today, and start a new round today.<br />
                                        If you need to restart the current round date,<br />
                                        you are allowed to choose and date from the previous round end date <br />
                                        up until todays date to restart the current round.
                                    </div>
                                </ReactTooltip>
                            </h6>
                        </div>
                    </div>
                    <div className="row mt-1">
                        <div className="col-12 col-sm-7">
                            <RadioCheckboxList selectedValue={actionType} alignment={Alignment.Horizontal}
                                list={[{ text: 'Start New Round', value: 1, disabled: disableEndCurrentRound }, { text: 'Restart Current Round', value: 2 }]}
                                groupName="round-action" onChange={(data: any) => setActionType(data?.value)} />
                        </div>
                        <div className="col-12 col-sm-5 text-left text-sm-right">
                            <h6 className="days-overdue">
                                {
                                    dueDaysText
                                }

                            </h6>
                        </div>
                    </div>
                    <div className="row mt-3 mt-sm-0">
                        <div className="col-12 d-flex flex-column flex-sm-row align-items-start align-items-sm-center">
                            <div className="form-group" >
                                <label>{actionType === 1 ? 'Round Start' : 'Round Re-Start'} Date:</label>
                                <input type="date" onChange={e => setStartDate(e.target.value)} value={moment(startDate || '').format('YYYY-MM-DD')} className="form-control input-sm" />
                            </div>
                            {
                                actionType === 1 &&
                                <div className="form-group ml-sm-3 w-100 w-sm-auto">
                                    <label className="d-none d-sm-block">&nbsp;</label>
                                    <div className="form-control border-0 shadow-none pl-0">
                                        <Checkbox text="Notify Client/Agent" checked={notify} onChange={(data: any) => setNotify(data?.checked)} />
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-12 col-sm-5">
                            <ButtonComponent disabled={AuthService.isFieldReadOnly(props.AuthRules, 'SubmitRound')} text={"Submit"} className="btn-primary w-100 w-sm-auto" loading={isLoading} onClick={onSubmit} >
                                <i className="fa fa-floppy-o mr-2"></i>
                            </ButtonComponent>
                        </div>
                    </div>

                </>
            }
            <ModalComponent title={'Edit Round'} isVisible={showModal} onClose={() => setShowModal(false)}>
                <EditRoundsComponent round={updateRound} onSave={onUpdateRound} onClose={() => setShowModal(false)} />
            </ModalComponent>
        </div>
    );
});