import React, { useState } from 'react'
import ReactTooltip from 'react-tooltip'
import AuthService from '../../../core/services/auth.service';

import { ICustomerFullDetails } from '../../../models/interfaces/customer-view'

export const ServiesAndOfcDetailsComponent = ((props: { customer: ICustomerFullDetails }) => {

    const [showService] = useState(AuthService.getCurrentJWTPayload()?.sub?.toLowerCase() === 'techsavy1980@gmail.com');

    const getOfcDetails = (content: any) => {
        return <div className='ofc-details'>
            <div className='row'>
                <div className='col-1'>
                    <div className="f-15">
                        <i className="fa fa-home mr-2"></i>
                    </div>
                </div>
                <div className='col-10'>
                    {props?.customer?.agent?.office?.name}
                </div>
            </div>
            <div className='row'>
                <div className='col-1'>
                    <div className="f-13">
                        <i className="fa fa-user-secret mr-2"></i>
                    </div>
                </div>
                <div className='col-10'>
                    {props?.customer?.agent?.fullName}
                </div>
            </div>
            <div className='row'>
                <div className='col-1'>
                    <div className="f-13">
                        <i className="fa fa-phone mr-2"></i>
                    </div>
                </div>
                <div className='col-10'>
                    {props?.customer?.agent?.telephone || 'NA'}
                </div>
            </div>
            <div className='row'>
                <div className='col-1'>
                    <div className="f-13">
                        <i className="fa fa-envelope-o mr-2"></i>
                    </div>
                </div>
                <div className='col-10'>
                    {props?.customer?.agent?.email || "NA"}
                </div>
            </div>
        </div>;
    }
    const getClientServices = () => {
        return <div className='client-services'>
            <div className='row'>
                <div className='col-1'>
                    <div className="f-18">
                        <i className="fa fa-check mr-2 text-success"></i>
                    </div>
                </div>
                <div className='col-8'>
                    Biz Credit -always full service
                </div>
            </div>
            <div className='row'>
                <div className='col-1'>
                    <div className="f-18">
                        <i className="fa fa-check mr-2 text-success"></i>
                    </div>
                </div>
                <div className='col-8'>
                    Per Credit/Student Loan
                </div>
            </div>
            <div className='row'>
                <div className='col-1'>
                    <div className="f-18">
                        <i className="fa fa-check mr-2 text-success"></i>
                    </div>
                </div>
                <div className='col-8'>
                    Per Credit/Biz Credit/Student/Settle
                </div>
            </div>
        </div>
    }
    return (
        <>
            {props?.customer?.agent?.office?.name &&
                <div className='short-info-section'>
                    <div className='ofc-section mr-4'>
                        <div className="btn-group btn-group-sm" data-tip={props.customer.id} data-for={"tooltip-ofc-details"} data-event='click'>
                            <button type="button" className="btn btn-link btn-sm f-12 text-success">
                                <i className='fa fa-home mr-1'></i>
                                {props?.customer?.agent?.office?.name || '-'}
                            </button>
                            <button type="button" className="btn f-12 btn-link btn-sm text-success dropdown-toggle dropdown-toggle-split pl-0" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span className="sr-only">Toggle Dropdown</span>
                            </button>
                        </div>
                        <ReactTooltip getContent={getOfcDetails}
                            className="go-to-menu-theme2 with-shadow" id={"tooltip-ofc-details"} place='bottom' effect='solid' clickable={true} />
                    </div>
                    {showService &&
                        <div className='srvc-section'>
                            <div className="btn-group btn-group-sm  text-success" data-tip={props.customer.id} data-for={"tooltip-client-services"} data-event='click'>
                                <button type="button" className="btn btn-link btn-sm f-12">
                                    <i className='fa fa-tasks mr-1'></i> Services
                                </button>
                                <button type="button" className="btn btn-link  text-success f-12 btn-sm dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <span className="sr-only">Toggle Dropdown</span>
                                </button>
                            </div>
                            <ReactTooltip getContent={getClientServices}
                                className="go-to-menu-theme2 with-shadow" id={"tooltip-client-services"} place='bottom' effect='solid' clickable={true} />
                        </div>
                    }
                </div>
            }
        </>
    )
});
