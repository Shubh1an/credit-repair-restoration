import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import toastr from 'toastr';
import { Redirect } from 'react-router-dom';
// @ts-ignore
import confirm from 'reactstrap-confirm';

import { DashboardWidget } from '../../../../../dashboard/components/dashboard-widget';
import { ClientRoutesConstants, Messages } from '../../../../../../shared/constants';
import AuthService from '../../../../../../core/services/auth.service';
import { EnumScreens } from '../../../../../../models/enums';
import { deleteFranchiseAgent } from "../../../../../../actions/franchise.actions";
import { AddUpdateFranchiseAgent } from '../../../../franchise-offices/franchise-office-form/tabs/agents/add-update-agent';


const mapStateToProps = (state: any) => {
    return {
        statuses: state.customerViewModel?.statuses,
        states: state.customerViewModel?.states,
        AuthRules: AuthService.getScreenOject(state.sharedModel?.AuthRules, EnumScreens.CustomerDetails)
    };
}
const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        deleteFranchiseAgent
    }, dispatch);
}
export const PersonalDetailsComponent = connect(mapStateToProps, mapDispatchToProps)(
    (props: any) => {

        const [axiosSource] = useState(axios.CancelToken.source());
        const [isDeleting, setIsDeleting] = useState(false);
        const [redirectToNewPage, setRedirectToNewPage] = useState(false);
        const [redirectToList, setRedirectToList] = useState(false);
        const [id, setId] = useState(props?.agent?.id as string);

        useEffect(() => {
            return () => {
                axiosSource?.cancel(Messages.APIAborted);
            }
        }, []);

        const onDelete = async (id: string) => {
            let result = await confirm({
                title: 'Remove Record',
                message: "Are you sure you want to delete this Company Agent?",
                confirmText: "YES",
                confirmColor: "danger",
                cancelColor: "link text-secondary"
            });
            if (result) {
                setIsDeleting(true);
                props?.deleteFranchiseAgent(props?.agent, axiosSource).then((result: any) => {
                    setIsDeleting(false);
                    toastr.success(result);
                    props?.onReloadList();
                    setRedirectToNewPage(true);
                    setRedirectToList(true);
                }).catch((err: any) => {
                    if (!axios.isCancel(err)) {
                        setIsDeleting(false);
                        toastr.error(err?.response?.data);
                    }
                })
            }
        }
        const afterSaveUpdate = (idd: string) => {
            props?.onReloadList();
            setId(idd);
            if (props.addMode) {
                setRedirectToNewPage(true);
            }
        }
        return (
            !redirectToNewPage ?
                <div className="tab-personal-details">
                    {

                        (!props?.addMode ? !!props?.agent : true) &&
                        <DashboardWidget title={"Personal Details"} allowFullscreen={true} allowMaximize={true} allowMinimize={true} reload={false} >
                            <AddUpdateFranchiseAgent {...props} onSave={afterSaveUpdate} isAddMode={props?.addMode} isDeleting={isDeleting} onDelete={onDelete} />
                        </DashboardWidget>
                    }
                </div >
                : (
                    redirectToList ? <Redirect to={ClientRoutesConstants.franchiseAgents} /> :
                        <Redirect to={ClientRoutesConstants.franchiseAgents + '/' + id} />
                )
        );
    });
