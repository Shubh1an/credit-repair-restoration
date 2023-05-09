import React, { useState } from 'react';
import axios, { CancelTokenSource } from 'axios';
import { useEffect } from 'react';
import toastr from 'toastr';
// @ts-ignore
import confirm from 'reactstrap-confirm';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { ButtonComponent } from '../../../../../../shared/components/button';
import { LargeSpinner } from '../../../../../../shared/components/large-spinner';
import { IFranchiseAgent } from '../../../../../../models/interfaces/franchise';
import { ClientRoutesConstants, Messages } from '../../../../../../shared/constants';
import { ModalComponent } from '../../../../../../shared/components/modal';
import { AddUpdateFranchiseAgent } from './add-update-agent';
import { deleteFranchiseAgent } from '../../../../../../actions/franchise.actions';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        deleteFranchiseAgent
    }, dispatch);
}
export const FranchiseAgentsComponent = connect(null, mapDispatchToProps)(
    (props:
        {
            officeId?: string,
            deleteFranchiseAgent: any,
            agents: IFranchiseAgent[],
            loadAgents: () => void,
            loadOffices: () => void
        }) => {

        const [deletingAgentId, setDeletingAgentId] = useState('');
        const [editingAgent, setEditingAgent] = useState(null as IFranchiseAgent | null);
        const [axiosSource, setAxiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);
        const [deleting, setDeleting] = useState(false);
        const [isModalVisible, setIsModalVisible] = useState(false);
        const [isAddMode, setIsAddMode] = useState(false);

        useEffect(() => {
            return () => {
                axiosSource?.cancel(Messages.APIAborted);
            }
        }, []);

        const onDelete = async (ag?: IFranchiseAgent) => {
            let result = await confirm({
                title: 'Remove Record',
                message: "Are you sure you want to delete this Company Agent?",
                confirmText: "YES",
                confirmColor: "danger",
                cancelColor: "link text-secondary"
            });
            if (result) {
                setDeletingAgentId(ag?.id ?? '');
                setDeleting(true);
                props?.deleteFranchiseAgent(ag, axiosSource).then((result: any) => {
                    setDeleting(false);
                    toastr.success(result);
                    props.loadAgents();
                    props?.loadOffices();
                    setDeletingAgentId('');
                }).catch((err: any) => {
                    if (!axios.isCancel(err)) {
                        setDeleting(false);
                        toastr.error(err?.response?.data);
                    }
                })
            }
        }
        const onEdit = (fagent: IFranchiseAgent) => {
            setEditingAgent(fagent);
            setIsAddMode(false);
            setIsModalVisible(true);
        }
        const onAddClick = () => {
            setEditingAgent(null);
            setIsAddMode(true);
            setIsModalVisible(true);
        }
        const onSave = (id: string) => {
            setIsModalVisible(false);
            setIsAddMode(false);
            props.loadAgents();
        }
        return (
            <div>
                <div className="p-2 d-flex justify-content-end mt-5">
                    <ButtonComponent text="Add New Agent" className="btn-primary" onClick={onAddClick} >
                        <i className="fa fa-plus mr-2"></i>
                    </ButtonComponent>
                </div>
                <div className="table-responsive list-scrollable custom-scrollbar  mb-5">
                    <table className="dataTableCustomers table table-striped table-hover">
                        <thead className="back_table_color">
                            <tr className="secondary">
                                <th style={{ width: '5%' }}>Is Locked </th>
                                <th style={{ width: '15%' }}>Last Name </th>
                                <th style={{ width: '15%' }}>First Name</th>
                                <th style={{ width: '10%' }}>Role</th>
                                <th style={{ width: '15%' }}>Telephone</th>
                                <th style={{ width: '25%' }}>Email</th>
                                <th align="center" style={{ width: '5%' }}></th>
                                <th align="right" style={{ width: '5%' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                props?.agents?.length ?
                                    props?.agents.map((agent: IFranchiseAgent, index: number) => {
                                        return (
                                            <tr key={index}>
                                                <td>{agent?.isLockedOut ? 'Yes' : 'No'} </td>
                                                <td>{agent?.lastName} </td>
                                                <td>{agent?.firstName}</td>
                                                <td>{agent?.role}</td>
                                                <td>{agent?.telephone}</td>
                                                <td>{agent?.email}</td>
                                                <td className="table-controls position-relative text-center">
                                                    {
                                                        deleting && deletingAgentId === agent?.id ? <LargeSpinner className="small-spinner" />
                                                            :
                                                            <>
                                                                <i className="fa fa-pencil pointer" title="edit" onClick={() => onEdit(agent)}></i>
                                                                <i className="fa fa-trash text-danger f-15 ml-2 pointer" title="remove" onClick={() => onDelete(agent)}></i>
                                                            </>
                                                    }
                                                </td>
                                                <td className="position-relative  d-flex justify-content-around">
                                                    <Link to={ClientRoutesConstants.franchiseAgents + '/' + agent?.id} >
                                                        <Button color='secondary btn-sm'>View</Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })
                                    :
                                    <tr>
                                        <td colSpan={8} className="text-center text-danger p-0" style={{ height: '50px' }}>
                                            <i>No Company Agents available!</i>
                                        </td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                    <ModalComponent title={isAddMode ? 'Add Company Agent' : `Update Agent ${editingAgent?.firstName + ' ' + editingAgent?.lastName}`}
                        isVisible={isModalVisible} onClose={() => { setIsModalVisible(false); setIsAddMode(false); }}>
                        {
                            isModalVisible
                            && <AddUpdateFranchiseAgent officeId={props?.officeId} isAddMode={isAddMode} agent={editingAgent} onSave={onSave} />
                        }
                    </ModalComponent>
                </div>
            </div>
        );
    })