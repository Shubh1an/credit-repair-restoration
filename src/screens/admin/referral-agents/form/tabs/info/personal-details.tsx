import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { DashboardWidget } from '../../../../../dashboard/components/dashboard-widget';
import { ClientRoutesConstants } from '../../../../../../shared/constants';
import AuthService from '../../../../../../core/services/auth.service';
import { EnumScreens } from '../../../../../../models/enums';
import { AddUpdateReferralAgent } from '../../../../referral-offices/form/tabs/agents/add-update-agent';


const mapStateToProps = (state: any) => {
    return {
        AuthRules: AuthService.getScreenOject(state.sharedModel?.AuthRules, EnumScreens.ViewReferralAgents)
    };
}

export const PersonalDetailsComponent = connect(mapStateToProps)(
    (props: any) => {

        const [redirectToList, setRedirectToList] = useState(false);
        const [redirectToNewPage, setRedirectToNewPage] = useState(false);
        const [id, setId] = useState('' as string);

        const onDelete = () => {
            setRedirectToList(true);
            if (props?.onReloadList) {
                props?.onReloadList();
            }
        }
        const onAgentAdd = (newid: string) => {
            setId(newid);
            if (props?.onReloadList) {
                props?.onReloadList();
            }
            setRedirectToNewPage(true);
        }
        return (
            <>
                {
                    !redirectToList ?
                        <div className="tab-personal-details">
                            {
                                (!props?.addMode ? !!props?.agent : true) &&
                                <DashboardWidget title={"Personal Details"} allowFullscreen={true} allowMaximize={true} allowMinimize={true} reload={false} >
                                    <AddUpdateReferralAgent allowOfficeEdit={true} allowDelete={props?.allowDelete} onDelete={onDelete} onSave={onAgentAdd} isAddMode={!!props?.addMode} agent={props?.agent} officeId={props?.agent?.office?.id} />
                                </DashboardWidget>
                            }
                        </div >
                        : <Redirect to={ClientRoutesConstants.referralAgents} />
                }
                {
                    redirectToNewPage ? <Redirect to={ClientRoutesConstants.referralAgents + '/' + id} /> : ''
                }
            </>
        );
    });
