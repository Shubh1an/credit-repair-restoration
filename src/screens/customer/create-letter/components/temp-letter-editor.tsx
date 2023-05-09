import React, { useEffect, useState } from 'react';
import axios, { CancelTokenSource } from 'axios';
import toastr from 'toastr';

import { ITempLetterQueue } from '../../../../models/interfaces/create-letter';
import { ICustomerShort } from '../../../../models/interfaces/customer-view';
import { asyncComponent } from '../../../../shared/components/async-component';
import { saveTempLetter } from '../../../../actions/create-letter.actions';
import { Messages } from '../../../../shared/constants';

const AsyncHTMLEditor = asyncComponent(() => import('../../../../shared/components/html-editor'));

export const TempLetterEditor = (props: { onSave: () => void, letter?: ITempLetterQueue, customer?: ICustomerShort }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [html, setHtml] = useState(props?.letter?.letterContent as string);
    const [axiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);

    useEffect(() => {
        return () => {
            if (axiosSource.cancel) {
                axiosSource.cancel(Messages.APIAborted);
            }
        }
    }, []);
    const onSave = () => {
        setIsLoading(true);
        saveTempLetter({
            tempLetterPreviewId: props?.letter?.tempLetterPreviewId,
            content: html?.replace(/<br\s*[\/]?>/gi, '<br/>'),
            customerId: props?.customer?.id
        }, axiosSource)
            .then((result: any) => {
                setIsLoading(false);
                toastr.success('Temp Letter Updated successfully!');
                props.onSave();
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setIsLoading(false);
                    toastr.error(err?.response?.data);
                }
            })
    }
    const onChange = (html: string) => {
        setHtml(html);
    }
    return (
        <div className="letter-editor position-relative" >
            <div className="d-flex justify-content-between">
                <div className="text-left">
                    <span>
                        <label>Letter for :</label> <span className="f-11">{props?.customer?.fullName}</span>
                    </span>
                    <span className="ml-4">
                        <label>Letter :</label> <span className="f-11">{props?.letter?.letterName}</span>
                    </span>
                </div>
            </div>
            <AsyncHTMLEditor allowHTMLEdit={true} isLoading={isLoading} onSave={onSave} content={props?.letter?.letterContent} onChange={onChange} />
        </div>
    );
}