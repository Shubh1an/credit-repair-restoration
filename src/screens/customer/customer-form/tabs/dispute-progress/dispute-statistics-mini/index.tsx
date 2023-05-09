import React from 'react';
import { connect } from 'react-redux';
import { LargeSpinner } from '../../../../../../shared/components/large-spinner';

import { BureauStatsMiniComponent } from '../dispute-statistics/components/bureau-stats-mini';

const mapStateToProps = (state: any) => {
    return {
        stats: state?.customerViewModel?.disputeStats,
        loading: state?.customerViewModel?.disputeStatsLoading
    };
}

export const DisputeStatisticsMiniComponent = connect(mapStateToProps)((props: any) => {
    return (
        <div className="position-relative bg-white p-4 shadow mb-3 rounded">
            {props?.loading && <LargeSpinner />}
            <div className="row">
                <div className="col-12 col-sm-4 ">
                    <BureauStatsMiniComponent {...props} stats={props?.stats} title="TransUnion" bureau="tu" headClass="tu-head md" />
                </div>
                <div className="col-12 col-sm-4 ">
                    <BureauStatsMiniComponent {...props} stats={props?.stats} title="Experian" bureau="exp" headClass="exp-head md" />
                </div>
                <div className="col-12 col-sm-4 ">
                    <BureauStatsMiniComponent {...props} stats={props?.stats} title="Equifax" bureau="eqf" headClass="eq-head md" alignRight={true} />
                </div>
            </div>

        </div>
    );
});
