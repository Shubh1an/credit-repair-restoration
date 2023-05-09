import React from 'react';

import { IStatisticsBox } from '../../../models/interfaces/dashboard';

export const StatisticsComponent = (props: IStatisticsBox) => {
    return (
        <div className="cardbox">
            <div className="statistic-box">
                <i className={props?.cssClass}></i>
                {
                    props?.count !== undefined &&
                    <div className="counter-number pull-right">
                        <span className="count-number">{props?.count}</span>
                        <span className="slight">
                            <i className="fa fa-play fa-rotate-270"> </i>
                        </span>
                    </div>
                }
                <h3> {props?.param}</h3>
            </div>
        </div >
    );
}