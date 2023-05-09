import React, { useEffect, useState } from 'react';
import { Spinner } from 'reactstrap';
import { LargeSpinner } from '../../../../../../../shared/components/large-spinner';


export const BureauStatsScore = (props: { customer: any, progressBar?: any, stats?: any, bureau?: string, hideScore?: boolean, previousRound?: any }) => {

    const [currentScore, setCurrentScore] = useState(null as number | null);
    const [startScore, setStartScore] = useState(0 as number);
    const [diff, setDiff] = useState(0 as number);
    const [totalAccounts, setTotalAccounts] = useState(0 as number);
    const [positive, setPositive] = useState(false as boolean);

    useEffect(() => {
        const c = getCurrentScore();
        if (c >= 0) {
            const s = getStartScore();
            const d = +(c - s).toFixed(10);
            setDiff(Math.abs(d));
            setPositive(d >= 0);
            setCurrentScore(c);
            setStartScore(s);
        }
        setTotalAccounts(getTotal());
    }, [props]);
    const getStartScore = () => {
        let count = 0;
        if (props?.customer?.scoringRounds?.length) {
            switch (props?.bureau) {
                case 'tu':
                    count = props?.customer?.scoringRounds[0]?.transUnionScore || 0
                    break;
                case 'exp':
                    count = props?.customer?.scoringRounds[0]?.experianScore || 0
                    break;
                case 'eqf':
                    count = props?.customer?.scoringRounds[0]?.equifaxScore || 0
                    break;
            }
        }
        return count;
    }
    const getCurrentScore = () => {
        let count;
        if (props?.customer?.scoringRounds?.length) {
            switch (props?.bureau) {
                case 'tu':
                    count = props?.progressBar?.currentTUScore
                    break;
                case 'exp':
                    count = props?.progressBar?.currentEXPScore
                    break;
                case 'eqf':
                    count = props?.progressBar?.currentEQFScore
                    break;
            }
        }
        return count;
    }
    const getTotal = () => {
        let count = 0;
        if (props?.stats?.stats?.length) {
            switch (props?.bureau) {
                case 'tu':
                    count = (props?.stats?.stats[0]?.tudel || 0) + (props?.stats?.stats[0]?.turem || 0) + (props?.stats?.stats[0]?.turep || 0)
                    break;
                case 'exp':
                    count = (props?.stats?.stats[0]?.expdel || 0) + (props?.stats?.stats[0]?.exprem || 0) + (props?.stats?.stats[0]?.exprep || 0)
                    break;
                case 'eqf':
                    count = (props?.stats?.stats[0]?.eqfdel || 0) + (props?.stats?.stats[0]?.eqfrem || 0) + (props?.stats?.stats[0]?.eqfrep || 0)
                    break;
            }
        }
        return count;
    }
    return (
        <>
            {
                !props?.hideScore &&
                <>
                    <div className="col-9">
                        <label>Starting Score:</label>
                    </div>
                    <div className="col-3 d-flex justify-content-start pl-0">
                        <label > {startScore}</label>
                    </div>
                    <div className="col-9">
                        <label>Current Score:</label>
                    </div>
                    <div className="col-3 position-relative pl-0 d-flex justify-content-start">
                        {
                            currentScore != undefined && currentScore != null && (currentScore as Number) >= 0 ? <>
                                <label className='current-score'>{currentScore}</label>
                                {
                                    currentScore !== startScore && <div className={'position-score ' + (positive ? 'up' : 'down')} >
                                        <span className='icon-arr'>
                                            <i className='fa fa-arrow-up'></i>
                                        </span>
                                        <span className='factor'>
                                            {diff}
                                        </span>
                                    </div>
                                }
                            </>
                                : <Spinner size={'sm'} />
                        }
                    </div>
                </>
            }
            <div className="col-9">
                <label>Total Accounts:</label>
            </div>
            <div className="col-3 d-flex justify-content-start pl-0">
                <label className="dispute-link" data-event="click" data-tip={'totalList' + "-" + props?.bureau} data-for={"tip-table"}>
                    {totalAccounts}
                </label>
            </div>
        </>
    );
}