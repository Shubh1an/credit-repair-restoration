import React, { useEffect, useState } from 'react';
import moment from 'moment';
import toastr from 'toastr';
// @ts-ignore
import confirm from 'reactstrap-confirm';

import { DashboardWidget } from '../../../../dashboard/components/dashboard-widget';
import { INotes, INotesHistory, IProcessingNotesHistory } from '../../../../../models/interfaces/customer-view';
import { IDropdown } from '../../../../../models/interfaces/shared';
import { ButtonComponent } from '../../../../../shared/components/button';
import { LargeSpinner } from '../../../../../shared/components/large-spinner';
import { Checkbox } from '../../../../../shared/components/checkbox';

export interface ISaveNotesPayLoad {
    content?: string;
    agentId?: string;
    agentName?: string;
    isEmailSend?: boolean;
    date?: string;
    noteId?: string;
}

export const NotesComponent = (props: INotes) => {

    const [email, setEmail] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState('');
    const [selectedAgentName, setSelectedAgentName] = useState('' as string | undefined);
    const [deletingNoteId, setdeletingNoteId] = useState('');
    const [content, setContent] = useState('' as string | undefined);

    useEffect(() => {
        setContent(props?.content);
    }, [props?.content]);

    useEffect(() => {
        if (props?.isProcessingNotes) {
            if (props?.customer?.agent?.id) {
                setAgentValue(props?.customer?.agent?.id);
            }

        }
    }, [props?.agents]);

    const onSave = () => {
        if (!content) {
            toastr.error('Please enter note.');
            return;
        }
        if (email && !selectedAgent) {
            toastr.error('Please select Agent to recieve email.');
            return;
        }
        if (props?.onSave) {
            props?.onSave({
                content,
                agentId: selectedAgent,
                isEmailSend: email,
                agentName: selectedAgentName
            });
            setTimeout(resetValues, 0);
        }
    }
    const resetValues = () => {
        setEmail(false);
        setSelectedAgent('');
        setSelectedAgentName('');
    }
    const onDelete = async (noteId: string) => {
        let result = await confirm({
            title: 'Remove Record',
            message: "Are you sure you want to remove this record?",
            confirmText: "YES",
            confirmColor: "danger",
            cancelColor: "link text-secondary"
        });
        if (result) {
            setdeletingNoteId(noteId);
            props?.onDelete(noteId);
        }
    }
    const setAgentValue = (id: string) => {
        setSelectedAgent(id);
        setSelectedAgentName(props?.agents?.find(x => x.abbreviation === id)?.name);
    }
    return (
        <div>
            <DashboardWidget title={props.title} allowFullscreen={true} allowMaximize={true} allowMinimize={true} isLoading={props?.loading} reload={false} >
                {
                    props?.allowAddNotes &&
                    <>
                        <div className="row">
                            <div className="col-12">
                                <div className="form-group mb-1">
                                    <label className='text-orange-red'>Comments*</label>
                                    <textarea className="form-control" value={content} onChange={e => setContent(e.target.value)} placeholder="comments here..."></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-12 col-sm-3">
                                <i className="fa fa-book f-12"></i>
                                <span className="text-danger change-button font-weight-bold ml-1" onClick={props.onOpenCannedNotes}>Select from Canned Notes</span>
                            </div>
                            <div className="col-3 d-none d-sm-block"></div>
                            <div className="col-6 col-sm-2 d-flex  mt-1 mt-sm-0">
                                <Checkbox text="Send Note" checked={email} onChange={(data: any) => {
                                    setEmail(data?.checked);
                                    setAgentValue('');
                                }} />
                            </div>
                            <div className="col-12 col-sm-3 d-flex  mt-1 mt-sm-0">
                                {email &&
                                    <>
                                        <b className='text-orange-red'>To*&nbsp;&nbsp;</b>
                                        <select value={selectedAgent} onChange={e => setAgentValue(e.target.value)} className="form-control input-sm">
                                            <option>- Select Agent-</option>
                                            {
                                                props?.agents?.map((agent: IDropdown, index: number) => {
                                                    return (
                                                        <option key={index} value={agent?.abbreviation}>{agent?.name}</option>
                                                    );
                                                })
                                            }
                                        </select>
                                    </>
                                }
                            </div>
                            <div className="col-12 col-sm-1 pl-sm-0 text-right mt-2 mt-sm-0">
                                <ButtonComponent text="Save" className="btn-primary input-sm w-100 w-sm-auto" loading={props?.saving} onClick={onSave} >
                                    <i className="fa fa-floppy-o mr-2"></i>
                                </ButtonComponent>
                            </div>
                        </div>
                    </>
                }
                <div className="table-responsive list-scrollable custom-scrollbar " style={{ maxHeight: (props?.isProcessingNotes ? '230px' : '160px') }}>
                    <table className="dataTableCustomers table table-striped table-hover">
                        <thead className="back_table_color">
                            <tr className="secondary">
                                <th style={{ width: '15%' }}>
                                    {
                                        props?.isProcessingNotes ? 'Emailed?' : 'Agent'
                                    }</th>
                                <th style={{ width: '15%' }}>Date</th>
                                <th style={{ width: '65%' }}>Comments</th>
                                <th align="center" style={{ width: '5%' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                props?.notes?.length ?
                                    (props?.notes as Array<INotesHistory | IProcessingNotesHistory>)
                                        .map((note: any, index: number) => {
                                            return (

                                                <tr key={index}>
                                                    {
                                                        !props?.isProcessingNotes ?
                                                            <>
                                                                <td>{note?.roleName} </td>
                                                                <td>{note?.dateEntered ? moment(note?.dateEntered).format("MM/DD/YYYY") : null}</td>
                                                                <td>{note?.note}</td>
                                                                <td className="table-controls position-relative">
                                                                    {
                                                                        props?.deleting && deletingNoteId === note?.id ? <LargeSpinner className="small-spinner" />
                                                                            :
                                                                            <>
                                                                                {props?.allowEditNotes && <i className="fa fa-pencil pointer" title="edit" onClick={() => props?.onEdit && props?.onEdit(note)}></i>}
                                                                                {props?.allowRemoveNotes && <i className="fa fa-trash text-danger f-15 ml-2 pointer" title="remove" onClick={() => onDelete(note?.id)}></i>}
                                                                            </>
                                                                    }
                                                                </td>
                                                            </>
                                                            :
                                                            <>
                                                                <td>
                                                                    {
                                                                        note?.emailed ?
                                                                            <div>
                                                                                <label>YES</label>
                                                                                <div>
                                                                                    <strong>Email To:</strong> {note?.sentTo}
                                                                                </div>
                                                                                <div>
                                                                                    <strong>Email From:</strong> {note?.sentFrom}
                                                                                </div>
                                                                            </div>
                                                                            :
                                                                            <label>NO</label>
                                                                    }
                                                                </td>
                                                                <td>{note?.internalNotesDateEntered ? moment(note?.internalNotesDateEntered).format("MM/DD/YYYY") : null}</td>
                                                                <td>{note?.internalNotes}</td>
                                                                <td className="table-controls position-relative">
                                                                    {
                                                                        props?.deleting && deletingNoteId === note?.internalNoteId ? <LargeSpinner className="small-spinner" />
                                                                            : <>
                                                                                {props?.allowRemoveNotes && <i className="fa fa-trash text-danger f-15 ml-2 pointer" title="remove" onClick={() => onDelete(note?.internalNoteId)}></i>}
                                                                            </>
                                                                    }
                                                                </td>
                                                            </>
                                                    }

                                                </tr>
                                            );
                                        })
                                    :
                                    <tr>
                                        <td colSpan={4} className="text-center text-danger" style={{ height: '50px' }}>
                                            <i>No Notes available!!!</i>
                                        </td>
                                    </tr>
                            }
                        </tbody>
                    </table>

                </div>
            </DashboardWidget>
        </div>
    );
}
