import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Spinner } from 'reactstrap';
import { bindActionCreators } from 'redux';
import toastr from 'toastr';

import { getServicePricingMasterData, masterGetFranchiseServiceLevels, masterGetFranchiseServiceOptions, masterGetFranchiseServices, saveServicePricingMasterData } from '../../../../actions/franchise-services.actions';
import { IMasterService, IMasterServiceAdOns, IMasterServiceLevel, IServiceCategory, IServiceLevel } from '../../../../models/interfaces/franchise';
import { ButtonComponent } from '../../../../shared/components/button';
import { Messages } from '../../../../shared/constants';
import { ServiceCategoriesComponent } from './service-category';


const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        masterGetFranchiseServiceOptions,
        masterGetFranchiseServiceLevels,
        masterGetFranchiseServices,
        getServicePricingMasterData,
        saveServicePricingMasterData,
    }, dispatch);
}
export const ServiceMappingComponent = connect(null, mapDispatchToProps)((props: any) => {

    const [service, setService] = useState(null as IMasterService | null);
    const [services, setServices] = useState([] as IMasterService[]);
    const [levels, setLevels] = useState([] as IMasterServiceLevel[]);
    const [options, setOptions] = useState([] as IMasterServiceAdOns[]);
    const [categories, setCategories] = useState(null as IServiceCategory[] | null);
    const [axiosSource] = useState(axios.CancelToken.source());

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);


    useEffect(() => {
        getServicesData();
        return () => {
            axiosSource.cancel(Messages.APIAborted);
        }
    }, [])

    const getServicesData = () => {
        setLoading(true);
        axios.all([
            props?.masterGetFranchiseServices(axiosSource),
            props?.masterGetFranchiseServiceLevels(axiosSource),
            props?.masterGetFranchiseServiceOptions(axiosSource),
        ])
            .then((responses: any[][]) => {
                setLoading(false);
                setServices(responses[0]);
                setLevels(responses[1]);
                setOptions(responses[2]);
            })
            .catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setLoading(false);
                    toastr.error(Messages.GenericError);
                }
            })
    }
    const onServiceChange = (serviceId: string) => {
        setService(services?.find((x: IMasterService) => x?.serviceId === serviceId) || null);
        setLoading(true);
        setCategories([]);
        props?.getServicePricingMasterData(serviceId, levels, options, axiosSource)
            .then((result: any) => {
                setLoading(false);
                setCategories(result?.categories);
            })
            .catch((e: any) => {
                if (!axios.isCancel(e)) {
                    setLoading(false);
                }
            })
    }
    const onCategoryChange = (categories: IServiceCategory[]) => {
        setCategories(categories);
    }
    const onAddClick = () => {
        const mappedObj = categories?.map(x => ({
            ...x,
            categoryName: x?.category,
            servicePricingLevels: x?.levels?.map(m => ({
                ...m, serviceLevelId: m?.level?.serviceLevelId,
                serviceAddOns: (m as IServiceLevel)?.options?.map(n => ({ ...n, serviceAddOnId: (n as any)?.option?.serviceAddOnId }))
            }))
        }));
        mappedObj?.forEach((c: any) => {
            delete c?.levels;
            delete c?.category;
            c?.servicePricingLevels?.forEach((l: any) => {
                delete l?.level;
                delete l?.options;
                l?.serviceAddOns?.forEach((s: any) => {
                    delete s?.option;
                })
            })
        })
        const payload = {
            serviceId: service?.serviceId,
            categories: mappedObj
        }
        setSaving(true);
        props?.saveServicePricingMasterData(payload, axiosSource)
            .then((result: string) => {
                setSaving(false);
                toastr.success(result);
            }).catch((e: any) => {
                if (!axios.isCancel(e)) {
                    setSaving(false);
                    toastr.error(Messages.GenericError);
                }
            })
    }
    return (<div className='service-mappings w-100'>
        <div className='row'>
            <div className='col-12 col-sm-1 text-right pr-4 f-18'>
                <label className='f-18'>Service*</label>
            </div>
            <div className='col-12 col-sm-3 pl-4'>
                <div className="form-group">
                    <select value={service?.serviceId || ''} disabled={loading || saving} onChange={(ev) => onServiceChange(ev?.target?.value)} className="form-control input-lg" >
                        <option value={''}>-Select-</option>
                        {
                            services?.map((item: IMasterService) => {
                                return (<option key={item.serviceId} value={item?.serviceId}>{item.name}</option>);
                            })
                        }
                    </select>
                </div>
            </div>
            <div className='col-12 col-sm-2 text-left'>
                {
                    (!!service?.serviceId && !!categories?.length) &&
                    <ButtonComponent text="Save Service Pricing" loading={saving} disabled={!service?.serviceId || !categories?.length} className="btn-primary" onClick={onAddClick} >
                        <i className="fa fa-floppy-o mr-2"></i>
                    </ButtonComponent>
                }
            </div>
        </div>
        <div className='all-service-categories'>
            {
                loading && <div className='position-relative w-50 text-center pt-2 pb-2'>
                    <Spinner size={'md'} />
                </div>
            }
            {
                !!service?.serviceId &&
                <ServiceCategoriesComponent optionsList={options} processing={loading || saving} onChange={onCategoryChange} categories={categories} levelsList={levels} />
            }
        </div>
    </div>);
});
