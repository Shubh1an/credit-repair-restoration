import React, { useEffect, useState } from 'react';
import toastr from 'toastr';
// @ts-ignore
import confirm from 'reactstrap-confirm';
import axios, { CancelTokenSource } from 'axios';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { ButtonComponent } from '../../../../../../shared/components/button';
import { LargeSpinner } from '../../../../../../shared/components/large-spinner';
import { IFranchisePayments } from '../../../../../../models/interfaces/franchise';
import { Messages } from '../../../../../../shared/constants';
import { deleteFranchisePaymentMethod, getFranchisePaymentMethods } from '../../../../../../actions/franchise.actions';
import { ModalComponent } from '../../../../../../shared/components/modal';
import { AddUpdateFranchisePaymentMethods } from './add-update-pay-method';

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        deleteFranchisePaymentMethod,
        getFranchisePaymentMethods
    }, dispatch);
}

export const FranchiseOfficePaymentComponent = connect(null, mapDispatchToProps)((props: any) => {
    const [paymethods, setPaymethods] = useState([] as IFranchisePayments[]);
    const [deletingpaymethodId, setdeletingpaymethodId] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [axiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false);
    const [editingPayment, setEditingPayment] = useState(null as IFranchisePayments | null);

    useEffect(() => {
        loadPaymentMethods();
        return () => {
            if (axiosSource.cancel) {
                axiosSource.cancel(Messages.APIAborted);
            }
        }
    }, [props?.officeId]);
    const onDelete = async (pm?: IFranchisePayments) => {
        let result = await confirm({
            title: 'Remove Record',
            message: "Are you sure you want to remove this record?",
            confirmText: "YES",
            confirmColor: "danger",
            cancelColor: "link text-secondary"
        });
        if (result) {
            setdeletingpaymethodId(pm?.id ?? '');
            setDeleting(true);
            props?.deleteFranchisePaymentMethod(props?.officeId, pm?.id, axiosSource).then((result: any) => {
                setDeleting(false);
                toastr.success(result);
                loadPaymentMethods();
                setdeletingpaymethodId('');
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setDeleting(false);
                    toastr.error(err?.response?.data);
                }
            })
        }
    }
    const loadPaymentMethods = () => {
        setLoading(true);
        props.getFranchisePaymentMethods(props?.officeId, axiosSource)
            .then((result: IFranchisePayments[]) => {
                setLoading(false);
                setPaymethods(result);
            })
            .catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setLoading(false);
                    toastr.error(err?.response?.data);
                }
            })
    }
    const onEdit = (serv: IFranchisePayments) => {
        setEditingPayment(serv);
        setIsAddMode(false);
        setIsModalVisible(true);
    }
    const onAddClick = () => {
        setEditingPayment(null);
        setIsAddMode(true);
        setIsModalVisible(true);
    }
    const onSave = () => {
        setIsModalVisible(false);
        setIsAddMode(false);
        loadPaymentMethods();
    }
    return (
        <div>
            <div className="p-2 d-flex justify-content-end mt-5">
                <ButtonComponent text="Add New Payment Method" className="btn-primary" onClick={onAddClick}>
                    <i className="fa fa-plus mr-2"></i>
                </ButtonComponent>
            </div>
            <div className="table-responsive list-scrollable custom-scrollbar  mb-5" style={{ maxHeight: (props?.isProcessingpaymethods ? '230px' : '160px') }}>
                <table className="dataTableCustomers table table-striped table-hover">
                    <thead className="back_table_color">
                        <tr className="secondary">
                            <th style={{ width: '30%' }}>Name </th>
                            <th style={{ width: '30%' }}>Flat Fee</th>
                            <th style={{ width: '30%' }}>% Fee</th>
                            <th align="center" style={{ width: '10%' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            !loading ?
                                paymethods?.length ?
                                    paymethods.map((paymethod: IFranchisePayments, index: number) => {
                                        return (

                                            <tr key={index}>
                                                <td>{paymethod?.name} </td>
                                                <td>{paymethod?.flatFee}</td>
                                                <td>{paymethod?.percentFee}</td>
                                                <td className="table-controls position-relative">
                                                    {
                                                        deleting && deletingpaymethodId === paymethod?.id ? <LargeSpinner className="small-spinner" />
                                                            :
                                                            <>
                                                                <i className="fa fa-pencil pointer" title="edit" onClick={() => onEdit(paymethod)}></i>
                                                                <i className="fa fa-trash text-danger f-15 ml-2 pointer" title="remove" onClick={() => onDelete(paymethod)}></i>
                                                            </>
                                                    }
                                                </td>
                                            </tr>
                                        );
                                    })
                                    :
                                    <tr>
                                        <td colSpan={4} className="text-center text-danger" style={{ height: '50px' }}>
                                            <i>There are no Payment Method setup for this office!</i>
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
            <ModalComponent title={isAddMode ? 'Add Payment Method' : `Update Payment Method ${editingPayment?.name}`}
                isVisible={isModalVisible} onClose={() => { setIsModalVisible(false); setIsAddMode(false); }}>
                {
                    isModalVisible
                    && <AddUpdateFranchisePaymentMethods officeId={props?.officeId} isAddMode={isAddMode} payment={editingPayment} onSave={onSave} />
                }
            </ModalComponent>
        </div>
    );
})