import React from 'react';

import { EnumBureausShorts, EnumControlTypes } from '../../../../models/enums';
import { IFEFullAddEditAccountModel } from '../../../../models/interfaces/fast-edit-accounts';
import { BureauLogoComponent } from '../../../../shared/components/bureau-logo';
import { FEAccountField } from '../../../../shared/components/fe-account-field';
import { FEBureauFullDetails } from './fe-bureau-full-details';

export const FEAddEditFullAccountComponent: React.FC<IFEFullAddEditAccountModel> = (props: IFEFullAddEditAccountModel) => {
    return (
        <>
            <div className="row">
                <div className="col-4 tu-head">
                    <BureauLogoComponent type={EnumBureausShorts.TU} size={'md'} />
                </div>
                <div className="col-4 exp-head">
                    <BureauLogoComponent type={EnumBureausShorts.EXP} size={'md'} />
                </div>
                <div className="col-4 eq-head">
                    <BureauLogoComponent type={EnumBureausShorts.EQF} size={'md'} />
                </div>
            </div>
            <div className="row ">
                <div className="col-12 p-0 custom-scrollbar full-details-section">
                    <div className="row m-0">
                        <div className="col-4 border-right-grad">
                            <FEBureauFullDetails  {...props} data={props?.transUnion} onChange={props?.onTUChange} />
                        </div>
                        <div className="col-4 border-right-grad" >
                            <FEBureauFullDetails {...props} data={props?.experian} onChange={props?.onEXPChange} />
                        </div>
                        <div className="col-4" >
                            <FEBureauFullDetails {...props} data={props?.equifax} onChange={props?.onEQChange} />
                        </div>
                    </div>
                    <div className="row m-0">
                        <div className="col-12">
                            <FEAccountField label="Account Notes" mode={props?.mode} type={EnumControlTypes.TextArea} value={props?.notes} onChange={(e) => props.onAccountNotesChange && props.onAccountNotesChange('accountNotes', e)} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-4 pt-1 d-flex justify-content-center align-items-center">
                    <i className="fa fa-arrow-left copy-link mr-2" aria-hidden="true" title="Copy to EQF" onClick={() => props.onCopyClick && props.onCopyClick(EnumBureausShorts.TU, EnumBureausShorts.EQF)}></i>
                    {
                        !!props?.transUnion?.id &&
                        <button className="btn btn-sm btn-danger f-11 pl-2 pr-2"
                            onClick={() => props?.onDelete && props?.onDelete(EnumBureausShorts.TU, props?.transUnion?.id)}>
                            <i className="fa fa-trash mr-1"></i>Delete</button>
                    }
                    <i className="fa fa-arrow-right copy-link ml-2" aria-hidden="true" title="Copy to EXP" onClick={() => props.onCopyClick && props.onCopyClick(EnumBureausShorts.TU, EnumBureausShorts.EXP)}></i>
                </div>
                <div className="col-4 pt-1 d-flex justify-content-center align-items-center">
                    <i className="fa fa-arrow-left copy-link mr-2" aria-hidden="true" title="Copy to TU" onClick={() => props.onCopyClick && props.onCopyClick(EnumBureausShorts.EXP, EnumBureausShorts.TU)}></i>
                    {
                        !!props?.experian?.id &&
                        <button className="btn btn-sm btn-danger f-11 pl-2 pr-2"
                            onClick={() => props?.onDelete && props?.onDelete(EnumBureausShorts.EXP, props?.experian?.id)}
                        ><i className="fa fa-trash mr-1"></i>Delete</button>
                    }
                    <i className="fa fa-arrow-right copy-link ml-2" aria-hidden="true" title="Copy to EQF" onClick={() => props.onCopyClick && props.onCopyClick(EnumBureausShorts.EXP, EnumBureausShorts.EQF)}></i>
                </div>

                <div className="col-4  pt-1 d-flex justify-content-center align-items-center">
                    <i className="fa fa-arrow-left copy-link mr-2" aria-hidden="true" title="Copy to EXP" onClick={() => props.onCopyClick && props.onCopyClick(EnumBureausShorts.EQF, EnumBureausShorts.EXP)}></i>
                    {
                        !!props?.equifax?.id &&
                        <button className="btn btn-sm btn-danger f-11 pl-2 pr-2"
                            onClick={() => props?.onDelete && props?.onDelete(EnumBureausShorts.EQF, props?.equifax?.id)}
                        ><i className="fa fa-trash mr-1"></i>Delete</button>
                    }
                    <i className="fa fa-arrow-right copy-link ml-2" title="Copy to TU" aria-hidden="true" onClick={() => props.onCopyClick && props.onCopyClick(EnumBureausShorts.EQF, EnumBureausShorts.TU)}></i>
                </div>
            </div>
        </>
    );
};