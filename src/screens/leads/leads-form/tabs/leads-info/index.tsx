import React from 'react';

import { LeadPersonalDetailsComponent } from './leads-personal-details';
import { LeadActivitiesComponent } from './lead-activities';
import AuthService from '../../../../../core/services/auth.service';
import { EnumScreens } from '../../../../../models/enums';
import { LeadOperationsComponent } from './lead-operatons';

const mapStateToProps = (state: any) => {
    return {
        AuthRules: AuthService.getScreenOject(state.sharedModel?.AuthRules, EnumScreens.ViewLeads)
    }
}
export const LeadsInfoComponent = ((props: any) => {
    return (
        <div className="tab-personal-details">
            <LeadPersonalDetailsComponent addMode={props?.addMode} onReloadLeadsList={props.onReloadLeadsList} customer={props?.lead?.lead} creditMonitoring={props?.lead?.creditMonitoring} />
            {!props?.addMode && !!props?.lead?.lead &&
                <>
                    <LeadActivitiesComponent
                        customer={props?.lead?.lead}
                        creditMonitoring={
                            {
                                ...props?.lead?.creditMonitoring,
                                cbRefreshTok: props?.lead?.lead?.cbRefreshTok,
                                id: props?.lead?.lead?.id,
                                email: props?.lead?.lead?.email
                            }}
                    />
                    {
                        !AuthService.isFieldHidden(props.AuthRules, 'LeadActions')
                        && !AuthService.isFieldReadOnly(props.AuthRules, 'LeadActions')
                        && <LeadOperationsComponent id={props?.lead?.lead?.id} onReloadLeadsList={props?.onReloadLeadsList} />
                    }
                </>
            }
        </div>
    );
})
