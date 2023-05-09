import React, { useState } from 'react';
import { connect } from 'react-redux';
import AuthService from '../../../../../../core/services/auth.service';
import { EnumScreens } from '../../../../../../models/enums';


import { DashboardWidget } from '../../../../../dashboard/components/dashboard-widget';
import { CustomerDeleteComponent } from './customer-delete';
import { CustomerSubscribeToArray } from './customer-subscribe-array';
import { CustomerSubscribeToCreditMonitoring } from './customer-subscribe-cred-monitoring';


const mapStateToProps = (state: any) => {
    return {
        AuthRules: AuthService.getScreenOject(state.sharedModel?.AuthRules, EnumScreens.CustomerDetails)
    }
}
export const CustomerOperationsComponent = connect(mapStateToProps)(((props: any) => {

    return (
        <DashboardWidget title={"Client Actions"}  >
            <div className="row pb-5 pt-0">
                <div className="col-12 col-sm-3 pr-0 mt-4">
                    {
                        !AuthService.isFieldHidden(props.AuthRules, 'CustomerArraySubscribe')
                        && !AuthService.isFieldReadOnly(props.AuthRules, 'CustomerArraySubscribe')
                        && <CustomerSubscribeToArray cid={props?.id} />
                    }
                </div>
                <div className='col-12 col-sm-1'></div>
                <div className="col-12 col-sm-4 pr-0 mt-4">
                    {
                        !AuthService.isFieldHidden(props.AuthRules, 'CustomerCreditMonitoringSubscribe')
                        && !AuthService.isFieldReadOnly(props.AuthRules, 'CustomerCreditMonitoringSubscribe')
                        && <CustomerSubscribeToCreditMonitoring cid={props?.id} />
                    }
                </div>
                <div className="col-12 mt-4"></div>
                <div className="col-12 col-sm-3 pr-0 mt-4">
                    {!AuthService.isFieldHidden(props.AuthRules, 'CustomerDelete')
                        && !AuthService.isFieldReadOnly(props.AuthRules, 'CustomerDelete')
                        && <CustomerDeleteComponent cid={props?.id} onReloadCustomersList={props?.onReloadCustomersList} />
                    }
                </div>
            </div>
        </DashboardWidget>
    );
}));
