import React, { useEffect, useState } from 'react';
import toastr from 'toastr';
import axios, { CancelTokenSource } from 'axios';

import { IDropdown } from '../../../../../../models/interfaces/shared';
import { ButtonComponent } from '../../../../../../shared/components/button';
import { Checkbox } from '../../../../../../shared/components/checkbox';
import { CommonUtils } from '../../../../../../utils/common-utils';
import { FileUploadButton } from '../../../../../../shared/components/file-upload-button';
import { uploadFile } from '../../../../../../actions/customers.actions';
import { Messages } from '../../../../../../shared/constants';

export const UploadFileComponent = (props: { cid: string, onSuccess: any, action: string }) => {

    const [fileName, setFileName] = useState('' as string);
    const [fileType, setFileType] = useState('' as string);
    const [docTypes] = useState(CommonUtils.DocTypes());
    const [overwrite, setOverwrite] = useState(false);
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([] as any[]);
    const [axiosSource] = useState({} as CancelTokenSource);

    useEffect(() => {
        return () => {
            if (axiosSource?.cancel)
                axiosSource?.cancel(Messages.APIAborted);
        }
    }, []);
    const onSubmit = () => {
        if (!fileType || !fileName || !selectedFiles?.length) {
            toastr.error('Please select all mandatory(*) fields.');
            return;
        }
        setUploading(true);
        const file = selectedFiles[0];
        const formData: FormData = new FormData();
        formData.append('files[]', file, file?.name);
        uploadFile(props?.cid, fileName, fileType, overwrite, formData, description, file?.name, props?.action, axiosSource)
            .then((result: string) => {
                setUploading(false);
                toastr.success('Document uploaded successfully!!');
                props?.onSuccess();
            })
            .catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setUploading(false);
                    if (err?.response?.data) {
                        toastr.error(err?.response?.data);
                    }
                }
            })
    }

    return (
        <>
            <div className="row mb-1 mt-4">
                <div className="col-12 col-sm-4 text-sm-right pr-0">
                    <label className="text-orange-red">Document Name*:</label>
                </div>
                <div className="col-12 col-sm-4">
                    <div className="input-group">
                        <input autoFocus={true} value={fileName} onChange={e => setFileName(e.target.value)} type="text" className="form-control input-sm" />
                    </div>
                </div>
            </div>
            <div className="row mb-1">
                <div className="col-12 col-sm-4 text-sm-right pr-0">
                    <label className="text-orange-red">Document Type*:</label>
                </div>
                <div className="col-12 col-sm-4">
                    <div className="input-group">
                        <select value={fileType} onChange={e => setFileType(e.target.value)} className="form-control input-sm">
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
                <div className="col-12 col-sm-4"></div>
            </div>
            <div className="row mb-1">
                <div className="col-12 col-sm-4 text-sm-right pr-0">
                    <label className="text-orange-red">Document to Upload*:</label>
                </div>
                <div className="col-12 col-sm-7 d-flex flex-column justify-content-center">
                    <FileUploadButton onChange={(e: any) => setSelectedFiles(e)} label="Choose Document" />
                </div>
                <div className="col-12 col-sm-1">
                </div>
            </div>
            <div className="row mb-1">
                <div className="col-6 col-sm-4 text-sm-right pr-0">
                    <label>Overwrite Existing Document?:</label>
                </div>
                <div className="col-6 d-flex align-items-center">
                    <Checkbox text="" checked={overwrite} onChange={(e: any) => setOverwrite(e.checked)} />
                </div>
                <div className="col-12 col-sm-4"></div>
            </div>
            <div className="row mb-4">
                <div className="col-12 col-sm-4 text-sm-right pr-0">
                    <label>Description:</label>
                </div>
                <div className="col-12 col-sm-4">
                    <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)}></textarea>
                </div>
                <div className="col-12 col-sm-4"></div>
            </div>
            <div className="row mb-4">
                <div className="col-12 col-sm-8 d-flex justify-content-end">
                    <ButtonComponent text="Upload Document"
                        disabled={!fileName || !fileType || !selectedFiles?.length}
                        className="btn-primary input-sm w-100 w-sm-auto" loading={uploading} onClick={onSubmit} >
                        <i className="fa fa-upload mr-2"></i>
                    </ButtonComponent>
                </div>
                <div className="col-12 col-sm-4 d-flex justify-content-end">
                </div>
            </div>
        </>
    );
}