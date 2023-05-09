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
import { AddUpdateReferralAgent } from './add-update-agent';
import { deleteReferralAgent } from '../../../../../../actions/referral.actions';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        deleteReferralAgent
    }, dispatch);
}
export const ReferralAgentsComponent: any = connect(null, mapDispatchToProps)(
    (props:
        {
            officeId?: string,
            deleteReferralAgent: any,
            agents: IFranchiseAgent[], // referral agents
            loadAgents: () => void,
            loadOffices: () => void
        }) => {
        const [deletingAgentId, setDeletingAgentId] = useState('');
        const [editingAgent, setEditingAgent] = useState(null as IFranchiseAgent | null);
        const [axiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);
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
                message: "Are you sure you want to delete this Affiliate Agent?",
                confirmText: "YES",
                confirmColor: "danger",
                cancelColor: "link text-secondary"
            });
            if (result) {
                setDeletingAgentId(ag?.id ?? '');
                setDeleting(true);
                props?.deleteReferralAgent(ag, props?.officeId, axiosSource).then((result: any) => {
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
            props?.loadOffices();
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
                                <th style={{ width: '20%' }}>Last Name </th>
                                <th style={{ width: '20%' }}>First Name</th>
                                <th style={{ width: '17%' }}>Telephone</th>
                                <th style={{ width: '17%' }}>Cell Phone</th>
                                <th style={{ width: '20%' }}>Email</th>
                                <th align="center" style={{ width: '5%' }}></th>
                                <th align="center" style={{ width: '5%' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                props?.agents?.length ?
                                    props?.agents.map((agent: IFranchiseAgent, index: number) => {
                                        return (
                                            <tr key={index}>
                                                <td>{agent?.lastName} </td>
                                                <td>{agent?.firstName}</td>
                                                <td>{agent?.telephone}</td>
                                                <td>{agent?.cellPhone}</td>
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
                                                    <Link to={ClientRoutesConstants.referralAgents + '/' + agent?.id} >
                                                        <Button color='secondary btn-sm'>View</Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })
                                    :
                                    <tr>
                                        <td colSpan={7} className="text-center text-danger p-0" style={{ height: '50px' }}>
                                            <i>No Affiliate Agents available!</i>
                                        </td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                    <ModalComponent title={isAddMode ? 'Add Affiliate Agent' : `Update Agent ${editingAgent?.firstName + ' ' + editingAgent?.lastName}`}
                        isVisible={isModalVisible} onClose={() => { setIsModalVisible(false); setIsAddMode(false); }}>
                        {
                            isModalVisible
                            && <AddUpdateReferralAgent allowOfficeEdit={isAddMode} allowDelete={!isAddMode} officeId={props?.officeId} isAddMode={isAddMode} agent={editingAgent} onDelete={() => setIsModalVisible(false)} onPasswordChange={() => setIsModalVisible(false)} onSave={onSave} />
                        }
                    </ModalComponent>
                </div>
            </div>
        );
    });

ReferralAgentsComponent.displayName = 'ReferralAgentsComponent';
