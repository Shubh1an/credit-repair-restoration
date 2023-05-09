import React, { useEffect, useState } from 'react';
import axios, { CancelTokenSource } from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import { ICannedNotes, ICannedNotesHistory } from '../../../../../models/interfaces/customer-view';
import { getCannedNotes, deleteCannedNotes, createCannedNotes } from '../../../../../actions/customers.actions';
import { Messages } from '../../../../../shared/constants';
import { LargeSpinner } from '../../../../../shared/components/large-spinner';
import { ButtonComponent } from '../../../../../shared/components/button';

const matDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getCannedNotes,
        deleteCannedNotes,
        createCannedNotes
    }, dispatch);
}
export const CannedNotes = connect(null, matDispatchToProps)((props: ICannedNotes) => {

    const [loading, setLoading] = useState(false);
    const [saving, setsaving] = useState(false);
    const [content, setContent] = useState('' as string);
    const [list, setList] = useState([] as ICannedNotesHistory[]);
    const [axiosSource, setAxiosSource] = useState({} as CancelTokenSource);

    useEffect(() => {
        getList();
        return () => {
            if (axiosSource?.cancel)
                axiosSource?.cancel(Messages.APIAborted);
        }
    }, [])
    const getList = () => {
        setLoading(true);
        props?.getCannedNotes(props?.type, axiosSource)
            .then((result: any[]) => {
                setLoading(false);
                setList(result);
            }).catch((e: any) => {
                if (!axios.isCancel(e)) {
                    setLoading(false);
                }
            });
    }
    const onDelete = (note: ICannedNotesHistory) => {
        setLoading(true);
        props?.deleteCannedNotes(note?.id, axiosSource)
            .then((result: any[]) => {
                setLoading(false);
                setList([
                    ...list?.filter(x => x.id !== note?.id)
                ]);
            }).catch((e: any) => {
                if (!axios.isCancel(e)) {
                    setLoading(false);
                }
            });
    }
    const onSave = () => {
        setsaving(true);
        props?.createCannedNotes(content, props?.type, axiosSource)
            .then((result: any[]) => {
                setsaving(false);
                setContent('');
                getList();
            }).catch((e: any) => {
                if (!axios.isCancel(e)) {
                    setsaving(false);
                }
            });
    }
    return (
        <div className="position-relative">
            { loading && <LargeSpinner />}
            <div className="row">
                <div className="col-12">
                    <div className="form-group">
                        <label>Enter New Note:</label>
                        <textarea value={content} onChange={e => setContent(e.target.value)} className="form-control" required={true}></textarea>
                    </div>
                </div>
                <div className="col-12 text-right mb-3">
                    <ButtonComponent text="Save" className="btn-primary input-sm" loading={saving} onClick={onSave} >
                        <i className="fa fa-floppy-o mr-2"></i>
                    </ButtonComponent>
                </div>
            </div>
            <div className="table-responsive list-scrollable custom-scrollbar" style={{ maxHeight: '280px' }}>
                {
                    list?.length ?
                        <table className="dataTableCustomers table table-striped table-hover">
                            <thead className="back_table_color">
                                <tr className="secondary">
                                    <th style={{ width: '55%' }}>Note</th>
                                    <th style={{ width: '15%' }}>Note Type</th>
                                    <th style={{ width: '15%' }}>Date Entered</th>
                                    <th align="center" style={{ width: '15%' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    list?.map((note: ICannedNotesHistory, index: number) => {
                                        return (
                                            <tr key={index}>
                                                <td>{note?.note} </td>
                                                <td>{note?.noteType}</td>
                                                <td>{moment(note?.dateEntered).format("MM/DD/YYYY")}</td>
                                                <td className="table-controls">
                                                    <i className="fa fa-trash  ml-2 pointer" title="remove" onClick={() => onDelete(note)}></i>
                                                    <button className="btn btn-secondary btn-sm ml-2" title="select" onClick={() => {
                                                        props.onSelect(note);
                                                        props.onClose(note);
                                                    }}>Select</button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                }

                            </tbody>
                        </table>
                        : null
                }
            </div>
        </div>
    );
});