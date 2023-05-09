import React from 'react';
import { connect } from 'react-redux';

import AuthService from '../../../../../core/services/auth.service';
import { EnumScreens } from '../../../../../models/enums';
import { DashboardWidget } from '../../../../dashboard/components/dashboard-widget';
import { LeadDeleteComponent } from './lead-delete';
import { LeadSubscribeToArray } from './lead-subscribe-array';
import { LeadSubscribeToCreditMonitoring } from './lead-subscribe-cm';


const mapStateToProps = (state: any) => {
    return {
        AuthRules: AuthService.getScreenOject(state.sharedModel?.AuthRules, EnumScreens.ViewLeads)
    }
}
export const LeadOperationsComponent = connect(mapStateToProps)(((props: any) => {

    return (
        <DashboardWidget title={"Lead Actions"}  >
            <div className="row pb-5 pt-0">
                <div className="col-12 col-sm-3 pr-0 mt-4">
                    {
                        !AuthService.isFieldHidden(props.AuthRules, 'LeadArraySubscribe')
                        && !AuthService.isFieldReadOnly(props.AuthRules, 'LeadArraySubscribe')
                        && <LeadSubscribeToArray cid={props?.id} />
                    }
                </div>
                <div className='col-12 col-sm-1'></div>
                <div className="col-12 col-sm-4 pr-0 mt-4">
                    {
                        !AuthService.isFieldHidden(props.AuthRules, 'LeadCreditMonitoringSubscribe')
                        && !AuthService.isFieldReadOnly(props.AuthRules, 'LeadCreditMonitoringSubscribe')
                        && <LeadSubscribeToCreditMonitoring cid={props?.id} />
                    }
                </div>
                <div className="col-12 mt-4"></div>
                <div className="col-12 col-sm-3 pr-0 mt-4">
                    {!AuthService.isFieldHidden(props.AuthRules, 'LeadDelete')
                        && !AuthService.isFieldReadOnly(props.AuthRules, 'LeadDelete')
                        && <LeadDeleteComponent cid={props?.id} onReloadLeadsList={props?.onReloadLeadsList} />
                    }
                </div>
            </div>
        </DashboardWidget>
    );
}));
