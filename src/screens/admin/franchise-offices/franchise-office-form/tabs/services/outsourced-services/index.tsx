import React, { useEffect, useState } from 'react';
import axios, { CancelTokenSource } from 'axios';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { ButtonComponent } from '../../../../../../../shared/components/button';
import { Messages } from '../../../../../../../shared/constants';
import { ModalComponent } from '../../../../../../../shared/components/modal';
import { AddUpdateOutsourcedServiceComponent } from './add-update-outsourced-service';
import { getFranchiseOfficeAllPricings } from '../../../../../../../actions/franchise-services.actions';
import { IFranchAddOn, IFranchCategory, IFranchLevel } from '../../../../../../../models/interfaces/franchise';
import { LargeSpinner } from '../../../../../../../shared/components/large-spinner';

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getFranchiseOfficeAllPricings
    }, dispatch);
}

const OutsourcedFranchiseServicesComponent = connect(null, mapDispatchToProps)((props: any) => {

    const [loading, setLoading] = useState(false);
    const [axiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [services, setServices] = useState([] as any[]);

    useEffect(() => {
        loadAllServices();
        return () => {
            if (axiosSource.cancel) {
                axiosSource.cancel(Messages.APIAborted);
            }
        }
    }, [props?.officeId]);

    const loadAllServices = () => {
        setLoading(true);
        props?.getFranchiseOfficeAllPricings(props?.officeId, axiosSource)
            .then((result: any) => {
                setLoading(false);
                setServices(result);
            })
            .catch((result: any) => {
                if (!axios.isCancel(result)) {
                    setLoading(false);
                }
            })
    }
    const onAddClick = () => {
        setIsModalVisible(true);
    }
    const onSave = () => {
        loadAllServices();
    }
    return (
        <div className='outsourced-services-list'>
            <div className="p-2 d-flex justify-content-end mt-5">
                <ButtonComponent text="Add/Update Service" className="btn-primary" onClick={onAddClick}>
                    <i className="fa fa-check mr-2"></i>
                </ButtonComponent>
            </div>
            <div className="table-responsive list-scrollable custom-scrollbar  mb-5" style={{ maxHeight: '300px' }}>
                <table className="dataTableCustomers table table-striped table-hover">
                    <thead className="back_table_color">
                        <tr className="secondary">
                            <th style={{ width: '30%' }}>Service</th>
                            <th style={{ width: '30%' }}></th>
                            <th style={{ width: '20%' }}></th>
                            <th style={{ width: '20%' }} className='pl-0 pr-0'>

                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            !loading ?
                                !!services?.length ?
                                    services?.map((item: any, index: number) => <tr key={index}>
                                        <td>
                                            {item?.serviceName}
                                        </td>
                                        <td colSpan={3}>
                                            <div className='all-categories-list'>
                                                {
                                                    item?.categories?.map((cat: IFranchCategory, index: number) => cat?.isSelected && <div className='category-collection' key={index}>
                                                        <div>{cat?.categoryName}</div>
                                                        <div className='levels pl-3'>
                                                            {
                                                                cat?.servicePricingLevels?.map((lev: IFranchLevel, ind: number) => <div className='level-item' key={ind}>
                                                                    <div className='level-item-price'>
                                                                        <label >
                                                                            {
                                                                                lev?.name
                                                                            }
                                                                        </label>
                                                                        <span>(Letter-{lev?.letterCount})</span>
                                                                        <span>(Cost-${lev?.cost})</span>
                                                                    </div>
                                                                    <div className='addons-list'>
                                                                        {
                                                                            lev?.serviceAddOns?.map((add: IFranchAddOn, i: number) => <div className='addon-item' key={i}>
                                                                                <label>{add?.name}</label>
                                                                                <span>(Cost-${add?.cost})</span>
                                                                            </div>)
                                                                        }
                                                                    </div>
                                                                </div>)
                                                            }
                                                        </div>
                                                    </div>)
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                    )
                                    : <tr>
                                        <td colSpan={4} align='center' className='text-danger'>
                                            No Services Selected
                                        </td>
                                    </tr>
                                : <tr>
                                    <td colSpan={4} className="text-center text-danger position-relative" style={{ height: '50px' }}>
                                        {!isModalVisible && <LargeSpinner />}
                                    </td>
                                </tr>
                        }
                    </tbody>
                </table>

            </div>
            <ModalComponent fullscreen100W={true} title={`Update Service`}
                isVisible={isModalVisible} onClose={() => { setIsModalVisible(false); }}>
                {
                    isModalVisible
                    && <AddUpdateOutsourcedServiceComponent officeId={props?.officeId} onSave={onSave} />
                }
            </ModalComponent>
        </div>
    );
})


export default OutsourcedFranchiseServicesComponent
