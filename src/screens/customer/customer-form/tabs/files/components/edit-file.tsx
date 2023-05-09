import axios, { CancelTokenSource } from 'axios';
import React, { useState } from 'react';
import toastr from 'toastr';

import { updateFile } from '../../../../../../actions/customers.actions';
import { IFile } from '../../../../../../models/interfaces/customer-view';
import { IDropdown } from '../../../../../../models/interfaces/shared';
import { ButtonComponent } from '../../../../../../shared/components/button';
import { CommonUtils } from '../../../../../../utils/common-utils';


export const EditFileComponent = (props: { file: IFile, onClose: any, onSuccess: any, isLead?: boolean }) => {

    const [type, setType] = useState(props?.file?.type);
    const [loading, setLoading] = useState(false);
    const [docTypes] = useState(CommonUtils.DocTypes());
    const [axiosSource] = useState({} as CancelTokenSource);

    const onSubmit = () => {
        if (!type) {
            toastr.error('Please select file type.');
            return;
        }
        setLoading(true);
        updateFile(props?.file?.id, type, axiosSource, props?.isLead)
            .then((result: string) => {
                setLoading(false);
                toastr.success('File updated successfully!!');
                props?.onSuccess();
            })
            .catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setLoading(false);
                }
            })
    }
    return (
        <div className="edit-doc">
            <div className="row mb-1 mt-4">
                <div className="col-4 text-right pr-0">
                    <label className='text-orange-red'>File Name*</label>
                </div>
                <div className="col-8">
                    {props?.file?.name}
                </div>
            </div>

            <div className="row mb-1">
                <div className="col-4 text-right pr-0">
                    <label className='text-orange-red'>File Type*</label>
                </div>
                <div className="col-4">
                    <div className="input-group">
                        <select value={type} onChange={e => setType(e.target.value)} className="form-control input-sm">
                            <option value=''>- Select-</option>
                            {
                                docTypes?.map((agent: IDropdown, index: number) => {
                                    return (
                                        <option key={index} value={agent?.abbreviation}>{agent?.name}</option>
                                    );
                                })
                            }
                        </select>
                    </div>
                </div>
                <div className="col-4"></div>
            </div>
            <div className="row mb-4">
                <div className="col-4 text-right pr-0">
                    <label>Description:</label>
                </div>
                <div className="col-4">
                    <p>{props?.file?.description}</p>
                </div>
                <div className="col-4"></div>
            </div>
            <div className="row mb-4">
                <div className="col-8 d-flex justify-content-end">
                    <ButtonComponent text="Update" disabled={!type}
                        className="btn-primary input-sm" loading={loading} onClick={onSubmit} >
                        <i className="fa fa-floppy-o mr-2"></i>
                    </ButtonComponent>
                </div>
                <div className="col-4 d-flex justify-content-end">
                </div>
            </div>
        </div>
    );
}