import classnames from 'classnames';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { AutoCompleteSearchTypes } from '../../models/enums';

import { ICustomerShort, ICustomersState } from '../../models/interfaces/customer-view';
import { INavMenu } from '../../models/interfaces/shared';
import { CommonUtils } from '../../utils/common-utils';
import { ClientRoutesConstants } from '../constants';
import { SearchCustomersComponent } from './search-customers';

const mapStateToProps = (state: any) => {
    return {
        currentAccessibleScreens: state?.sharedModel?.currentAccessibleScreens
    };
}
export const GlobalCustomerSearch = connect(mapStateToProps)((props: { onClose: any, currentAccessibleScreens: string[], autoFocus?: boolean, selected?: ICustomerShort }) => {

    const [selected, setSelected] = useState(null as ICustomerShort | null);
    const [menus, setMenus] = useState([] as INavMenu[]);
    useEffect(() => {
        onSelectedData(props?.selected);
    }, [props?.selected]);

    const onSelectedData = (data?: ICustomerShort) => {
        setSelected(data ?? null);
        if (data?.isLead) {
            setMenus(CommonUtils.LeadsMenus(data?.id ?? '', null, props?.currentAccessibleScreens));
        }
        else {
            setMenus(CommonUtils.CustomersMenus(data?.id ?? '', null, props?.currentAccessibleScreens));
        }
    }

    return (
        <div className={classnames("global-cust-search", { 'selected': !!selected })}>
            <SearchCustomersComponent autoFocus={props?.autoFocus} searchTypes={AutoCompleteSearchTypes.CUSTOMER_LEAD} minSearchLength={3} onSelectedData={onSelectedData} placeholder="search customers and leads ..." defaultValue={selected?.fullName || ''} />
            {!!selected &&
                <div className="details-sections  bg-light mt-3 p-3">
                    <div className="row mt-2">
                        <div className="col-12 text-success mb-2 f-20 font-weight-bold">
                            {selected?.isLead ? 'LEAD' : 'CLIENT'}
                        </div>
                        <div className="col-6 col-sm-4 form-group">
                            <label>First Name:</label>
                            <div className="input-control">
                                {
                                    selected?.firstName
                                }
                            </div>
                        </div>
                        <div className="col-6 col-sm-4 form-group">
                            <label>Last Name:</label>
                            <div className="input-control">
                                {
                                    selected?.lastName
                                }
                            </div>
                        </div>
                        <div className="col-6 col-sm-4 form-group">
                            <label>Company Office:</label>
                            <div className="input-control">
                                {
                                    selected?.franchiseOfficeName
                                }
                            </div>
                        </div>
                        <div className="col-6 col-sm-4 form-group">
                            <label>Company Agent Name:</label>
                            <div className="input-control">
                                {
                                    selected?.franchiseAgentName
                                }
                            </div>
                        </div>
                        <div className="col-6 col-sm-4 form-group">
                            <label>Affiliate Agent Name:</label>
                            <div className="input-control">
                                {
                                    selected?.referralAgentName
                                }
                            </div>
                        </div>
                        <div className="col-6 col-sm-4 form-group">
                            <label>Telephone:</label>
                            <div className="input-control">
                                {
                                    selected?.telephone
                                }
                            </div>
                        </div>
                        <div className="col-6 col-sm-4 form-group">
                            <label>Email:</label>
                            <div className="input-control">
                                {
                                    selected?.email
                                }
                            </div>
                        </div>
                        <div className="col-6 col-sm-4 form-group">
                            <label>CellPhone:</label>
                            <div className="input-control">
                                {
                                    selected?.cellPhone ?? '-'
                                }
                            </div>
                        </div>
                        <div className="col-6 col-sm-4 form-group">
                            <label>Processing Type:</label>
                            <div className="input-control">
                                {
                                    selected?.processingType
                                }
                            </div>
                        </div>
                    </div>
                    <div className="row mt-5 mb-2">
                        <div className={"col-12 d-flex flex-column flex-sm-row" + (selected?.isLead ? ' justify-content-end' : ' justify-content-around')}>
                            {
                                menus?.map((item: INavMenu, index: number) => {
                                    return (
                                        <div key={index} className="ml-2 mt-2 mt-sm-0">
                                            <Link to={item?.url}  >
                                                <button onClick={(e) => setTimeout((m) => props?.onClose(m), 0, e)} className="btn btn-sm btn-primary w-100 w-sm-auto">
                                                    {
                                                        item?.text
                                                    }
                                                    <i className="fa fa-arrow-right ml-2"></i>
                                                </button>
                                            </Link>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            }
        </div>
    );
})