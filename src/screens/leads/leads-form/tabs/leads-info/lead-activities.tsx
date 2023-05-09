import React, { useState } from 'react';
import { connect } from 'react-redux';
import AuthService from '../../../../../core/services/auth.service';
import { EnumScreens } from '../../../../../models/enums';

import { MailChimpComponent } from '../../../../customer/customer-form/tabs/customer-info/components/mail-chimp';
import { MonitoringDetailsComponent } from '../../../../customer/customer-form/tabs/customer-info/components/monitoring-details';
import { S3FilesComponent } from '../../../../customer/customer-s3-files/';
import { DashboardWidget } from '../../../../dashboard/components/dashboard-widget';

const mapStateToProps = (state: any) => {
    return {
        model: state?.customerViewModel,
        AuthRules: AuthService.getScreenOject(state.sharedModel?.AuthRules, EnumScreens.ViewLeads)
    };
}
export const LeadActivitiesComponent = connect(mapStateToProps)((props: any) => {

    const [addTo, setAddTo] = useState(false);
    const [monitoringInfo, setMonitoringInfo] = useState(true);

    return (
        <div>
            <DashboardWidget title={"Activities"} allowFullscreen={true} allowMaximize={true} allowMinimize={true} reload={false} >
                <div className="row  pt-2 pb-4">
                    <div className="col-sm-9">
                        <div className="row  pt-2 pb-4">
                            {!AuthService.isFieldHidden(props.AuthRules, 'MailChimp') &&
                                <div className="col-sm-5 border-right-grad pl-4 mr-4">
                                    <div >
                                        <h5 className="mb-1">
                                            <span className="pointer " onClick={() => setAddTo(!addTo)}>
                                                Add To
                                                <i className={"fa ml-3" + (addTo ? ' fa-minus-circle ' : ' fa-plus-circle ')}></i>
                                            </span>
                                        </h5>
                                    </div>
                                    {
                                        addTo && <MailChimpComponent isReadOnly={AuthService.isFieldReadOnly(props.AuthRules, 'MailChimp')} customer={props?.creditMonitoring} />
                                    }
                                </div>
                            }
                            {!AuthService.isFieldHidden(props.AuthRules, 'MonitoringDetails') &&
                                <div className="col-sm-5">
                                    <div>
                                        <h5 className="mb-1">
                                            <span className="pointer" onClick={() => setMonitoringInfo(!monitoringInfo)}>
                                                Monitoring Details
                                                <i className={"fa ml-3" + (monitoringInfo ? ' fa-minus-circle ' : ' fa-plus-circle ')}></i>
                                            </span>
                                        </h5>
                                    </div>
                                    {
                                        monitoringInfo && <MonitoringDetailsComponent isReadOnly={AuthService.isFieldReadOnly(props.AuthRules, 'MonitoringDetails')} isLead={true} customer={props?.creditMonitoring} />
                                    }
                                </div>
                            }
                        </div>
                    </div>
                </div>
                {
                    <div className="row pt-2 pb-4 mt-4">
                        <div className="col-12">
                            <S3FilesComponent cid={props?.creditMonitoring?.id} isLead={true} />
                        </div>
                    </div>
                }
            </DashboardWidget>
        </div>
    );
});
