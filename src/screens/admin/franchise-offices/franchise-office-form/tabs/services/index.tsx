import React, { useEffect, useState } from 'react';
import toastr from 'toastr';
// @ts-ignore
import confirm from 'reactstrap-confirm';
import axios, { CancelTokenSource } from 'axios';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { ButtonComponent } from '../../../../../../shared/components/button';
import { LargeSpinner } from '../../../../../../shared/components/large-spinner';
import { IFranchiseService } from '../../../../../../models/interfaces/franchise';
import { Messages } from '../../../../../../shared/constants';
import { getFranchiseServices, deleteFranchiseService } from '../../../../../../actions/franchise.actions';
import { ModalComponent } from '../../../../../../shared/components/modal';
import { AddUpdateFranchiseService } from './add-update-service';

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getFranchiseServices,
        deleteFranchiseService
    }, dispatch);
}

export const FranchiseOfficeServicesComponent = connect(null, mapDispatchToProps)((props: any) => {
    const [services, setServices] = useState([] as IFranchiseService[]);
    const [editingService, setEditingService] = useState(null as IFranchiseService | null);
    const [deletingServiceId, setDeletingServiceId] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [axiosSource, setAxiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);

    useEffect(() => {
        loadServices();
        return () => {
            if (axiosSource.cancel) {
                axiosSource.cancel(Messages.APIAborted);
            }
        }
    }, [props?.officeId]);

    const onDelete = async (fs?: IFranchiseService) => {
        let result = await confirm({
            title: 'Remove Record',
            message: "Are you sure you want to remove Service?",
            confirmText: "YES",
            confirmColor: "danger",
            cancelColor: "link text-secondary"
        });
        if (result) {
            setDeletingServiceId(fs?.id ?? '');
            setDeleting(true);
            props?.deleteFranchiseService(props?.officeId, fs?.id, axiosSource).then((result: any) => {
                setDeleting(false);
                toastr.success(result);
                loadServices();
                setDeletingServiceId('');
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setDeleting(false);
                    toastr.error(err?.response?.data);
                }
            })
        }
    }
    const onEdit = (serv: IFranchiseService) => {
        setEditingService(serv);
        setIsAddMode(false);
        setIsModalVisible(true);
    }
    const onAddClick = () => {
        setEditingService(null);
        setIsAddMode(true);
        setIsModalVisible(true);
    }
    const onSave = () => {
        setIsModalVisible(false);
        setIsAddMode(false);
        loadServices();
    }
    const loadServices = () => {
        setLoading(true);
        props.getFranchiseServices(props?.officeId, axiosSource)
            .then((result: IFranchiseService[]) => {
                setLoading(false);
                setServices(result);
            })
            .catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setLoading(false);
                    toastr.error(err?.response?.data);
                }
            })
    }
    return (
        <div>
            <div className="p-2 d-flex justify-content-end mt-5">
                <ButtonComponent text="Add New Service" className="btn-primary"  onClick={onAddClick}>
                    <i className="fa fa-plus mr-2"></i>
                </ButtonComponent>
            </div>
            <div className="table-responsive list-scrollable custom-scrollbar  mb-5" style={{ maxHeight: (props?.isProcessingNotes ? '230px' : '160px') }}>
                <table className="dataTableCustomers table table-striped table-hover">
                    <thead className="back_table_color">
                        <tr className="secondary">
                            <th style={{ width: '30%' }}>Service </th>
                            <th style={{ width: '30%' }}>Cost</th>
                            <th style={{ width: '30%', textAlign: 'center' }}>Allow Cost Override</th>
                            <th align="center" style={{ width: '10%' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            !loading ?
                                services?.length ?
                                    services.map((service: IFranchiseService, index: number) => {
                                        return (

                                            <tr key={index}>
                                                <td>{service?.name} </td>
                                                <td>${service?.cost || 0}</td>
                                                <td className="text-center">{service?.canOverride ? 'Yes' : 'No'}</td>
                                                <td className="table-controls position-relative dis">
                                                    {
                                                        deleting && deletingServiceId === service?.id ? <LargeSpinner className="small-spinner" />
                                                            :
                                                            <>
                                                                <i className="fa fa-pencil pointer" title="edit" onClick={() => onEdit(service)}></i>
                                                                <i className="fa fa-trash text-danger f-15 ml-2 pointer" title="remove" onClick={() => onDelete(service)}></i>
                                                            </>
                                                    }
                                                </td>
                                            </tr>
                                        );
                                    })
                                    :
                                    <tr>
                                        <td colSpan={4} className="text-center text-danger" style={{ height: '50px' }}>
                                            <i>There are no services setup for this office!</i>
                                        </td>
                                    </tr>
                                :
                                <tr>
                                    <td colSpan={4} className="text-center text-danger position-relative" style={{ height: '50px' }}>
                                        <LargeSpinner />
                                    </td>
                                </tr>
                        }
                    </tbody>
                </table>

            </div>
            <ModalComponent title={isAddMode ? 'Add Franchise Service' : `Update Service ${editingService?.name}`}
                isVisible={isModalVisible} onClose={() => { setIsModalVisible(false); setIsAddMode(false); }}>
                {
                    isModalVisible
                    && <AddUpdateFranchiseService officeId={props?.officeId} isAddMode={isAddMode} service={editingService} onSave={onSave} />
                }
            </ModalComponent>
        </div>
    );
})