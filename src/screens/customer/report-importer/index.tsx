
import React from 'react';
import { useParams } from 'react-router-dom';

import './importer.scss';
import { EnumScreens } from '../../../models/enums';
import { NavigationOptions } from '../../../shared/components/navigation-options';
import { ClientRoutesConstants, Messages } from '../../../shared/constants';
import { withAuthorize } from '../../../shared/hoc/authorize';
import { DashboardWidget } from '../../dashboard/components/dashboard-widget';
import { ImportReportComponent } from './components/import-report';
import { ScrollToTopComponent } from '../../../shared/components/scroll-top';

const ReportImporter = (props: any) => {

    const params = useParams() as { cid: string };

    return (
        <>
            <div className="report-importer">
                <section className="content-header row">
                    <div className="col-12 col-sm-10">
                        <div className="header-icon">
                            <i className="fa fa-cloud-upload"></i>
                        </div>
                        <div className="header-title">
                            <h1>Credit Report Importer</h1>
                            <small>Import Credit Reports here..</small>
                        </div>
                    </div>
                    <div className="col-12 col-sm-2 pt-3 p-0 pl-5 pl-sm-0">
                        <NavigationOptions label="Navigation Options" current={ClientRoutesConstants.reportImporter} cid={params.cid} />
                    </div>
                </section>
                <section className="content">
                    <div className="row">
                        <div className="col-12 mb-5" style={{ minHeight: '500px' }}>
                            <DashboardWidget className="all-accounts-list" title={'Credit Report Importer'}
                                allowFullscreen={true} allowMaximize={true} allowMinimize={true} reload={false}  >
                                <ImportReportComponent />
                            </DashboardWidget>
                        </div>
                    </div>
                </section>
            </div>
            <ScrollToTopComponent />
        </>
    );
}

export default withAuthorize(ReportImporter, EnumScreens.ReportImporter);