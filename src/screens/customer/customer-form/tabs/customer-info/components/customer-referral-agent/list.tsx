import React, { useEffect, useState } from 'react';
import axios, { CancelTokenSource } from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// @ts-ignore
import confirm from 'reactstrap-confirm';
import toastr from 'toastr';

import { DashboardWidget } from '../../../../../../dashboard/components/dashboard-widget';
import { ButtonComponent } from '../../../../../../../shared/components/button';
import { IFranchiseAgent as IAgent } from '../../../../../../../models/interfaces/franchise';
import { LargeSpinner } from '../../../../../../../shared/components/large-spinner';
import { Messages } from '../../../../../../../shared/constants';
import { getCustomerReferralAgentsList, deleteCustomerReferralAgents } from '../../../../../../../actions/customers.actions';
import { ModalComponent } from '../../../../../../../shared/components/modal';
import { AddUpdateCustomerReferralComponent } from '../customer-referral-agent/add-update';

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getCustomerReferralAgentsList,
        deleteCustomerReferralAgents
    }, dispatch);
}

export const CustomerReferralAgentListComponent = connect(null, mapDispatchToProps)((props: {
    cid?: string, getCustomerReferralAgentsList: any,
    deleteCustomerReferralAgents: any
}) => {

    const [loading, setLoading] = useState(false);
    const [singleLoading, setSingleLoading] = useState(false);

    const [showModel, setShowModel] = useState(false);
    const [agents, setAgents] = useState([] as IAgent[]);
    const [currentAgent, setCurrentAgent] = useState(null as IAgent | null);
    const [ddlItems, setDdlItems] = useState([] as IAgent[]);
    const [deletingId, setdeletingId] = useState('' as string);
    const [axiosSource, setAxiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);

    useEffect(() => {
        loadList();

        return () => {
            if (axiosSource?.cancel)
                axiosSource?.cancel(Messages.APIAborted);
        }

    }, [props?.cid])

    const onDetailsReload = () => {
        loadList();
    }
    const loadList = () => {
        setLoading(true);
        const source = axios.CancelToken.source();
        setAxiosSource(source);
        props?.getCustomerReferralAgentsList(props?.cid, source)
            .then((result: any) => {
                setLoading(false);
                setAgents(result?.agentsList || []);
                setDdlItems(result?.ddlItems || []);
            })
            .catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setLoading(false);
                }
            })
    }
    const onEdit = (ag: IAgent) => {
        setCurrentAgent(ag);
        setShowModel(true);
    }
    const addNewReferral = () => {
        setShowModel(true);
    }
    const onModelClose = () => {
        setCurrentAgent(null);
        setShowModel(false);
    }
    const onSave = () => {
        onModelClose();
        loadList();
    }
    const onDelete = async (ag: IAgent) => {
        let result = await confirm({
            title: 'Remove File',
            message: "Are you sure you want to remove this " + ag?.fullName + " agent?",
            confirmText: "YES",
            confirmColor: "danger",
            cancelColor: "link text-secondary"
        });
        if (result) {
            setdeletingId(ag?.id || '');
            setSingleLoading(true);
            await props?.deleteCustomerReferralAgents(props?.cid, ag?.id, axiosSource)
                .then((result: any) => {
                    setSingleLoading(false);
                    toastr.success(`Agent ${ag?.fullName} removed successfully!!`);
                    loadList();
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
    return (
        <div className='customer-referral-list'>
            <DashboardWidget isLoading={loading} reloadHandler={onDetailsReload} title={"Client Affiliate Agents"} allowFullscreen={true} allowMaximize={true} allowMinimize={true} reload={true} >
                <div className="pb-2 d-flex justify-content-end">
                    <ButtonComponent text="Add New Affiliate Agent" className="btn-success" onClick={addNewReferral} >
                        <i className="fa fa-plus mr-2"></i>
                    </ButtonComponent>
                </div>
                <div className="table-responsive list-scrollable custom-scrollbar">
                    <table className="dataTableCustomers table table-striped table-hover">
                        <thead className="back_table_color">
                            <tr className="secondary">
                                <th style={{ width: '30%' }}>Agent</th>
                                <th style={{ width: '30%' }}>Role</th>
                                <th style={{ width: '18%' }}>Telephone</th>
                                <th style={{ width: '18%' }}>Cellphone</th>
                                <th style={{ width: '5%' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                agents?.length ?
                                    agents?.map((ag: IAgent, index: number) => {
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    {ag?.fullName}
                                                </td>
                                                <td>
                                                    {ag?.customerRole}
                                                </td>
                                                <td>
                                                    {ag?.telephone}
                                                </td>
                                                <td>
                                                    {ag?.cellPhone}
                                                </td>
                                                <td className="position-relative  d-flex justify-content-around mt-1">
                                                    {
                                                        singleLoading && deletingId === ag?.id ? <LargeSpinner className="small-spinner" />
                                                            : <>
                                                                <i className="fa fa-pencil pointer" title="edit" onClick={() => onEdit(ag)}></i>
                                                                <i className="fa fa-trash text-danger f-15 pointer" title="remove" onClick={() => onDelete(ag)}></i>
                                                            </>
                                                    }
                                                </td>
                                            </tr>
                                        );
                                    })
                                    :
                                    <tr>
                                        <td colSpan={5} className="text-center text-danger" style={{ height: '50px' }}>
                                            <i>No Agents for this Client.</i>
                                        </td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </DashboardWidget>
            <ModalComponent title={(!currentAgent ? 'Add New' : 'Edit') + ' Affiliate Agent'} isVisible={showModel} onClose={onModelClose}>
                {showModel && <AddUpdateCustomerReferralComponent cid={props.cid} onSave={onSave} agents={ddlItems} isAddMode={!currentAgent} agent={currentAgent} />}
            </ModalComponent>
        </div >
    );
});
