import axios, { CancelTokenSource } from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Spinner } from 'reactstrap';
import { bindActionCreators } from 'redux';
import toastr from 'toastr';

import { deleteEmailTemplateOptions, getemailTemplateOptions, saveEmailTemplateOptions } from '../../../../../../actions/email-templates.actions';
import AuthService from '../../../../../../core/services/auth.service';
import { Alignment, AutoCompleteSearchTypes, EnumScreens } from '../../../../../../models/enums';
import { IEmailOption } from '../../../../../../models/interfaces/email-letters';
import { ICheckboxList } from '../../../../../../models/interfaces/shared';
import { ButtonComponent } from '../../../../../../shared/components/button';
import { IRadioCheckboxListOutpout, RadioCheckboxList } from '../../../../../../shared/components/radio-checkbox-list';
import { SearchCustomersComponent } from '../../../../../../shared/components/search-customers';
import { EmailSourceTypesList, Messages, Variables } from '../../../../../../shared/constants';


const mapStateToProps = (state: any) => {
    return {
        AuthRules: AuthService.getScreenOject(state.sharedModel?.AuthRules, EnumScreens.ViewFranchiseOffices)
    };
}
const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getemailTemplateOptions,
        saveEmailTemplateOptions,
        deleteEmailTemplateOptions,
    }, dispatch);
}

export const TemplateOptions = connect(mapStateToProps, mapDispatchToProps)((props: {
    templateId: string,
    type: string,
    getemailTemplateOptions: any,
    saveEmailTemplateOptions: any,
    deleteEmailTemplateOptions: any,
    AuthRules: any,
    reloadList?: any
}) => {

    const [selected, setSelected] = useState((EmailSourceTypesList[0]) as ICheckboxList);
    const [list, setList] = useState([] as IEmailOption[]);
    const [axiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);
    const [loading, setLoading] = useState(false as boolean);
    const [saving, setSaving] = useState(false as boolean);
    const [deleting, setDeleting] = useState(false as boolean);
    const [formData, setFormData] = useState({} as IEmailOption);
    const [deletingId, setDeletingId] = useState('');
    const [dataChanged, setDataChanged] = useState(false);

    useEffect(() => {
        if (dataChanged) {
            props?.reloadList(true);
        }
    }, [dataChanged]);
    
    useEffect(() => {
        loadItems();
        return () => {
            if (axiosSource.cancel) {
                axiosSource.cancel(Messages.APIAborted);
            }
        }
    }, [])
    const onReportTypeSelect = (data: any) => {
        setSelected(data);
        setFormData({});
    }
    const loadItems = () => {
        setLoading(true);
        props?.getemailTemplateOptions(props?.templateId, props?.type, axiosSource)
            .then((result: any) => {
                setLoading(false);
                setList(result);
            })
            .catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setLoading(false);
                    toastr.error(Messages.GenericError);
                }
            })
    }
    const onSourceSelect = (data?: any) => {
        setFormData({
            ...formData,
            ...data,
            emailId: data?.email
        });
    }
    const onDelete = (option: IEmailOption) => {
        setDeleting(true);
        setDeletingId(option?.id || '');
        props?.deleteEmailTemplateOptions(option?.id, axiosSource)
            .then((result: any) => {
                setDeleting(false);
                loadItems();
                setDataChanged(true);
            })
            .catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setDeleting(false);
                    toastr.error(Messages.GenericError);
                }
            })
    }
    const handleChange = (evt: any) => {
        const value = evt.target.value;
        setFormData({
            ...formData,
            [evt.target.name]: value
        });
    }
    const onAdd = () => {
        if (props?.type?.toLowerCase() === 'sender' && list?.length === 1) {
            toastr.error('Only one sender is allowed. Please remove from the list below and add new.');
            return;
        }
        if (!formData?.emailId) {
            toastr.error('Please enter Email id or Select an Agent from the list.');
            return;
        }
        setSaving(true);
        props?.saveEmailTemplateOptions(formData, props?.templateId, props?.type, axiosSource)
            .then((result: any) => {
                setSaving(false);
                loadItems();
                setFormData({});
                setDataChanged(true);
                toastr.success('Option Added Successfully!');
            })
            .catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setSaving(false);
                    toastr.error(Messages.GenericError);
                }
            })
    }
    return (
        <div>
            <div className="row">
                <div className='col-12 col-sm-2'></div>
                <div className="col-12 col-sm-10 form-group form-inline">
                    <h6 className="import-label pr-4 text-right">Email Source :</h6>
                    <div className="pl-0 pl-sm-3">
                        <RadioCheckboxList
                            list={EmailSourceTypesList}
                            selectedValue={selected.value}
                            groupName={'email-source'}
                            alignment={Alignment.Horizontal}
                            onChange={(data: IRadioCheckboxListOutpout) => onReportTypeSelect(data)} />
                    </div>
                </div>
                <div className='col-12 col-sm-4'></div>
                <div className='col-12 col-sm-7'>
                    <SearchCustomersComponent minSearchLength={3}
                        defaultValue={(formData?.firstName || '') + ' ' + (formData?.lastName || '')}
                        searchTypes={
                            selected.value === Variables.EmailSourceTypes.FRENCHISE_AGENT ? AutoCompleteSearchTypes.FRENCHISE_AGENT :
                                selected.value === Variables.EmailSourceTypes.REFERRAL_AGENT ? AutoCompleteSearchTypes.REFERRAL_AGENT : AutoCompleteSearchTypes.FRENCHISE_AGENT}
                        onSelectedData={onSourceSelect} placeholder="search here ..." />
                </div>
                <div className='col-12 col-sm-4'></div>
                <div className='col-12 col-sm-7 mt-2 text-center'>
                    <strong>-OR-</strong>
                </div>
                <div className='col-12 col-sm-4'></div>
                <div className='col-12 col-sm-8'>
                    <div className='d-flex manual-entry'>
                        <div className="form-group f-name">
                            <label>First Name</label>
                            <input type="text" value={formData?.firstName || ''} onChange={handleChange} name="firstName" className="form-control" placeholder="First Name" required={true} />
                        </div>
                        <div className="form-group ml-2 mr-2 l-name">
                            <label>Last Name</label>
                            <input type="text" value={formData?.lastName || ''} onChange={handleChange} name="lastName" className="form-control" placeholder="Last Name" required={true} />
                        </div>
                        <div className="form-group email-col">
                            <label className='text-orange-red'>Email*</label>
                            <input type="text" value={formData?.emailId || ''} onChange={handleChange} name="emailId" className="form-control" placeholder="Email" required={true} />
                        </div>
                    </div>
                </div>
                <div className='col-12 col-sm-11 text-right'>
                    <ButtonComponent text='Add' className="btn-primary" disabled={!formData?.emailId} loading={saving} onClick={onAdd} >
                        <i className="fa fa-plus mr-2"></i>
                    </ButtonComponent>
                </div>
                <div className='col-12 mt-4'>
                    <div className="table-responsive list-scrollable custom-scrollbar">
                        <table className="dataTableCustomers table table-striped table-hover">
                            <thead className="back_table_color">
                                <tr className="secondary">
                                    <th style={{ width: '40%' }}>Email</th>
                                    <th style={{ width: '25%' }}>First Name</th>
                                    <th style={{ width: '25%' }}>Last Name</th>
                                    <th style={{ width: '10%' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    loading ?
                                        <tr>
                                            <td colSpan={4} className="text-center" style={{ height: '50px' }}>
                                                <Spinner size={'md'} />
                                            </td>
                                        </tr>
                                        :
                                        !!list?.length ?
                                            list?.map((item: IEmailOption, index: number) => (
                                                <tr key={index}>
                                                    <td>
                                                        {item?.emailId}
                                                    </td>
                                                    <td>
                                                        {item?.firstName}
                                                    </td>
                                                    <td>
                                                        {item?.lastName}
                                                    </td>
                                                    <td className="position-relative  d-flex justify-content-end align-items-center">
                                                        {
                                                            deleting && item?.id === deletingId
                                                                ? <Spinner size={'sm'} />
                                                                : !AuthService.isFieldHidden(props.AuthRules, 'RemoveEmailOption')
                                                                && !AuthService.isFieldReadOnly(props.AuthRules, 'RemoveEmailOption')
                                                                && <i className="fa fa-trash text-danger f-15 pointer" title="remove" onClick={() => onDelete(item)}></i>
                                                        }
                                                    </td>
                                                </tr>
                                            ))
                                            :
                                            <tr>
                                                <td colSpan={4} className="text-center text-danger" style={{ height: '50px' }}>
                                                    <i>No data available.</i>
                                                </td>
                                            </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
})
