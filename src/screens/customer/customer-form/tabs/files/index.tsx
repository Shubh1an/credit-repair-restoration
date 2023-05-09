import axios, { CancelTokenSource } from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
// @ts-ignore
import confirm from 'reactstrap-confirm';
import toastr from 'toastr';
import { connect } from 'react-redux';

import { ICustomerFullDetails, IFile } from '../../../../../models/interfaces/customer-view';
import { ButtonComponent } from '../../../../../shared/components/button';
import { Checkbox } from '../../../../../shared/components/checkbox';
import { DashboardWidget } from '../../../../dashboard/components/dashboard-widget';
import { removeFiles } from '../../../../../actions/customers.actions';
import { Messages } from '../../../../../shared/constants';
import { LargeSpinner } from '../../../../../shared/components/large-spinner';
import { ModalComponent } from '../../../../../shared/components/modal';
import { EditFileComponent } from './components/edit-file'
import { UploadFileComponent } from './components/upload-file'
import { FileDownload } from '../../../../../shared/components/file-download';
import { EnumScreens } from '../../../../../models/enums';
import AuthService from '../../../../../core/services/auth.service';


const mapStateToProps = (state: any) => {
    return {
        AuthRules: AuthService.getScreenOject(state.sharedModel?.AuthRules, EnumScreens.CustomerDetails)
    };
}

export const FilesComponent = connect(mapStateToProps)(((props: any) => {

    const [customer, setCustomer] = useState({} as ICustomerFullDetails);
    const [axiosSource] = useState({} as CancelTokenSource);
    const [loading, setLoading] = useState(false);
    const [allChecked, setAllChecked] = useState(false);
    const [checkedCount, setcheckedCount] = useState(0);
    const [singleLoading, setSingleLoading] = useState(false);
    const [deletingId, setdeletingId] = useState('');
    const [editingFile, setEditingFile] = useState(null as any);
    const [editModalVisible, seteditModalVisible] = useState(false);
    const [uploadingFileModal, setuploadingFileModal] = useState(false);

    useEffect(() => {
        setCustomer(props?.customer);
        setcheckedCount(0);
        setAllChecked(false);
    }, [props?.customer]);

    const onAllChecked = (checked: boolean) => {
        setcheckedCount(checked ? customer?.files?.length : 0);
        setCustomer({
            ...customer,
            files: [
                ...customer?.files?.map((file: IFile) => {
                    return {
                        ...file,
                        checked
                    }
                })]
        });
    }
    const onEdit = (file: IFile) => {
        setEditingFile(file);
        seteditModalVisible(true);
    }
    const onDelete = async (file: IFile) => {
        let result = await confirm({
            title: 'Remove File',
            message: "Are you sure you want to remove this " + file?.name + " file?",
            confirmText: "YES",
            confirmColor: "danger",
            cancelColor: "link text-secondary"
        });
        if (result) {
            setdeletingId(file.id);
            setSingleLoading(true);
            await removeFiles(file?.id, axiosSource, props?.isLead, props?.customer?.id)
                .then((result: any) => {
                    setSingleLoading(false);
                    toastr.success(file?.name + ' File removed successfully!!');
                    props?.onReloadCustomer();
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
    const onDeleteAll = async () => {
        let result = await confirm({
            title: 'Remove Multiple Files',
            message: "Are you sure you want to remove selected "
                + (checkedCount === customer?.files?.length ? 'All' : checkedCount)
                + " file" + ((checkedCount > 1) ? 's' : '') + "?",
            confirmText: "YES",
            confirmColor: "danger",
            cancelColor: "link text-secondary"
        });
        if (result) {
            const ids = customer?.files?.filter(x => x.checked).map(x => x.id)?.join(',');
            if (!ids) {
                return;
            }
            setLoading(true);
            removeFiles(ids, axiosSource, props?.isLead, props?.customer?.id)
                .then((result: any) => {
                    setLoading(false);
                    toastr.success(checkedCount + ' File' + ((checkedCount > 1) ? 's' : '') + ' deleted successfully!!');
                    props?.onReloadCustomer();
                })
                .catch((err: any) => {
                    if (!axios.isCancel(err)) {
                        setLoading(false);
                        toastr.error(err?.response?.data || Messages.GenericError);
                    }
                })
        }
    }
    const onFileChecked = (file: IFile, checked: boolean) => {

        setcheckedCount(checked ? checkedCount + 1 : checkedCount - 1);
        if (!checked) {
            setAllChecked(false);
        }
        setCustomer({
            ...customer,
            files: [
                ...customer?.files?.map((f: IFile) => {
                    return {
                        ...f,
                        checked: f.id === file.id ? checked : f.checked
                    }
                })]
        });
    }
    return (
        <DashboardWidget title={props?.isLead ? 'Lead Documents' : 'Customer Documents'} allowFullscreen={true} allowMaximize={true} allowMinimize={true} reload={false} >
            <div className="files-list">
                <div className="p-2">
                    {
                        checkedCount > 0 &&
                        (props?.isLead ? !AuthService.isFieldHidden(props.AuthRules, 'RemoveLeadFile') : !AuthService.isFieldHidden(props.AuthRules, 'RemoveCustomerFile'))
                        &&
                        <ButtonComponent disabled={(props?.isLead ? AuthService.isFieldReadOnly(props.AuthRules, 'RemoveLeadFile') :
                            AuthService.isFieldReadOnly(props.AuthRules, 'RemoveCustomerFile'))} text={"Delete " + `(${checkedCount})`} loading={loading} className="btn-danger pull-left" onClick={onDeleteAll} >
                            <i className="fa fa-trash mr-2"></i>
                        </ButtonComponent>
                    }
                    {(props?.isLead ? !AuthService.isFieldHidden(props.AuthRules, 'UploadLeadFile') : !AuthService.isFieldHidden(props.AuthRules, 'UploadCustomerFile')) &&
                        <ButtonComponent disabled={AuthService.isFieldReadOnly(props.AuthRules, 'UploadCustomerFile')} text="Document Upload" className="btn-success pull-right" onClick={() => setuploadingFileModal(true)} >
                            <i className="fa fa-upload mr-2"></i>
                        </ButtonComponent>
                    }
                    <div className="clearfix"></div>
                </div>
                <div className="table-responsive list-scrollable custom-scrollbar">
                    <table className="dataTableCustomers table table-striped table-hover">
                        <thead className="back_table_color">
                            <tr className="secondary">
                                <th style={{ width: '4%' }}>
                                    {
                                        !!customer?.files?.length
                                        && (props?.isLead ? !AuthService.isFieldHidden(props.AuthRules, 'RemoveLeadFile') : !AuthService.isFieldHidden(props.AuthRules, 'RemoveCustomerFile')) &&
                                        <Checkbox text="" checked={allChecked} onChange={(data: any) => { setAllChecked(data?.checked); onAllChecked(data?.checked); }} />
                                    }
                                </th>
                                <th style={{ width: '4%' }}>Download</th>
                                <th style={{ width: '10%' }}>Name</th>
                                <th style={{ width: '15%' }}>Description</th>
                                <th style={{ width: '10%' }}>Type</th>
                                <th style={{ width: '10%' }}>Date Entered</th>
                                <th style={{ width: '4%' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                customer?.files?.length ?
                                    customer?.files?.map((file: IFile, index: number) => {
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    {
                                                        (props?.isLead ? !AuthService.isFieldHidden(props.AuthRules, 'RemoveLeadFile') : !AuthService.isFieldHidden(props.AuthRules, 'RemoveCustomerFile')) &&
                                                        <Checkbox text="" checked={!!file?.checked} onChange={(data: any) => onFileChecked(file, data?.checked)} />
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        (props?.isLead ? !AuthService.isFieldHidden(props.AuthRules, 'DownloadLeadFile')
                                                            : !AuthService.isFieldHidden(props.AuthRules, 'DownloadCustomerFile')) &&
                                                        (props?.isLead ? !AuthService.isFieldReadOnly(props.AuthRules, 'DownloadLeadFile') :
                                                            !AuthService.isFieldReadOnly(props.AuthRules, 'DownloadCustomerFile')) &&
                                                        <FileDownload filePath={file?.pathLocation} />
                                                    }
                                                </td>
                                                <td>
                                                    {file?.name}
                                                </td>
                                                <td>
                                                    {file?.description}
                                                </td>
                                                <td>
                                                    {file?.type}
                                                </td>
                                                <td>
                                                    {moment(file?.dateEntered).format("MM/DD/YYYY")}
                                                </td>
                                                <td className="position-relative  d-flex justify-content-around">
                                                    {
                                                        singleLoading && deletingId === file?.id ? <LargeSpinner className="small-spinner" />
                                                            : <>
                                                                {(props?.isLead ? !AuthService.isFieldHidden(props.AuthRules, 'EditLeadFile') : !AuthService.isFieldHidden(props.AuthRules, 'EditCustomerFile'))
                                                                    && (props?.isLead ? !AuthService.isFieldReadOnly(props.AuthRules, 'EditLeadFile') : !AuthService.isFieldReadOnly(props.AuthRules, 'EditCustomerFile'))
                                                                    && <i className="fa fa-pencil pointer" title="edit" onClick={() => onEdit(file)}></i>}
                                                                {(props?.isLead ? !AuthService.isFieldHidden(props.AuthRules, 'RemoveLeadFile') : !AuthService.isFieldHidden(props.AuthRules, 'RemoveCustomerFile'))
                                                                    && (props?.isLead ? !AuthService.isFieldReadOnly(props.AuthRules, 'RemoveLeadFile') : !AuthService.isFieldReadOnly(props.AuthRules, 'RemoveCustomerFile'))
                                                                    && <i className="fa fa-trash text-danger f-15 pointer" title="remove" onClick={() => onDelete(file)}></i>}
                                                            </>
                                                    }
                                                </td>
                                            </tr>
                                        );
                                    })
                                    :
                                    <tr>
                                        <td colSpan={7} className="text-center text-danger" style={{ height: '50px' }}>
                                            <i>No Files available.</i>
                                        </td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <ModalComponent title={'Document Upload'} halfFullScreen={true} isVisible={editModalVisible} onClose={() => seteditModalVisible(false)}>
                <EditFileComponent file={editingFile} isLead={props?.isLead}
                    onSuccess={() => {
                        props?.onReloadCustomer();
                        seteditModalVisible(false);
                    }}
                    onClose={() => {
                        seteditModalVisible(false);
                    }} />
            </ModalComponent>
            <ModalComponent title={'Document Upload'}  halfFullScreen={true} isVisible={uploadingFileModal} onClose={() => setuploadingFileModal(false)}>
                <UploadFileComponent action={!props?.isLead ? "upload" : "queueupload"} cid={customer?.id} onSuccess={() => {
                    props?.onReloadCustomer();
                    setuploadingFileModal(false);
                }} />
            </ModalComponent>
        </DashboardWidget>
    );
}));