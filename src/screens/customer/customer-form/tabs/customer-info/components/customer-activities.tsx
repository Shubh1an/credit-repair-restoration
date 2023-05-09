import React, { useState } from 'react';
import { connect } from 'react-redux';

import { MailChimpComponent } from './mail-chimp';
import { CommonUtils } from '../../../../../../utils/common-utils';
import { DashboardWidget } from '../../../../../dashboard/components/dashboard-widget';
import { S3FilesComponent } from '../../../../customer-s3-files/';
import { FeeInfoComponent } from './fee-info';
import { MonitoringDetailsComponent } from './monitoring-details';
import { GeneralNotesComponent } from './general-notes';
import { EnumScreens } from '../../../../../../models/enums';
import AuthService from '../../../../../../core/services/auth.service';

const mapStateToProps = (state: any) => {
    return {
        model: state?.customerViewModel,
        AuthRules: AuthService.getScreenOject(state.sharedModel?.AuthRules, EnumScreens.CustomerDetails)
    };
}
export const CustomerActivitiesComponent = connect(mapStateToProps)((props: any) => {

    const [feeInfo, setFeeInfo] = useState(false);
    const [addTo, setAddTo] = useState(false);
    const [monitoringInfo, setMonitoringInfo] = useState(true);
    const [generalNotes, setGeneralNotes] = useState(false);

    return (
        <div>
            <DashboardWidget title={"Activities"} allowFullscreen={true} allowMaximize={true} allowMinimize={true} reload={false} >
                <div className="row  pt-2 pb-4">
                    <div className="col-sm-3 border-right-grad">
                        <div>
                            <label>Client Last Login:</label> <small>{CommonUtils.getDateInMMDDYYYY(props?.customer?.lastLoginDate)}</small>
                        </div>
                        <div>
                            <label>Enrollment Date:</label> <small>{CommonUtils.getDateInMMDDYYYY(props?.customer?.dateEntered)}</small>
                        </div>
                    </div>
                    <div className="col-sm-9">
                        <div className="row  pt-2 pb-sm-4">
                            {!AuthService.isFieldHidden(props.AuthRules, 'FeeInfo') &&
                                <div className="col-sm-4 border-right-grad">
                                    <div >
                                        <h5 className="mb-1">
                                            <span className=" pointer " onClick={() => setFeeInfo(!feeInfo)}>
                                                Fee Info
                                            <i className={"fa ml-3 pointer " + (feeInfo ? ' fa-minus-circle ' : ' fa-plus-circle ')}></i>
                                            </span>
                                        </h5>
                                    </div>
                                    {
                                        feeInfo && <FeeInfoComponent isReadOnly={AuthService.isFieldReadOnly(props.AuthRules, 'FeeInfo')} customer={props?.customer} />
                                    }
                                </div>
                            }
                            {!AuthService.isFieldHidden(props.AuthRules, 'MailChimp') &&
                                <div className="col-sm-4 border-right-grad">
                                    <div >
                                        <h5 className="mb-1">
                                            <span className="pointer " onClick={() => setAddTo(!addTo)}>
                                                Add To
                                            <i className={"fa ml-3" + (addTo ? ' fa-minus-circle ' : ' fa-plus-circle ')}></i>
                                            </span>
                                        </h5>
                                    </div>
                                    {
                                        addTo && <MailChimpComponent isReadOnly={AuthService.isFieldReadOnly(props.AuthRules, 'MailChimp')} customer={props?.customer} />
                                    }
                                </div>
                            }
                            {!AuthService.isFieldHidden(props.AuthRules, 'MonitoringDetails') &&
                                <div className="col-sm-4">
                                    <div>
                                        <h5 className="mb-1">
                                            <span className="pointer" onClick={() => setMonitoringInfo(!monitoringInfo)}>
                                                Monitoring Details
                                            <i className={"fa ml-3" + (monitoringInfo ? ' fa-minus-circle ' : ' fa-plus-circle ')}></i>
                                            </span>
                                        </h5>
                                    </div>
                                    {
                                        monitoringInfo && <MonitoringDetailsComponent isReadOnly={AuthService.isFieldReadOnly(props.AuthRules, 'MonitoringDetails')} customer={props?.customer} />
                                    }
                                </div>
                            }
                        </div>
                        {!AuthService.isFieldHidden(props.AuthRules, 'GeneralNotes') &&
                            <div className="row pt-2 pb-4">
                                <div className="col-sm-4">
                                    <div>
                                        <h5 className="mb-1">
                                            <span className="pointer" onClick={() => setGeneralNotes(!generalNotes)}>
                                                General Notes
                                            <i className={"fa ml-3" + (generalNotes ? ' fa-minus-circle ' : ' fa-plus-circle ')}></i>
                                            </span>
                                        </h5>
                                    </div>
                                    {
                                        generalNotes && <GeneralNotesComponent isReadOnly={AuthService.isFieldReadOnly(props.AuthRules, 'GeneralNotes')} customer={props?.customer} />
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>
                {(!AuthService.isFieldHidden(props.AuthRules, 'CreditBlissReports') || !AuthService.isFieldReadOnly(props.AuthRules, 'CreditBlissReports')) &&
                    <div className="row pt-2 pb-4 mt-4">
                        <div className="col-12">
                            <S3FilesComponent cid={props?.customer?.id} />
                        </div>
                    </div>
                }
            </DashboardWidget>
        </div>
    );
});
