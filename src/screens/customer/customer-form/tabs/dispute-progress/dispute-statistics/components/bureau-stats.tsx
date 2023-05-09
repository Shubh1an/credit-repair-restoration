import classnames from 'classnames';
import React from 'react';
import { Chart } from "react-google-charts";
import { BureauLogoComponent } from '../../../../../../../shared/components/bureau-logo';

import { BureauStatsScore } from './bureau-scores';

export const BureauStatsComponent = (props: { customer: any, bureau?: string, stats?: any, headClass?: string, title?: string, alignRight?: boolean }) => {

    const getTotalDeletedCount = () => {
        let count = 0;
        if (props?.stats?.stats?.length) {
            switch (props?.bureau) {
                case 'tu':
                    count = (props?.stats?.stats[0]?.tudel || 0);
                    break;
                case 'exp':
                    count = (props?.stats?.stats[0]?.expdel || 0);
                    break;
                case 'eqf':
                    count = (props?.stats?.stats[0]?.eqfdel || 0);
                    break;
            }
        }
        return count;
    }
    const getTotalRepairedCount = () => {
        let count = 0;
        if (props?.stats?.stats?.length) {
            switch (props?.bureau) {
                case 'tu':
                    count = (props?.stats?.stats[0]?.turep || 0);
                    break;
                case 'exp':
                    count = (props?.stats?.stats[0]?.exprep || 0);
                    break;
                case 'eqf':
                    count = (props?.stats?.stats[0]?.eqfrep || 0);
                    break;
            }
        }
        return count;
    }
    const getTotalRemaningCount = () => {
        let count = 0;
        if (props?.stats?.stats?.length) {
            switch (props?.bureau) {
                case 'tu':
                    count = (props?.stats?.stats[0]?.turem || 0);
                    break;
                case 'exp':
                    count = (props?.stats?.stats[0]?.exprem || 0);
                    break;
                case 'eqf':
                    count = (props?.stats?.stats[0]?.eqfrem || 0);
                    break;
            }
        }
        return count;
    }

    return (
        <div className="bureau-stats ">

            <div className={"text-center pb-3 " + props?.headClass}>
                <BureauLogoComponent type={props?.bureau} size={'md'} />
            </div>
            <div className={classnames({ "border-right-grad": !props?.alignRight })}>
                <div className="row">
                    <BureauStatsScore hideScore={true} customer={props?.customer} stats={props?.stats} bureau={props?.bureau} />
                    <div className="col-9">
                        <label>Deleted/Repaired Items:</label>
                    </div>
                    <div className="col-3  justify-content-start pl-0">
                        <label className="dispute-link" data-event="click" data-tip={"deletedList" + "-" + props?.bureau} data-for={"tip-table"}>
                            {getTotalDeletedCount() + getTotalRepairedCount()}
                        </label>
                    </div>
                    <div className="col-9">
                        <label>Accounts Remaining:</label>
                    </div>
                    <div className="col-3  justify-content-start pl-0">
                        <label className="dispute-link" data-event="click" data-tip={"remainingList" + "-" + props?.bureau} data-for={"tip-table"}>
                            {getTotalRemaningCount()}
                        </label>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12"><label>Progress:</label></div>
                    <div className="col-11">
                        <div className="progressmeter">
                            <div className="progress-meter-bar"
                                style={{
                                    width: (props?.stats?.progressBar && props?.stats?.progressBar[props?.bureau + 'Progress']
                                        ? (props?.stats?.progressBar[props?.bureau + 'Progress'] + '%') : '0%')
                                }}>
                                {(props?.stats?.progressBar && props?.stats?.progressBar[props?.bureau + 'Progress'] ? props?.stats?.progressBar[props?.bureau + 'Progress'] : '0') + '%'}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row m-0 overflow-hidden">
                    <div className="col-12 p-0">
                        <Chart
                            chartType="PieChart"
                            width='250'
                            height='250'
                            data={[
                                ['Accounts', 'counts'],
                                ['Deleted', getTotalDeletedCount() + getTotalRepairedCount()],
                                ['Remains', getTotalRemaningCount()]
                            ]}
                            options={{
                                colors: ['green', 'orange'],
                                legend: { position: 'bottom' },
                                chartArea: {
                                    width: '100%'
                                }
                            }}
                            rootProps={{ 'data-testid': 'chart-' + props?.title }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}