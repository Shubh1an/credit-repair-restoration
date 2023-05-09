import axios, { CancelTokenSource } from 'axios';
import React, { useEffect, useState } from 'react';
// @ts-ignore
import confirm from 'reactstrap-confirm';
import toastr from 'toastr';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ButtonComponent } from '../../../../../../../shared/components/button';
import { Checkbox } from '../../../../../../../shared/components/checkbox';
import { Messages } from '../../../../../../../shared/constants';
import { LargeSpinner } from '../../../../../../../shared/components/large-spinner';
import { getTempLetterQueue, removeTempLetters, reloadTempLetter, setTempLettersList } from '../../../../../../../actions/create-letter.actions';
import { ITempLetterQueue } from '../../../../../../../models/interfaces/create-letter';
import { ModalComponent } from '../../../../../../../shared/components/modal';
import { TempLetterEditor } from '../../../temp-letter-editor';

const mapStateToProps = (state: any) => {
    return {
        model: state.createLetterModel
    };
}
const matDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        reloadTempLetter,
        setTempLettersList
    }, dispatch);
}
export const CreateTempLetterQueueComponent = connect(mapStateToProps, matDispatchToProps)(((props: any) => {

    const [tempLetterQueue, setTempLetterQueue] = useState([] as ITempLetterQueue[]);
    const [axiosSource, setAxiosSource] = useState({} as CancelTokenSource);
    const [loading, setLoading] = useState(false);
    const [loadingDelAll, setLoadingDelAll] = useState(false);
    const [allChecked, setAllChecked] = useState(false);
    const [checkedCount, setcheckedCount] = useState(0);
    const [singleLoading, setSingleLoading] = useState(false);
    const [deletingId, setdeletingId] = useState(0 as number | undefined);
    const [openEditor, setOpenEditor] = useState(false);
    const [letter, setLetter] = useState(undefined as ITempLetterQueue | undefined);

    useEffect(() => {
        if (props?.cid) {
            fetchTempLetters();
        }
    }, [props?.cid]);
    useEffect(() => {
        if (props.model?.reloadTempLetter) {
            fetchTempLetters();
        }
    }, [props?.model?.reloadTempLetter]);

    const reloadTempLetter = (reload: boolean) => {
        props?.reloadTempLetter(reload);
    }

    const fetchTempLetters = () => {
        setLoading(true);
        const src = axios.CancelToken.source();
        setAxiosSource(src);
        getTempLetterQueue(props?.cid, src)
            .then((result: any) => {
                setLoading(false);
                setTempLetterQueue(result ?? []);
                props?.setTempLettersList(result ?? []);
                setcheckedCount(0);
                reloadTempLetter(false);
                setAllChecked(false);
            }).catch((e: any) => {
                if (!axios.isCancel(e)) {
                    setLoading(false);
                    setTempLetterQueue([]);
                }
            });
    }
    const onAllChecked = (checked: boolean) => {
        setcheckedCount(checked ? tempLetterQueue?.length : 0);
        setTempLetterQueue([
            ...tempLetterQueue?.map((f: ITempLetterQueue) => {
                return {
                    ...f,
                    checked
                }
            })]);
    }
    const onDeleteAll = async () => {
        let result = await confirm({
            title: 'Remove Multiple Letters',
            message: "Are you sure you want to remove selected "
                + (checkedCount === tempLetterQueue?.length ? 'All' : checkedCount)
                + " letter" + ((checkedCount > 1) ? 's' : '') + "?",
            confirmText: "YES",
            confirmColor: "danger",
            cancelColor: "link text-secondary"
        });
        if (result) {
            const ids = tempLetterQueue?.filter(x => x.checked).map(x => x.tempLetterPreviewId)?.join(',');
            if (!ids) {
                return;
            }
            setLoadingDelAll(true);
            removeTempLetters(ids, axiosSource)
                .then((result: any) => {
                    setLoadingDelAll(false);
                    toastr.success(checkedCount + ' temp Letter' + ((checkedCount > 1) ? 's' : '') + ' deleted successfully!!');
                    fetchTempLetters();
                })
                .catch((err: any) => {
                    if (!axios.isCancel(err)) {
                        setLoadingDelAll(false);
                        toastr.error(err?.response?.data || Messages.GenericError);
                    }
                })
        }
    }
    const onDelete = async (file: ITempLetterQueue) => {
        let result = await confirm({
            title: 'Remove Letter',
            message: "Are you sure you want to remove this " + file?.letterName + " Letter?",
            confirmText: "YES",
            confirmColor: "danger",
            cancelColor: "link text-secondary"
        });
        if (result) {
            setdeletingId(file.tempLetterPreviewId);
            setSingleLoading(true);
            await removeTempLetters(file.tempLetterPreviewId?.toString(), axiosSource)
                .then((result: any) => {
                    setSingleLoading(false);
                    toastr.success(file?.letterName + ' Letter removed successfully!!');
                    fetchTempLetters();
                    setdeletingId(0);
                })
                .catch((err: any) => {
                    if (!axios.isCancel(err)) {
                        setSingleLoading(false);
                        toastr.error(err?.response?.data || Messages.GenericError);
                    }
                })
        }
    }
    const onFileChecked = (file: ITempLetterQueue, checked: boolean) => {

        setcheckedCount(checked ? checkedCount + 1 : checkedCount - 1);
        if (!checked) {
            setAllChecked(false);
        }
        setTempLetterQueue([
            ...tempLetterQueue?.map((f: ITempLetterQueue) => {
                return {
                    ...f,
                    checked: f.tempLetterPreviewId === file.tempLetterPreviewId ? checked : f.checked
                }
            })]);
    }
    return (
        <div className="files-list">
            <label>Total Temp Letters : {tempLetterQueue?.length}</label>

            <div className="pb-2 mt-2">
                {
                    checkedCount > 0 &&
                    <ButtonComponent text={"Delete " + `(${checkedCount})`} loading={loadingDelAll} className="btn-danger pull-left" onClick={onDeleteAll} >
                        <i className="fa fa-trash mr-2"></i>
                    </ButtonComponent>
                }
                <div className="clearfix"></div>
            </div>
            <div className="table-responsive list-scrollable custom-scrollbar position-relative">
                {loading && <LargeSpinner />}
                <table className="dataTableCustomers table table-striped table-hover">
                    <thead className="back_table_color">
                        <tr className="secondary">
                            <th style={{ width: '5%' }}>
                                {
                                    tempLetterQueue?.length ?
                                        <Checkbox text="" checked={allChecked} onChange={(data: any) => { setAllChecked(data?.checked); onAllChecked(data?.checked); }} />
                                        : null
                                }
                            </th>
                            <th style={{ width: '10%' }}>
                                Edit
                            </th>
                            <th style={{ width: '20%' }}>Letter Name</th>
                            <th style={{ width: '20%' }}>Type</th>
                            <th style={{ width: '20%' }}>Source</th>
                            <th style={{ width: '20%' }}>Accounts</th>
                            <th style={{ width: '5%' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            tempLetterQueue?.length ?
                                tempLetterQueue?.map((file: ITempLetterQueue, index: number) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <Checkbox text="" checked={!!file?.checked || false} onChange={(data: any) => onFileChecked(file, data?.checked)} />
                                            </td>
                                            <td>
                                                <label className="underline" onClick={() => { setLetter(file); setOpenEditor(true); }}>Edit</label>
                                            </td>
                                            <td>
                                                {file?.letterName}
                                            </td>
                                            <td>
                                                {file?.letterType}
                                            </td>
                                            <td>
                                                {file?.bureauCreated}
                                            </td>
                                            <td>
                                                <ol className="m-0 p-0 pl-2">
                                                    {
                                                        file?.accounts?.map((x: any, ind: number) => {
                                                            return (
                                                                <li key={ind}>
                                                                    {x?.accountName}
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                </ol>
                                            </td>
                                            <td className="position-relative">
                                                {
                                                    singleLoading && deletingId === file?.tempLetterPreviewId ? <LargeSpinner className="small-spinner" />
                                                        : <>
                                                            <i className="fa fa-trash text-danger f-15 ml-3 pointer" title="remove" onClick={() => onDelete(file)}></i>
                                                        </>
                                                }
                                            </td>
                                        </tr>
                                    );
                                })
                                :
                                <tr>
                                    <td colSpan={7} className="text-center text-danger" style={{ height: '50px' }}>
                                        {!loading && <i>No Temp Letters available.</i>}
                                    </td>
                                </tr>
                        }
                    </tbody>
                </table>
            </div>
            <ModalComponent title={"Edit Temp Letter"} fullscreen={true} isVisible={openEditor} onClose={() => setOpenEditor(false)}>
                {openEditor && <TempLetterEditor onSave={() => { setOpenEditor(false); fetchTempLetters(); }} customer={props?.customer} letter={letter} />}
            </ModalComponent>
        </div >
    );
}));