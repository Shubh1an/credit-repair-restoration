import classnames from 'classnames';
import React from 'react';

import { CollectionEntryTypes, EnumBureausShorts, EnumComponentMode } from '../../../../models/enums';
import { IFEAddEditAccountModel } from '../../../../models/interfaces/fast-edit-accounts';
import { IValueText } from '../../../../models/interfaces/shared';
import { BureauLogoComponent } from '../../../../shared/components/bureau-logo';
import { SearchCollectionEntries } from '../../../../shared/components/search-collection-entries';
import { AccountOutcomes } from '../../../../shared/constants';
import { FEBureauDetails } from './fe-bureau-details';


export const FEAddEditAccountComponent: React.FC<IFEAddEditAccountModel> = (props: IFEAddEditAccountModel) => {

    return (
        <>
            <div className="row">
                <div className="col-12 col-sm-8">
                    <div className="form-group">
                        <label>Global Reason</label>
                        <div className="input-group">
                            <SearchCollectionEntries isTextArea={true} type={CollectionEntryTypes.Reason} onChange={(e: any) => props.onReasonChange && props.onReasonChange(e)} placeholder="Type to search..." />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-4">
                    <div className="form-group mb-0">
                        <label>Use Global Outcome</label>
                        <div className="input-group">
                            <select className="custom-select custom-select-sm f-11" onChange={e => props.onOutcomeChange && props.onOutcomeChange(e.target.value)} >
                                <option value=""> </option>
                                {
                                    AccountOutcomes.map((item: IValueText, index) => <option key={index} value={item.value}>{item?.text}</option>)
                                }
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="d-flex align-items-center">
                            <label className='text-orange-red'>Account Type*</label>
                            {
                                props?.mode === EnumComponentMode.Edit ?
                                    <span className="f-10 pl-1 text-danger font-weight-bold text-capitalize">
                                        ({props?.accountType?.trim()})
                                    </span>
                                    : null}
                        </div>
                        <div>
                            <SearchCollectionEntries minSearchLength={2} type={CollectionEntryTypes.AccountType} defaultValue={props?.accountType?.trim() || ""} onChange={props.onAccTypeChange} placeholder="Type to search..." />
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-4 tu-head d-none d-sm-block">
                    <BureauLogoComponent type={EnumBureausShorts.TU} size={'md'} />
                </div>
                <div className="col-4 exp-head d-none d-sm-block">
                    <BureauLogoComponent type={EnumBureausShorts.EXP} size={'md'} />
                </div>
                <div className="col-4 eq-head d-none d-sm-block">
                    <BureauLogoComponent type={EnumBureausShorts.EQF} size={'md'} />
                </div>
                <div className={classnames("col-12 col-sm-4 mt-3 mt-sm-0 border-right-grad flex-column flex-sm-row", { 'd-flex justify-content-center align-items-center': !props?.isTUAvailable })}>
                    <div className="d-block d-sm-none text-center mb-2 mb-sm-0">
                        <BureauLogoComponent type={EnumBureausShorts.TU} size={'md'} />
                    </div>
                    {
                        props?.isTUAvailable ?
                            <FEBureauDetails {...props} data={props?.transUnion} onChange={props?.onTUChange} />
                            : <span className="text-danger font-weight-bold mt-2 mt-sm-0">No TU Listing</span>
                    }
                </div>
                <div className={classnames("col-12 col-sm-4 border-right-grad flex-column flex-sm-row", { 'd-flex justify-content-center align-items-center': !props?.isEXPAvailable })}>
                    <div className="d-block d-sm-none text-center mt-4">
                        <BureauLogoComponent type={EnumBureausShorts.EXP} size={'md'} />
                    </div>
                    {
                        props?.isEXPAvailable ?
                            <FEBureauDetails {...props} data={props?.experian} onChange={props?.onEXPChange} />
                            : <span className="text-danger font-weight-bold mt-2 mt-sm-0">No EXP Listing</span>
                    }
                </div>
                <div className={classnames("col-12 col-sm-4  flex-column flex-sm-row mb-3 mb-sm-0", { 'd-flex justify-content-center align-items-center': !props?.isEQFAvailable })}>
                    <div className="d-block d-sm-none text-center mt-4">
                        <BureauLogoComponent type={EnumBureausShorts.EQF} size={'md'} />
                    </div>
                    {
                        props?.isEQFAvailable ?
                            <FEBureauDetails {...props} data={props?.equifax} onChange={props?.onEQChange} />
                            : <span className="text-danger font-weight-bold mt-2 mt-sm-0">No EQF Listing</span>
                    }
                </div>
            </div>
            {
                props?.allowCopy &&
                <div className="row">
                    <div className="col-12 col-sm-4 pt-1 d-flex justify-content-center align-items-center">
                        <i className="fa fa-arrow-left copy-link mr-2" aria-hidden="true" title="Copy to EQF" onClick={() => props.onCopyClick && props.onCopyClick(EnumBureausShorts.TU, EnumBureausShorts.EQF)}></i>
                        <i className="fa fa-arrow-right copy-link ml-2" aria-hidden="true" title="Copy to EXP" onClick={() => props.onCopyClick && props.onCopyClick(EnumBureausShorts.TU, EnumBureausShorts.EXP)}></i>
                    </div>
                    <div className="col-12 col-sm-4 pt-1 d-flex justify-content-center align-items-center">
                        <i className="fa fa-arrow-left copy-link mr-2" aria-hidden="true" title="Copy to TU" onClick={() => props.onCopyClick && props.onCopyClick(EnumBureausShorts.EXP, EnumBureausShorts.TU)}></i>
                        <i className="fa fa-arrow-right copy-link ml-2" aria-hidden="true" title="Copy to EQF" onClick={() => props.onCopyClick && props.onCopyClick(EnumBureausShorts.EXP, EnumBureausShorts.EQF)}></i>
                    </div>
                    <div className="col-12 col-sm-4  pt-1 d-flex justify-content-center align-items-center">
                        <i className="fa fa-arrow-left copy-link mr-2" aria-hidden="true" title="Copy to EXP" onClick={() => props.onCopyClick && props.onCopyClick(EnumBureausShorts.EQF, EnumBureausShorts.EXP)}></i>
                        <i className="fa fa-arrow-right copy-link ml-2" title="Copy to TU" aria-hidden="true" onClick={() => props.onCopyClick && props.onCopyClick(EnumBureausShorts.EQF, EnumBureausShorts.TU)}></i>
                    </div>
                </div>
            }
        </>
    );
};