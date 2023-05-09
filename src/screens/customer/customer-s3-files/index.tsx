import React, { useEffect, useState } from 'react';
import axios, { CancelTokenSource } from 'axios';
import { Link } from 'react-router-dom';

import { ICBFilesModel } from '../../../models/interfaces/shared';
import { getS3Files } from '../../../actions/customers.actions';
import { CommonUtils } from '../../../utils/common-utils';
import { ClientRoutesConstants } from '../../../shared/constants';

export const S3FilesComponent = ((props: { cid: string, isLead?: boolean }) => {
    const [axiosSource, setAxiosSource] = useState({} as CancelTokenSource);
    const [files, setFiles] = useState([] as ICBFilesModel[]);
    useEffect(() => {
        if (props?.cid) {
            const source = axios.CancelToken.source();
            setAxiosSource(source);
            getS3Files(props?.cid, 5000, '', source, props?.isLead)
                .then((list: ICBFilesModel[]) => {
                    setFiles(list);
                });
        }
    }, [props?.cid]);
    return (
        <div className="form-group">
            <label>Available Credit Bliss Reports:</label>
            <div className="reports-links">
                {
                    files?.length ?
                        files?.map((file: ICBFilesModel, index: number) => {
                            return (
                                <Link key={index} className="d-flex align-items-center" rel="noreferrer"
                                    to={CommonUtils.replaceProps(ClientRoutesConstants.cbReportViewer, { cid: props?.cid, date: file?.folderName })}
                                    target="_blank">
                                    <span className="text-danger change-button font-weight-bold">{file?.formattedDate}</span>
                                    <i className="fa fa-external-link ml-1" aria-hidden="true"></i>
                                </Link>
                            );
                        })
                        : <div><i className='no-files'>No files available yet.</i></div>
                }
            </div>
        </div>

    );
});