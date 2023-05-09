import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// @ts-ignore
import confirm from 'reactstrap-confirm';
import toastr from 'toastr';
import axios, { CancelTokenSource } from 'axios';
import { Link } from 'react-router-dom';

import { EnumBureausShorts, LetterOptionsConfirm } from '../../../../models/enums';
import { ICCList, ICreatePDFLetterPayload, IRestartRoundPayload, ISendNoticePayload, ISetRoundsPayload, ITempLetterQueue } from '../../../../models/interfaces/create-letter';
import { ButtonComponent } from '../../../../shared/components/button';
import { Checkbox } from '../../../../shared/components/checkbox';
import { ModalComponent } from '../../../../shared/components/modal';
import { CCListComponent } from '../components/CCList';
import { createPDFLetter, regernateNoticeAccountUpdate, restartRound, sendNoticeAccUpdate, setRounds } from '../../../../actions/create-letter.actions';
import { ClientRoutesConstants, Messages } from '../../../../shared/constants';
import { saveActiveTabNumber, reloadTempLetter, reloadDisputeLetters, lettersCreatedSuccessfully } from '../../../../actions/create-letter.actions';
import { BureauLogoComponent } from '../../../../shared/components/bureau-logo';

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        saveActiveTabNumber,
        reloadTempLetter,
        reloadDisputeLetters,
        lettersCreatedSuccessfully
    }, dispatch);
}
const mapStateToProps = (state: any) => {
    return {
        model: state?.createLetterModel
    };
}
export const LetterCreationOptionsComponent: React.FC<any> = connect(mapStateToProps, mapDispatchToProps)((props: any) => {

    const [formData, setFormData] = useState({
        startRound: true,
        createIds: true,
        setRound: true,
        noticeUpdate: true,
        saveAccUpdate: true,
        emailAgent: true,
        tuScore: props?.model?.roundInfo?.score?.tu,
        expScore: props?.model?.roundInfo?.score?.exp,
        eqfScore: props?.model?.roundInfo?.score?.eqf
    } as any);

    const [axiosSource, setAxiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);
    const [openCC, setOpenCC] = useState(false);
    const [loading, setLoading] = useState(false);
    const [restartLoading, setRestartLoading] = useState(false);
    const [roundLoading, setRoundLoading] = useState(false);
    const [noticeLoading, setNoticeLoading] = useState(false);
    const [regNoticeLoading, setRegNoticeLoading] = useState(false);
    const [openNoteHTML, setOpenNoteHTML] = useState(false);
    const [noticeHTML, setNoticeHTML] = useState('' as string);
    const [CC, setCC] = useState(props?.customer?.agent?.email as string);
    const [BCC, setBCC] = useState(props?.customer?.referrer?.email as string);
    const [selectedCCs, setSelectedCCs] = useState([] as ICCList[]);
    const [letterStatuses, setLetterStatuses] = useState('' as string);
    const [openLetterStatus, setOpenLetterStatus] = useState(false);
    const [openEmptyAddressAccounts, setOpenEmptyAddressAccounts] = useState(false);
    const [emptyAddressAccounts, setEmptyAddressAccounts] = useState([]);
    const [emptyCreditorButCRA, setEmptyCreditorButCRA] = useState(false);
    const [ignoreCreditorsAccounts, setIgnoreCreditorsAccounts] = useState(false);

    const memoisedConfirmDialog = useCallback(({ onClose }) => {
        return (
            <>
                <ButtonComponent text="End Current Round/Start New" className="btn-dark mr-2 shadow" onClick={() => { onClose(); createPDFLetters(LetterOptionsConfirm.END_CURRENT); }}  >
                    <i className="fa fa-recycle mr-2"></i>
                </ButtonComponent>
                <ButtonComponent text="Restart Current Round" className="btn-secondary m-4 shadow" onClick={() => { onClose(); createPDFLetters(LetterOptionsConfirm.RESTART); }} >
                    <i className="fa fa-refresh mr-2"></i>
                </ButtonComponent>
                <ButtonComponent text="Update Scores" className="btn-primary shadow" onClick={() => { onClose(); createPDFLetters(LetterOptionsConfirm.UPDATE_SCORES); }}>
                    <i className="fa fa-floppy-o mr-2"></i>
                </ButtonComponent>
            </>
        );
    }, [props, formData, CC, BCC]);

    useEffect(() => {
        setCC(props?.customer?.agent?.email ?? '');
        setBCC(props?.customer?.referrer?.email ?? '');
        setFormData({
            ...formData,
            tuScore: props?.model?.roundInfo?.score?.tu,
            expScore: props?.model?.roundInfo?.score?.exp,
            eqfScore: props?.model?.roundInfo?.score?.eqf
        });
    }, [props?.customer]);

    useEffect(() => {
        if (ignoreCreditorsAccounts) {
            CreateLetteresFinally();
        }
    }, [ignoreCreditorsAccounts])
    const handleChange = (name: string, value: any) => {
        setFormData({
            ...formData,
            [name]: value
        });
    }
    const onLetterCreate = () => {
        if (!props?.model?.tempLetters?.length) {
            toastr.error('No Temp Letters Generated yet, Please Generate First and Try again');
            return;
        }
        const creditorTempLetters = props?.model?.tempLetters?.filter((x: any) => x?.letterType === 'Creditor');
        if (creditorTempLetters?.length && props?.model?.tempLetters?.length === creditorTempLetters?.length) { // only creditors account 
            const creditorsAccountIds = props?.model?.tempLetters?.flatMap((x: any) => x?.accounts)?.map((x: any) => x?.accountId);
            const emptyAddressAccounts = props?.model?.accounts?.filter((x: any) => !!x?.isAddressEmpty && creditorsAccountIds?.includes(x?.id));
            if (emptyAddressAccounts?.length) {
                setOpenEmptyAddressAccounts(true);
                setEmptyAddressAccounts(emptyAddressAccounts);
                return;
            }
        } else if (creditorTempLetters?.length && props?.model?.tempLetters?.length !== creditorTempLetters?.length) { // means creditors + cra
            const creditorsAccountIds = props?.model?.tempLetters?.flatMap((x: any) => x?.accounts)?.map((x: any) => x?.accountId);
            const emptyAddressAccounts = props?.model?.accounts?.filter((x: any) => !!x?.isAddressEmpty && creditorsAccountIds?.includes(x?.id));
            if (emptyAddressAccounts?.length) {
                setEmptyCreditorButCRA(true);
                return;
            }
        }
        CreateLetteresFinally();
    }
    const CreateLetteresFinally = () => {
        if (formData?.startRound) {
            if (formData?.tuScore !== '' && formData?.expScore !== '' && formData?.eqfScore !== '') {
                if (props?.model?.roundInfo?.roundStarted === 'Started') {
                    confirmDialog();
                } else {
                    createPDFLetters(LetterOptionsConfirm.NONE);
                }
            } else {
                toastr.error('You must set the scores.  If no scores enter 0');
            }
        } else {
            createPDFLetters(LetterOptionsConfirm.NONE);
        }
    }
    const confirmDialog = async () => {
        await confirm({
            title: 'Warning - The Round is active',
            message: "Would you like to ?",
            buttonsComponent: memoisedConfirmDialog,
            className: 'custom-confirm-dialog'
        });
    }
    const createPDFLetters = (option: LetterOptionsConfirm) => {
        restartRoundOperation(option);
    }
    const generateLettersFinally = () => {
        let letterPayload = (props?.model?.tempLetters as ITempLetterQueue[])?.map(x => ({
            letterId: x?.disputeLetterId,
            customerId: props?.customer?.id,
            letterContent: (x?.letterContent ?? ''),
            letterName: x.letterName,
            letterType: x.letterType,
            letterSource: x.bureauCreated,
            createWithIds: x.bureauCreated === 'Creditor' ? false : formData?.createIds,
            accountIds: getUniqueIds(x?.accounts?.map(m => m?.accountId) || []),
            tempLetterPreviewId: x?.tempLetterPreviewId
        } as ICreatePDFLetterPayload)) as ICreatePDFLetterPayload[];
        if (ignoreCreditorsAccounts) {
            letterPayload = letterPayload?.filter(x => x?.letterType !== 'Creditor');
        }
        setIgnoreCreditorsAccounts(false);
        setLoading(true);
        createPDFLetter(letterPayload, axiosSource)
            .then((result: any) => {
                setLoading(false);
                setLetterStatuses(result);
                setOpenLetterStatus(true);
                toastr.success(`${letterPayload?.length} letter(s) created successfully!!`);
                props.saveActiveTabNumber(3);
                props?.reloadTempLetter(true);
                props?.reloadDisputeLetters(true);
                props?.lettersCreatedSuccessfully(true);
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setLoading(false);
                    toastr.error(err?.response?.data || Messages.GenericError)
                }
            })
    }
    const restartRoundOperation = (option: LetterOptionsConfirm) => {

        if (formData?.startRound) {
            const payload = ({
                customerId: props?.customer?.id,
                startRound: true,
                operation: option?.toLowerCase()?.toString(),
                EQFScore: formData?.eqfScore,
                EXPScore: formData?.expScore,
                TUScore: formData?.tuScore
            }) as IRestartRoundPayload;
            setRestartLoading(true);
            restartRound(payload, axiosSource)
                .then((result: any) => {
                    setRestartLoading(false);
                    setRoundOperation();
                }).catch((err: any) => {
                    if (!axios.isCancel(err)) {
                        setRestartLoading(false);
                        toastr.error(err?.response?.data || Messages.GenericError)
                    }
                })
        } else {
            setRoundOperation();
        }
    }
    const setRoundOperation = () => {
        const payload = ({
            customerId: props?.customer?.id,
            setRounds: formData?.setRound,
            accountIds: getUniqueIds((props?.model?.tempLetters?.flatMap((x: ITempLetterQueue) => x?.accounts)?.map((x: any) => x?.accountId) || []))
        }) as ISetRoundsPayload;
        setRoundLoading(true);
        setRounds(payload, axiosSource)
            .then((result: any) => {
                setRoundLoading(false);
                sendNoticeAccountUpdate(); // secnd notice of account update
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setRoundLoading(false);
                    toastr.error(err?.response?.data || Messages.GenericError)
                }
            })
    }
    const sendNoticeAccountUpdate = () => {
        const payload = ({
            customerId: props?.customer?.id,
            emailNotice: formData?.noticeUpdate,
            saveNotice: formData?.saveAccUpdate,
            notifyAgent: formData?.emailAgent,
            CCList: CC,
            BCCList: BCC
        }) as ISendNoticePayload;
        setNoticeLoading(true);
        sendNoticeAccUpdate(payload, axiosSource)
            .then((result: any) => {
                setNoticeLoading(false);
                generateLettersFinally(); // final api to generate letters
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setNoticeLoading(false);
                    toastr.error(err?.response?.data || err?.response?.data?.message || Messages.GenericError)
                }
            })
    }
    const regenerateNoticeAccount = () => {
        setRegNoticeLoading(true);
        regernateNoticeAccountUpdate(props?.customer?.id, props?.model?.tempLetters || [], axiosSource)
            .then((result: any) => {
                setRegNoticeLoading(false);
                setOpenNoteHTML(true);
                setNoticeHTML(result);
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setRegNoticeLoading(false);
                    toastr.error(err?.response?.data || err?.response?.data?.message || Messages.GenericError)
                }
            })
    }
    const onCCChange = (e: any) => {
        const newValue = e.target.value;
        setCC(newValue);
    }
    const onBCCChange = (e: any) => {
        const newValue = e.target.value;
        setBCC(newValue);
    }
    const getSelectedCC = () => {
        return selectedCCs?.map(x => x?.email);
    }
    const onCCSelect = (CCs: ICCList[]) => {
        setSelectedCCs(CCs);
        const newCCs = CCs?.map(x => x?.email);
        const uniqueCCs = (CC?.split(',') || [])?.filter(x => !newCCs?.includes(x));
        const emails = uniqueCCs?.concat(newCCs);
        setCC(getUniqueIds(emails)?.join(','));
        setOpenCC(false);
    }
    const getUniqueIds = (arr: string[]) => {
        let data = {} as any;
        arr?.forEach((item: string) => {
            data[item] = item;
        });
        return Object?.getOwnPropertyNames(data)?.filter(x => !!x);
    }
    const createOnlyCRALetters = () => {
        setIgnoreCreditorsAccounts(true);
        setEmptyCreditorButCRA(false);
    }
    return (
        <div className="create-letter-final">
            <fieldset className="customer-field-set mt-2 f-11 letter-fieldset">
                <legend className="f-11">
                    <label>Step#3: Letter Creation Options </label>
                </legend>
                <div className="letter-options">
                    <div className="row m-0 mt-3">
                        <div className="col-12 col-sm-4">
                            <div className="d-inline-block">
                                <Checkbox text="Start Round" checked={formData?.startRound} onChange={e => handleChange('startRound', e.checked)} />
                            </div>
                        </div>
                        <div className="col-12 col-sm-8 d-flex bureaus-entries">
                            <div className="form-inline">
                                <BureauLogoComponent type={EnumBureausShorts.TU} size={'sm'} />
                                <input type="number" value={formData?.tuScore ?? ''} onChange={e => handleChange('tuScore', e.target.value)} className="form-control input-sm" />
                            </div>
                            <div className="form-inline ml-3">
                                <BureauLogoComponent type={EnumBureausShorts.EXP} size={'sm'} />
                                <input type="number" value={formData?.expScore ?? ''} onChange={e => handleChange('expScore', e.target.value)} className="form-control input-sm" />
                            </div>
                            <div className="form-inline ml-3">
                                <BureauLogoComponent type={EnumBureausShorts.EQF} size={'sm'} />
                                <input type="number" value={formData?.eqfScore ?? ''} onChange={e => handleChange('eqfScore', e.target.value)} className="form-control input-sm" />
                            </div>
                        </div>
                    </div>
                    <div className="row m-0">
                        <div className="col-12 col-sm-4 mt-2 mt-sm-0">
                            <div className="d-inline-block">
                                <Checkbox text="Set Rounds?" checked={formData?.setRound} onChange={e => handleChange('setRound', e.checked)} />
                            </div>
                        </div>
                    </div>
                    <div className="row m-0 mt-2">
                        <div className="col-12 col-sm-4">
                            <div className="d-inline-block">
                                <Checkbox text="Create with ids?" checked={formData?.createIds} onChange={e => handleChange('createIds', e.checked)} />
                            </div>
                        </div>
                    </div>
                    <div className="row m-0 mt-2">
                        <div className="col-12 col-sm-4 d-flex align-items-center">
                            <div className="d-inline-block">
                                <Checkbox text="Email Notice Of Account Update?" checked={formData?.noticeUpdate} onChange={e => handleChange('noticeUpdate', e.checked)} />
                            </div>
                        </div>
                        <div className="col-12 col-sm-8 form-group form-inline">
                            <div className="input-group w-100">
                                <label>&nbsp;&nbsp;CC:</label>
                                <div className="control-group ml-2 w-100">
                                    <textarea onChange={onCCChange} value={CC} className="form-control" style={{ width: '100%' }} ></textarea>
                                    <span className="underline ml-2" onClick={() => setOpenCC(true)}>Show CC List</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row m-0 mt-2">
                        <div className="col-12 col-sm-4 d-flex align-items-center">
                            <div className="d-inline-block">
                                <Checkbox text="Save Notice Account Update? " checked={formData?.saveAccUpdate} onChange={e => handleChange('saveAccUpdate', e.checked)} />
                            </div>
                        </div>
                        <div className="col-12 col-sm-8 form-group form-inline">
                            <div className="input-group w-100">
                                <label>BCC:</label>
                                <div className="control-group ml-2 w-100">
                                    <textarea onChange={onBCCChange} value={BCC} className="form-control" style={{ width: '100%' }} ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row m-0 mt-2">
                        <div className="col-12 col-sm-4">
                            <div className="d-inline-block">
                                <Checkbox text="Email note of Agent" checked={formData?.emailAgent} onChange={e => handleChange('emailAgent', e.checked)} />
                            </div>
                        </div>
                    </div>
                    <div className="row m-0">
                        <div className="col-12 mt-4 mb-4 d-flex flex-column flex-sm-row justify-content-end">
                            <ButtonComponent text={'Generate Notice Acccount Update'} loading={regNoticeLoading} title="Generate Notice Acccount Update" className="btn-secondary mr-3 w-100 w-sm-auto" onClick={regenerateNoticeAccount} >
                                <i className="fa fa-recycle mr-2"></i>
                            </ButtonComponent>
                            <ButtonComponent text="Create Letters" title={props?.model?.tempLetters?.length ? 'Click to generate Letters' : 'No Temp Letters Generated yet, Please Generate First and Trya again '}
                                disabled={!props?.model?.tempLetters?.length}
                                loading={loading || roundLoading || noticeLoading || restartLoading}
                                className="btn-primary w-100 w-sm-auto mt-2 mt-sm-0" onClick={onLetterCreate} >
                                <i className="fa fa-paper-plane-o mr-2"></i>
                            </ButtonComponent>
                        </div>
                    </div>
                </div>
            </fieldset>
            <ModalComponent title={"Select CC "} isVisible={openCC} onClose={() => setOpenCC(false)}>
                {
                    openCC &&
                    <CCListComponent selected={getSelectedCC()} onSelect={onCCSelect} cid={props?.customer?.id} />
                }
            </ModalComponent>
            <ModalComponent title={"Regenerated Notice Account Update"} isVisible={openNoteHTML} onClose={() => setOpenNoteHTML(false)}>
                <div className="full-html p-3" dangerouslySetInnerHTML={{ __html: noticeHTML }}>
                </div>
            </ModalComponent>
            <ModalComponent title={"Status"} isVisible={openLetterStatus} onClose={() => setOpenLetterStatus(false)}>
                <div className="letter-statuses-html p-3" dangerouslySetInnerHTML={{ __html: letterStatuses }}>
                </div>
            </ModalComponent>

            <ModalComponent title={"Accounts with empty collector address"} isVisible={openEmptyAddressAccounts} onClose={() => { setOpenEmptyAddressAccounts(false); setEmptyAddressAccounts([]); }}>
                <div className="p-3">
                    <div className='text-danger f-18'>
                        The creditor address must be populated in order to create letters!
                    </div>
                    <div className='mb-2 mt-3 f-12'>
                        *Below are the list of accounts with empty addresses, you can update the accounts from Fast Edit Accounts screen.
                    </div>
                    <div className='table-responsive list-scrollable custom-scrollbar'>
                        <table className='dataTableCustomers table table-striped table-hover'>
                            <thead className='back_table_color'>
                                <tr className={'secondary'}>
                                    <th style={{ width: '80%' }}>Account Name</th>
                                    <th style={{ width: '20%' }}>Is Address Empty</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    emptyAddressAccounts?.map((acc: any, i: number) => (
                                        <tr key={i}>
                                            <td>
                                                {
                                                    acc?.collectorName
                                                }
                                            </td>
                                            <td className='font-weight-bold text-danger'>
                                                {acc?.isAddressEmpty ? 'Yes' : 'No'}
                                            </td>
                                        </tr>
                                    ))
                                }

                            </tbody>
                        </table>
                    </div>
                    <div className='text-right'>
                        <ButtonComponent text='OK' className="btn-primary mr-1 mb-2 mt-3" onClick={() => { setOpenEmptyAddressAccounts(false); setEmptyAddressAccounts([]); }} >
                        </ButtonComponent>
                    </div>
                </div>
            </ModalComponent>
            <ModalComponent title={"Creditors Account Empty!"} isVisible={emptyCreditorButCRA} onClose={() => { setEmptyCreditorButCRA(false); }}>
                <div className="p-3">
                    <div className='text-danger f-20 mb-3'>
                        The Creditor Letters cannot be created becuase the accounts chosen do not have a creditor address listed.
                    </div>
                    <div>
                        You can continue the creation of the CRA letters or you can fix the creditor addresses now and come back to create.
                    </div>
                    <p>
                        What would you like to do?
                    </p>
                    <div className='text-right'>
                        <ButtonComponent text='Create CRA Letters' className="btn-secondary mr-3 mb-2 mt-3" onClick={createOnlyCRALetters} >
                        </ButtonComponent>
                        <Link target={"_blank"} className="mr-1 mb-2 mt-3" to={ClientRoutesConstants.fastEditAccounts.replace(':cid', props?.customer?.id)} >
                            <ButtonComponent text='Fix Creditor Addresses' className="btn-primary" onClick={() => { setEmptyCreditorButCRA(false); }} >
                            </ButtonComponent>
                        </Link>
                    </div>
                </div>
            </ModalComponent>
        </div>
    )
});
