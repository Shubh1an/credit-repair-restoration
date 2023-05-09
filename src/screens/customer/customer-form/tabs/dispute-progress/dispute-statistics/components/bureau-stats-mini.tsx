import classnames from 'classnames';
import React from 'react';

import { BureauLogoComponent } from '../../../../../../../shared/components/bureau-logo';

import { BureauStatsScore } from './bureau-scores';

export const BureauStatsMiniComponent = (props: { customer: any, progressBar?: any, bureau?: string, stats?: any, headClass?: string, title?: string, alignRight?: boolean }) => {

    return (
        <div className="bureau-stats stats-mini">
            <div className={"text-center " + props?.headClass + (props?.bureau === 'exp' ? '' : ' pb-3')}>
                <BureauLogoComponent type={props.bureau} size={'md'} />
            </div>
            <div className={classnames({ "border-right-grad": !props?.alignRight })}>
                <div className="row">
                    <BureauStatsScore progressBar={props?.progressBar} customer={props?.customer} stats={props?.stats} bureau={props?.bureau} />
                </div>
            </div>
        </div>
    );
}