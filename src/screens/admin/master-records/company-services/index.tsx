import React, { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from 'axios';

import { CompanyServiceTabs } from './service-tabs';
import { IMasterService } from '../../../../models/interfaces/franchise';
import { getFranchiseOfficeAvailableServices } from '../../../../actions/franchise-services.actions';
import { Messages } from '../../../../shared/constants';

import './company-services.scss';
import { CompanyServiceCategory } from './company-service-category';
import { LargeSpinner } from '../../../../shared/components/large-spinner';

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getFranchiseOfficeAvailableServices
    }, dispatch);
}
export const CompanyWiseServices = connect(null, mapDispatchToProps)((props: any) => {

    const [loadingServices, setLoadingServices] = useState(false);
    const [firstTime, setfirstTime] = useState(true);
    const [services, setServices] = useState([] as IMasterService[]);
    const [axiosSource] = useState(axios.CancelToken.source());
    const [selectedService, setSelectedService] = useState(null as IMasterService | null);

    useEffect(() => {
        return () => {
            if (axiosSource.cancel) {
                axiosSource.cancel(Messages.APIAborted);
            }
        }
    }, [])
    useEffect(() => {
        getAllServices();
    }, [props?.officeId])

    const getAllServices = () => {
        setLoadingServices(true);
        props?.getFranchiseOfficeAvailableServices(axiosSource, props?.officeId)
            .then((result: any) => {
                setLoadingServices(false);
                setServices(result);
                if (firstTime) {
                    setSelectedService(result?.find((x: IMasterService) => x?.isSelected));
                    setfirstTime(false);
                }
            })
            .catch((result: any) => {
                if (!axios.isCancel(result)) {
                    setLoadingServices(false);
                }
            })
    }

    const onTabSelect = (serviceData: IMasterService) => {
        setSelectedService(serviceData);
    }
    const onSave = () => {
        getAllServices();
        props?.onSave();
    }
    return (
        <div className='company-services-categories'>
            <div className='tabs-sections position-relative'>
                {loadingServices && <LargeSpinner />}
                <CompanyServiceTabs onSelect={onTabSelect} loadingServices={loadingServices} selected={selectedService} services={services} />
            </div>
            <div className='selectedTabs-data'>
                <CompanyServiceCategory selectedService={selectedService} fid={props?.officeId} onSave={onSave} />
            </div>
        </div>
    )
});
