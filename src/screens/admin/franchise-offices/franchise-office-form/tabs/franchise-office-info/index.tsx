import axios, { CancelTokenSource } from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { validate as uuidValidate } from 'uuid';
import toastr from 'toastr';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';
// @ts-ignore
import confirm from 'reactstrap-confirm';
import { FranchiseOfficeLogoChangeComponent } from './ofc-logo-change';

import AuthService from '../../../../../../core/services/auth.service';
import { AutoCompleteSearchTypes, EnumRoles, EnumScreens } from '../../../../../../models/enums';
import { updateFranchiseOfficeDetails, createFranchiseOfficeDetails, deleteFranchiseOffice } from '../../../../../../actions/franchise.actions';
import { IFranchiseAgent, IFranchiseOffice } from '../../../../../../models/interfaces/franchise';
import { ButtonComponent } from '../../../../../../shared/components/button';
import { ClientRoutesConstants, Messages } from '../../../../../../shared/constants';
import { WindowUtils } from '../../../../../../utils/window-utils';
import { Checkbox } from '../../../../../../shared/components/checkbox';
import { SearchCustomersComponent } from '../../../../../../shared/components/search-customers';

const mapStateToProps = (state: any) => {
    return {
        AuthRules: AuthService.getScreenOject(state.sharedModel?.AuthRules, EnumScreens.ViewFranchiseOffices)
    }
}
const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        updateFranchiseOfficeDetails,
        createFranchiseOfficeDetails,
        deleteFranchiseOffice
    }, dispatch);
}
export const CustomerFranchiseOfficeInfoComponent = connect(mapStateToProps, mapDispatchToProps)((props: {
    office: IFranchiseOffice | null, addMode?: boolean,
    updateFranchiseOfficeDetails: (payload: IFranchiseOffice, axiosSource: CancelTokenSource) => any,
    createFranchiseOfficeDetails: (payload: IFranchiseOffice, axiosSource: CancelTokenSource) => any,
    deleteFranchiseOffice: (id: string, axiosSource: CancelTokenSource) => any,
    onReloadOfficesList?: any
    agents: IFranchiseAgent[],
    AuthRules: any
}) => {

    const [formData, setFormData] = useState({} as IFranchiseOffice);
    const [axiosSource] = useState(axios.CancelToken.source());
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [redirectToNewPage, setRedirectToNewPage] = useState(false);
    const [redirectToList, setRedirectToList] = useState(false);
    const [isMain, setIsMain] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const { isMainOffice, roles } = AuthService.getCurrentJWTPayload();
        setIsMain(isMainOffice);
        setIsAdmin(roles.includes(EnumRoles.Administrator));
        return () => {
            axiosSource?.cancel(Messages.APIAborted);
        }
    }, []);

    useEffect(() => {
        if (props?.office) {
            setFormData(props?.office);
        }
    }, [props?.office]);

    const handleChange = (evt: any) => {
        const value = evt.target.value;
        setFormData({
            ...formData,
            [evt.target.name]: value
        });
    }
    const isEnabled = () => {
        return !!(formData?.name && formData?.roundDays);
    }
    const onAddUpdate = () => {
        setIsSaving(true);
        const promise$ = props?.addMode ? props?.createFranchiseOfficeDetails(formData, axiosSource) : props?.updateFranchiseOfficeDetails(formData, axiosSource);
        promise$.then((result: any) => {
            setIsSaving(false);
            if (props?.addMode) {
                if (typeof (result) !== 'string' && uuidValidate(result?.id)) {
                    toastr.success(result?.message);
                    afterSave(result.id);
                } else {
                    toastr.error(result); // username already exists
                }
            } else {
                toastr.success(result);
                afterSave(formData.id);
            }
        }).catch((err: any) => {
            if (!axios.isCancel(err)) {
                setIsSaving(false);
                toastr.error(err?.response?.data);
            }
        })
    }
    const afterSave = (id: string) => {

        if (props?.onReloadOfficesList) {
            props?.onReloadOfficesList();
        }
        if (props?.addMode) {
            setFormData({
                ...formData,
                id
            });
            setTimeout(() => {
                // redirect to customer form to edit further details
                setRedirectToNewPage(true);
            }, 0);
        }
    }
    const onDeleteOffice = async () => {
        if (props?.agents?.length) {
            toastr.error(`This office has ${props?.agents?.length} agents so cant be deleted. Remove all the agents first and then try again.`);
            return;
        }
        let result = await confirm({
            title: 'Remove Record',
            message: "Are you sure you want to delete this Company Office?",
            confirmText: "YES",
            confirmColor: "danger",
            cancelColor: "link text-secondary"
        });
        if (result) {
            setIsDeleting(true);
            props?.deleteFranchiseOffice(formData.id, axiosSource).then((result: any) => {
                setIsDeleting(false);
                toastr.success(result);
                setRedirectToList(true);
                if (props?.onReloadOfficesList) {
                    props?.onReloadOfficesList();
                }
                WindowUtils.ScrollToTop();
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setIsDeleting(false);
                    toastr.error(err?.response?.data);
                }
            })
        }
    }
    const onAgentSelect = (agent: any) => {
        setFormData({
            ...formData,
            defaultAgentId: agent?.id
        });
    }
    const onAgentChange = (val: any) => {
        if (!val) {
            setFormData({
                ...formData,
                defaultAgentId: undefined
            });
        }
    }
    return (
        <>
            {
                redirectToList && <Redirect to={ClientRoutesConstants.franchiseOffices} />
            }
            {
                redirectToNewPage && <Redirect to={(ClientRoutesConstants.franchiseOffices + '/' + formData.id)} />
            }
            <div className="tab-personal-details fran-ofc-info d-flex flex-column flex-sm-row justify-content-start justify-content-sm-around p-2 p-sm-5">
                <form className="top-form w-100 w-sm-50">
                    <div className="row">
                        <div className="col-12">
                            <div className="form-group">
                                <label className="text-orange-red">Office Name*</label>
                                <input type="text" onChange={handleChange} value={formData?.name || ''} name="name" className="form-control" placeholder="Enter Office Full Name" required={true} />
                            </div>
                        </div>
                        {
                            (isMain && isAdmin) &&
                            <div className="col-12">
                                <div className="form-group">
                                    <label>&nbsp;</label>
                                    <Checkbox text="Is Main Office?" title="Main Office?" checked={formData?.isMain || false} onChange={
                                        (data: any) => handleChange({
                                            target: {
                                                value: data.checked,
                                                name: 'isMain'
                                            }
                                        })} />
                                </div>
                            </div>
                        }

                        <div className="col-12">
                            <div className="form-group">
                                <label>&nbsp;</label>
                                <Checkbox text="CC Client Welcome Message?" title="CC Client Welcome Message?" checked={formData?.ccWelcomeMessage || false} onChange={
                                    (data: any) => handleChange({
                                        target: {
                                            value: data.checked,
                                            name: 'ccWelcomeMessage'
                                        }
                                    })} />
                            </div>
                        </div>
                        {
                            (isMain && isAdmin) &&
                            <div className="col-6 mt-3">
                                <div className="form-group form-inline">
                                    <label className='mr-2 text-orange-red'>Round Days*</label>
                                    <input type="number" onChange={handleChange} value={formData?.roundDays || ''} name="roundDays" className="form-control" placeholder="Days" required={true} />
                                </div>
                            </div>
                        }
                        {
                            (isMain && isAdmin) &&
                            <div className="col-12 mt-3">
                                <div className="form-group form-inline">
                                    <label className='mr-2 '>Default Agent</label>
                                    <div className='w-50'>
                                        <SearchCustomersComponent defaultValue={formData?.defaultAgentName} searchTypes={AutoCompleteSearchTypes.FRENCHISE_AGENT} minSearchLength={2}
                                            onSelectedData={onAgentSelect} onChange={onAgentChange} placeholder={"search agents ..."} />
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                    <div className="row mb-3 mt-5">
                        <div className="col-12 d-flex flex-column flex-sm-row justify-content-sm-between">
                            {
                                (!props?.addMode) && !AuthService.isFieldHidden(props.AuthRules, 'FranchiseOfficeRemoveButton')
                                && <ButtonComponent text="Remove Office" className="btn-danger w-100 w-sm-auto" loading={isDeleting} onClick={onDeleteOffice} >
                                    <i className="fa fa-trash mr-2"></i>
                                </ButtonComponent>
                            }
                            <div></div>
                            <ButtonComponent text="Save Details" className="btn-primary w-100 w-sm-auto mt-3 mt-sm-0" loading={isSaving} disabled={!isEnabled()} onClick={onAddUpdate} >
                                <i className="fa fa-floppy-o mr-2"></i>
                            </ButtonComponent>
                        </div>
                    </div>
                </form>
                <FranchiseOfficeLogoChangeComponent officeId={formData?.id} />
            </div>
        </>
    );
})
