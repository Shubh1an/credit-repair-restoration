import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { IMasterService } from '../../../../models/interfaces/franchise';

export const CompanyServiceTabs = (props: {
    onSelect: any, selected: IMasterService | null,
    services: IMasterService[], loadingServices: boolean
}) => {
    const onTabSelect = (ser: IMasterService) => {
        props?.onSelect(ser)
    }
    return (
        <div className='company-service-tabs'>
            <div className={'tabs-container ' + (props?.loadingServices ? ' border-0 ' : '')}>
                {
                    props?.services?.map((ser: IMasterService, ind: number) => (
                        <div className={classNames('serv-tab', { 'active': props?.selected?.serviceId === ser?.serviceId })} key={ind} onClick={() => onTabSelect(ser)}>
                            <div className='service-data'>
                                {ser?.serviceName}
                            </div>
                            {
                                ser?.isSelected && <div className='green-tick text-success'>
                                    <i className='fa fa-2x fa-check-circle-o'></i>
                                </div>
                            }
                        </div>
                    ))
                }

            </div>
        </div>
    )
}