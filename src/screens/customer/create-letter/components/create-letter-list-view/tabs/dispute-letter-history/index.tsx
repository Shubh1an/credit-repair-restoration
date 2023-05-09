import axios, { CancelTokenSource } from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// @ts-ignore
import confirm from 'reactstrap-confirm';
import toastr from 'toastr';

import { ButtonComponent } from '../../../../../../../shared/components/button';
import { Checkbox } from '../../../../../../../shared/components/checkbox';
import { LargeSpinner } from '../../../../../../../shared/components/large-spinner';
import { getPDFDisputeLetters } from '../../../../../../../actions/create-letter.actions';
import { IPDFDisputeLetters } from '../../../../../../../models/interfaces/create-letter';
import { removeLetters } from '../../../../../../../actions/customers.actions';
import { Messages } from '../../../../../../../shared/constants';
import { FileDownload } from '../../../../../../../shared/components/file-download';

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getPDFDisputeLetters
    }, dispatch);
}
const mapStateToProps = (state: any) => {
    return {
        model: state?.createLetterModel
    }
}
export const CreateDisputeLetterHistoryComponent = connect(mapStateToProps, mapDispatchToProps)((props: any) => {

    const [letters, setLetters] = useState([] as IPDFDisputeLetters[]);
    const [axiosSource, setAxiosSource] = useState({} as CancelTokenSource);
    const [loading, setLoading] = useState(false);
    const [allChecked, setAllChecked] = useState(false);
    const [checkedCount, setcheckedCount] = useState(0);
    const [singleLoading, setSingleLoading] = useState(false);
    const [deletingId, setdeletingId] = useState('' as string | unknown);
    const [loadingDelAll, setLoadingDelAll] = useState(false);

    useEffect(() => {
        if (props?.cid) {
            fetchDisputeLetters();
        }
    }, [props?.cid]);
    useEffect(() => {
        if (props.model?.reloadDisputeLetters) {
            fetchDisputeLetters();
        }
    }, [props?.model?.reloadDisputeLetters]);
    const fetchDisputeLetters = () => {
        setLoading(true);
        const src = axios.CancelToken.source();
        setAxiosSource(src);
        props?.getPDFDisputeLetters(props?.cid, src)
            .then((result: any) => {
                setLoading(false);
                setLetters(result);
                setAllChecked(false);
                setcheckedCount(0);
            }).catch((e: any) => {
                if (!axios.isCancel(e)) {
                    setLoading(false);
                    setLetters([]);
                    setAllChecked(false);
                    setcheckedCount(0);
                }
            });
    }
    const onAllChecked = (checked: boolean) => {
        setcheckedCount(checked ? letters?.length : 0);
        setLetters(letters?.map((file: IPDFDisputeLetters) => {
            return {
                ...file,
                checked
            }
        }));
    }
    const onDeleteAll = async () => {
        let result = await confirm({
            title: 'Remove Multiple Letters',
            message: "Are you sure you want to remove selected "
                + (checkedCount === letters?.length ? 'All' : checkedCount)
                + " letter" + ((checkedCount > 1) ? 's' : '') + "?",
            confirmText: "YES",
            confirmColor: "danger",
            cancelColor: "link text-secondary"
        });
        if (result) {
            const ids = letters?.filter(x => x.checked).map(x => x.letterFileId)?.join(',');
            if (!ids) {
                return;
            }
            setLoadingDelAll(true);
            removeLetters(ids, axiosSource)
                .then((result: any) => {
                    setLoadingDelAll(false);
                    toastr.success(checkedCount + ' Letter' + ((checkedCount > 1) ? 's' : '') + ' deleted successfully!!');
                    fetchDisputeLetters();
                })
                .catch((err: any) => {
                    if (!axios.isCancel(err)) {
                        setLoadingDelAll(false);
                        toastr.error(err?.response?.data || Messages.GenericError);
                    }
                })
        }
    }
    const onDelete = async (file: IPDFDisputeLetters) => {
        let result = await confirm({
            title: 'Remove Letter',
            message: "Are you sure you want to remove this " + file?.name + " Letter?",
            confirmText: "YES",
            confirmColor: "danger",
            cancelColor: "link text-secondary"
        });
        if (result) {
            setdeletingId(file.letterFileId);
            setSingleLoading(true);
            await removeLetters(file.letterFileId ?? '', axiosSource)
                .then((result: any) => {
                    setSingleLoading(false);
                    toastr.success(file?.name + ' Letter removed successfully!!');
                    fetchDisputeLetters();
                    setdeletingId('');
                })
                .catch((err: any) => {
                    if (!axios.isCancel(err)) {
                        setSingleLoading(false);
                        toastr.error(err?.response?.data || Messages.GenericError);
                    }
                })
        }
    }
    const onFileChecked = (file: IPDFDisputeLetters, checked: boolean) => {
        setcheckedCount(checked ? checkedCount + 1 : checkedCount - 1);
        if (!checked) {
            setAllChecked(false);
        }
        setLetters(letters?.map((f: IPDFDisputeLetters) => {
            return {
                ...f,
                checked: f?.letterFileId === file?.letterFileId ? checked : f.checked
            }
        }));
    }
    return (
        <div className="files-list">
            <label>Total Dispute Letters : {letters?.length ?? 0}</label>
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
                            <th style={{ width: '2%' }}>
                                {
                                    letters?.length ?
                                        <Checkbox text="" checked={allChecked} onChange={(data: any) => { setAllChecked(data?.checked); onAllChecked(data?.checked); }} />
                                        : null
                                }
                            </th>
                            <th style={{ width: '5%' }}>
                                Download
                            </th>
                            <th style={{ width: '15%' }}>Letter Name</th>
                            <th style={{ width: '5%' }}>Letter Type</th>
                            <th style={{ width: '10%' }}>Date Created</th>
                            <th style={{ width: '15%' }}>Accounts</th>
                            <th style={{ width: '5%' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            letters?.length ?
                                letters?.map((file: IPDFDisputeLetters, index: number) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <Checkbox text="" checked={!!file?.checked || false} onChange={(data: any) => onFileChecked(file, data?.checked)} />
                                            </td>
                                            <td>
                                                <FileDownload filePath={file.pathLocation} />
                                            </td>
                                            <td>
                                                {file?.name}
                                            </td>
                                            <td>
                                                {file?.type}
                                            </td>
                                            <td>
                                                {moment(file?.dateEntered).format("MM/DD/YYYY")}
                                            </td>
                                            <td>
                                                <ol className="m-0 p-0 pl-2">
                                                    {
                                                        file?.accounts?.map((x: string, ind: number) => {
                                                            return (
                                                                <li key={ind}>
                                                                    {x}
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                </ol>
                                            </td>
                                            <td className="position-relative">
                                                {
                                                    singleLoading && deletingId === file?.letterFileId ? <LargeSpinner className="small-spinner" />
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
                                        {!loading && <i>No Dispute Letters available.</i>}
                                    </td>
                                </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
})