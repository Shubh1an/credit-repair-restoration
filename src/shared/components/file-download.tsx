import axios, { CancelTokenSource } from 'axios';
import React, { useEffect, useState } from 'react';
import { Spinner } from 'reactstrap';
import toastr from 'toastr';

import { downloadFileOrLetter } from '../../actions/customers.actions';
import { Messages } from '../constants';

export const FileDownload = (props: { children?: any, filePath: string; }) => {

    const [loading, setLoading] = useState(false);

    const [axiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);

    useEffect(() => {
        return () => {
            if (axiosSource?.cancel)
                axiosSource?.cancel(Messages.APIAborted);
        }
    }, [])
    const onDownload = () => {
        setLoading(true);
        downloadFileOrLetter(props?.filePath, axiosSource)
            .then(() => {
                setLoading(false);
                toastr.success('Document is being downloaded in the browser.')
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setLoading(false);
                    toastr.error('Document not available. Please contact the support team.')
                }
            })
    }
    return (
        <span onClick={onDownload} className="position-relative ace-download-button">
            {loading
                ? <Spinner size="sm" color="secondary" />
                : (props?.children
                    ? props.children
                    : <i className="fa fa-download pointer"></i>
                )
            }
        </span>
    );
}