import axios, { CancelTokenSource } from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { bindActionCreators } from 'redux';

import { disputeProgress } from '../../../../../../actions/customers.actions';
import { LargeSpinner } from '../../../../../../shared/components/large-spinner';
import { Messages } from '../../../../../../shared/constants';
import { BureauStatsComponent } from './components/bureau-stats';
import { IStat, StatsTableComponent } from './components/stats-table';

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        disputeProgress
    }, dispatch);
}

export const DisputeStatisticsComponent = connect(null, mapDispatchToProps)((props:
    { customer: any, disputeProgress: any, cid?: string, onLoad?: any }) => {

    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState(null as any);
    const [axiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);
    const [totalProgress, setTotalProgress] = useState('0' as string);

    useEffect(() => {
        return () => {
            if (axiosSource?.cancel)
                axiosSource?.cancel(Messages.APIAborted);
        }
    }, []);

    useEffect(() => {
        if (stats) {
            const totalAcc = totalAccountCount();
            const totaldeleted = totalDeletedCount();
            const totalRepaired = totalRepairedCount();
            setTotalProgress((Math.floor((((totaldeleted + totalRepaired) / totalAcc) * 100)).toString()));
        }
    }, [stats]);

    useEffect(() => {
        const custId = props?.cid;
        if (custId) {
            setLoading(true);
            props?.disputeProgress(custId, axiosSource)
                .then((result: any) => {
                    setLoading(false);
                    setStats(result);
                    props?.onLoad(result?.progressBar);
                }).catch((err: any) => {
                    if (!axios.isCancel(err)) {
                        setLoading(false);
                    }
                })
        }
    }, [props?.cid]);

    const totalAccountCount = () => {
        let count = 0;
        if (stats?.stats?.length) {

            count += (stats?.stats[0]?.tudel || 0) + (stats?.stats[0]?.turem || 0) + (stats?.stats[0]?.turep || 0)

            count += (stats?.stats[0]?.expdel || 0) + (stats?.stats[0]?.exprem || 0) + (stats?.stats[0]?.exprep || 0)

            count += (stats?.stats[0]?.eqfdel || 0) + (stats?.stats[0]?.eqfrem || 0) + (stats?.stats[0]?.eqfrep || 0)
        }
        return count;
    }
    const totalDeletedCount = () => {
        let count = 0;
        if (stats?.stats?.length) {

            count += (stats?.stats[0]?.tudel || 0);

            count += (stats?.stats[0]?.expdel || 0);

            count += (stats?.stats[0]?.eqfdel || 0);
        }
        return count;
    }
    const totalRepairedCount = () => {
        let count = 0;
        if (stats?.stats?.length) {

            count += (stats?.stats[0]?.turep || 0);

            count += (stats?.stats[0]?.exprep || 0);

            count += (stats?.stats[0]?.eqfrep || 0);
        }
        return count;
    }
    const totalRemainingCount = () => {
        let count = 0;
        if (stats?.stats?.length) {

            count += (stats?.stats[0]?.turem || 0);

            count += (stats?.stats[0]?.exprem || 0);

            count += (stats?.stats[0]?.eqfrem || 0);
        }
        return count;
    }
    const totalList = (bureau: string): IStat[] => {
        let list: any[] = [];
        switch (bureau) {
            case 'tu':
                list = list.concat(stats?.tu?.remains, stats?.tu?.repaired, stats?.tu?.deleted);
                break;
            case 'exp':
                list = list.concat(stats?.exp?.remains, stats?.exp?.repaired, stats?.exp?.deleted);
                break;
            case 'eqf':
                list = list.concat(stats?.eqf?.remains, stats?.eqf?.repaired, stats?.eqf?.deleted);
                break;
        }
        return list.map((item: any) => {
            return {
                title: item?.collectorName,
                status: item ? item[bureau + 'Outcome'] : '',
                round: item?.scoringRound,
            };
        })
    }
    const deletedList = (bureau: string): IStat[] => {
        let list: any[] = [];
        switch (bureau) {
            case 'tu':
                list = list.concat(stats?.tu?.deleted);
                break;
            case 'exp':
                list = list.concat(stats?.exp?.deleted);
                break;
            case 'eqf':
                list = list.concat(stats?.eqf?.deleted);
                break;
        }
        return list.map((item: any) => {
            return {
                title: item?.collectorName,
                status: item ? item[bureau + 'Outcome'] : '',
                round: item?.scoringRound,
            };
        })
    }

    const repairedList = (bureau: string): IStat[] => {
        let list: any[] = [];
        switch (bureau) {
            case 'tu':
                list = list.concat(stats?.tu?.repaired);
                break;
            case 'exp':
                list = list.concat(stats?.exp?.repaired);
                break;
            case 'eqf':
                list = list.concat(stats?.eqf?.repaired);
                break;
        }
        return list.map((item: any) => {
            return {
                title: item?.collectorName,
                status: item ? item[bureau + 'Outcome'] : '',
                round: item?.scoringRound,
            };
        })
    }

    const remainingList = (bureau: string): IStat[] => {
        let list: any[] = [];
        switch (bureau) {
            case 'tu':
                list = list.concat(stats?.tu?.remains);
                break;
            case 'exp':
                list = list.concat(stats?.exp?.remains);
                break;
            case 'eqf':
                list = list.concat(stats?.eqf?.remains);
                break;
        }
        return list.map((item: any) => {
            return {
                title: item?.collectorName,
                status: item ? item[bureau + 'Outcome'] : '',
                round: item?.scoringRound,
            };
        })
    }
    const getDynamicList = (type: string) => {
        switch (type) {
            case 'total':
                return {
                    title: 'Total Accounts',
                    tu: totalList('tu'),
                    exp: totalList('exp'),
                    eqf: totalList('eqf')
                }
            case 'remaining':
                return {
                    title: 'Total Remaining Accounts',
                    tu: remainingList('tu'),
                    exp: remainingList('exp'),
                    eqf: remainingList('eqf')
                }
            case 'repaired':
            case 'deleted':
                return {
                    title: 'Total Deleted/Repaired Accounts',
                    tu: repairedList('tu').concat(deletedList('tu')),
                    exp: repairedList('exp').concat(deletedList('exp')),
                    eqf: repairedList('eqf').concat(deletedList('eqf'))
                }
            default:
                break;
        }
    }
    const getDynamicToolTipInner = (typeBureau: string) => {
        let list: any[] = [];
        const type = typeBureau?.split('-')[0];
        const bureau = typeBureau?.split('-')[1];
        switch (type) {
            case 'totalList':
                list = totalListInner(bureau);
                break;
            case 'repairedList':
            case 'deletedList':
                list = deletedListInner(bureau).concat(repairedListInner(bureau));
                break;
            case 'remainingList':
                list = remainingListInner(bureau);
                break;
        }
        return (list);
    }
    const totalListInner = (bureau: string): IStat[] => {
        let list: any[] = [];
        switch (bureau) {
            case 'tu':
                list = list.concat(stats?.tu?.remains, stats?.tu?.repaired, stats?.tu?.deleted);
                break;
            case 'exp':
                list = list.concat(stats?.exp?.remains, stats?.exp?.repaired, stats?.exp?.deleted);
                break;
            case 'eqf':
                list = list.concat(stats?.eqf?.remains, stats?.eqf?.repaired, stats?.eqf?.deleted);
                break;
        }
        return list.map((item: any) => {
            return {
                title: item?.collectorName,
                status: item && item[bureau + 'Outcome'] ? item[bureau + 'Outcome'] : '',
                round: item?.scoringRound,
            };
        })
    }
    const deletedListInner = (bureau: string): IStat[] => {
        let list: any[] = [];
        switch (bureau) {
            case 'tu':
                list = list.concat(stats?.tu?.deleted);
                break;
            case 'exp':
                list = list.concat(stats?.exp?.deleted);
                break;
            case 'eqf':
                list = list.concat(stats?.eqf?.deleted);
                break;
        }
        return list.map((item: any) => {
            return {
                title: item?.collectorName,
                status: item && item[bureau + 'Outcome'] ? item[bureau + 'Outcome'] : '',
                round: item?.scoringRound,
            };
        })
    }
    const repairedListInner = (bureau: string): IStat[] => {
        let list: any[] = [];
        switch (bureau) {
            case 'tu':
                list = list.concat(stats?.tu?.repaired);
                break;
            case 'exp':
                list = list.concat(stats?.exp?.repaired);
                break;
            case 'eqf':
                list = list.concat(stats?.eqf?.repaired);
                break;
        }
        return list.map((item: any) => {
            return {
                title: item?.collectorName,
                status: item && item[bureau + 'Outcome'] ? item[bureau + 'Outcome'] : '',
                round: item?.scoringRound,
            };
        })
    }
    const remainingListInner = (bureau: string): IStat[] => {
        let list: any[] = [];
        switch (bureau) {
            case 'tu':
                list = list.concat(stats?.tu?.remains);
                break;
            case 'exp':
                list = list.concat(stats?.exp?.remains);
                break;
            case 'eqf':
                list = list.concat(stats?.eqf?.remains);
                break;
        }
        return list.map((item: any) => {
            return {
                title: item?.collectorName,
                status: item && item[bureau + 'Outcome'] ? item[bureau + 'Outcome'] : '',
                round: item?.scoringRound,
            };
        })
    }

    return (
        <div className="position-relative bg-white p-4">
            {loading && <LargeSpinner />}
            <ReactTooltip id={"tip-table"}
                getContent={(dataTip: any) => {
                    return (
                        <div className="text-left">
                            <StatsTableComponent list={getDynamicToolTipInner(dataTip)} />
                        </div>
                    )
                }}
                clickable={true} className="go-to-menu-theme2"
                place={'right'} effect='solid'  >
            </ReactTooltip>
            <ReactTooltip id={"tip-second-table"} clickable={true} className="go-to-menu-theme2"
                place={'right'} effect='solid'
                getContent={(dataTip: any) => {
                    const data = getDynamicList(dataTip);
                    return (
                        <>
                            <h4 className="text-center mb-2">{data?.title}</h4>
                            <div className="custom-scrollbar" style={{ maxHeight: '300px' }}>
                                <div className="tu-head text-center">
                                    TranUnion({data?.tu?.length})
                                </div>
                                <StatsTableComponent list={data?.tu} />
                                <div className="exp-head text-center mt-3">
                                    Experian({data?.exp?.length})
                                </div>
                                <StatsTableComponent list={data?.exp} />
                                <div className="eq-head text-center mt-3">
                                    Equifax({data?.eqf?.length})
                                </div>
                                <StatsTableComponent list={data?.eqf} />
                            </div>
                        </>
                    );
                }}
            >

            </ReactTooltip>
            <div className="row">
                <div className="col-12 col-sm-4 ">
                    <BureauStatsComponent {...props} stats={stats} title="TransUnion" bureau="tu" headClass="tu-head" />
                </div>
                <div className="col-12 col-sm-4">
                    <BureauStatsComponent {...props} stats={stats} title="Experian" bureau="exp" headClass="exp-head" />
                </div>
                <div className="col-12 col-sm-4">
                    <BureauStatsComponent {...props} stats={stats} title="Equifax" bureau="eqf" headClass="eq-head" alignRight={true} />
                </div>
            </div>
            <br />
            <div className="row mt-4">
                <div className="col-12 col-sm-4">
                    <div className="row">

                        <div className="col-9">
                            <label>Total Accounts:</label>
                        </div>
                        <div className="col-3">
                            <label className="dispute-link" data-event="click" data-tip={"total"} data-for={"tip-second-table"}>
                                {totalAccountCount()}
                            </label>
                        </div>
                        <div className="col-9">
                            <label>Total Deleted/Repaired Accounts:</label>
                        </div>
                        <div className="col-3">
                            <label className="dispute-link" data-event="click" data-tip={"deleted"} data-for={"tip-second-table"}>
                                {totalDeletedCount() + totalRepairedCount()}
                            </label>
                        </div>
                        <div className="col-9">
                            <label>Total Remaining Accounts:</label>
                        </div>
                        <div className="col-3">
                            <label className="dispute-link" data-event="click" data-tip={"remaining"} data-for={"tip-second-table"}>
                                {totalRemainingCount()}
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12"><label>Total Progress:</label></div>
                <div className="col-12 col-sm-4">
                    <div className="progressmeter">
                        <div className="progress-meter-bar" style={{ width: totalProgress + '%' }}>{totalProgress}%</div>
                    </div>
                </div>
            </div>
            <br />
            <br />
        </div>
    );
})