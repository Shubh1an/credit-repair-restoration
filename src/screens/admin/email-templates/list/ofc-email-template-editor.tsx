import React, { useEffect, useState } from 'react';
import axios, { CancelTokenSource } from 'axios';
import toastr from 'toastr';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { asyncComponent } from '../../../../shared/components/async-component';
import { Messages } from '../../../../shared/constants';
import { IEmailLetters } from '../../../../models/interfaces/email-letters';
import { getEmailTemplatesById, updateOfcEmailTemplate, emailTemplateFieldTokens } from '../../../../actions/email-templates.actions';
import { CommonUtils } from '../../../../utils/common-utils';
import { INameValueSmall } from '../../../../models/interfaces/shared';

const AsyncHTMLEditor = asyncComponent(() => import('../../../../shared/components/html-editor'));

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getEmailTemplatesById,
        updateOfcEmailTemplate,
        emailTemplateFieldTokens
    }, dispatch);
}
export const OfcEmailTemplateEditor = connect(null, mapDispatchToProps)(
    (props: {
        onSave: any, letterId?: string, getEmailTemplatesById: any,
        updateOfcEmailTemplate: any, emailTemplateFieldTokens: any,
        letterObject?: IEmailLetters | null,
        name?: string,
        officeId: string,
        type: string
    }) => {

        const [isLoading, setIsLoading] = useState(false);
        const [letter, setLetter] = useState(null as IEmailLetters | null);
        const [fieldsTokens, setFieldsTokens] = useState([] as INameValueSmall[]);
        const [html, setHtml] = useState('' as string);

        const [axiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);

        useEffect(() => {
            if (props?.letterId) {
                getDetails(props?.letterId);
            } else {
                setLetter(props?.letterObject || {});
                setHtml(props?.letterObject?.template || '');
            }
            getFieldsTokens();
            return () => {
                if (axiosSource.cancel) {
                    axiosSource.cancel(Messages.APIAborted);
                }
            }
        }, []);

        const onSave = () => {
            if (!props?.name || !props?.officeId || !html?.length) {
                toastr.error('Data is missing, please enter all data');
                return;
            }
            let template = CommonUtils.ReplaceUnCloseIMGtags(html);
            template = CommonUtils.ReplaceUnCloseBRtags(template);
            const newLetter = {
                letterType: props?.letterObject?.letterType || props.type,
                name: props?.letterObject?.name || props.name,
                content: html,
                officeId: props?.letterObject?.officeId || props.officeId,
                templateid: props?.letterObject?.id
            };

            const promise$ = props?.updateOfcEmailTemplate(newLetter, axiosSource);

            setIsLoading(true);
            promise$.then((result: any) => {
                setIsLoading(false);
                toastr.success('Email Eemplate saved successfully!');
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
        const getDetails = (id?: string) => {
            setIsLoading(true);
            props?.getEmailTemplatesById(props?.letterId, axiosSource)
                .then((result: IEmailLetters) => {
                    setIsLoading(false);
                    setLetter(result);
                    setHtml(result?.template || '')
                }).catch((err: any) => {
                    if (!axios.isCancel(err)) {
                        setIsLoading(false);
                        toastr.error(err?.response?.data);
                    }
                })
        }
        const getFieldsTokens = () => {
            props?.emailTemplateFieldTokens(axiosSource)
                .then((result: INameValueSmall[]) => {
                    setFieldsTokens(result);
                }).catch((err: any) => {
                    if (!axios.isCancel(err)) {
                        toastr.error(err?.response?.data);
                    }
                })
        }
        return (
            <div className="letter-editor position-relative" >
                <AsyncHTMLEditor allowSampleDownload={true} sampleName={props?.name} allowPreview={true} allowHTMLEdit={true} allowAddFieldTokens={true} fieldsTokens={fieldsTokens} isLoading={isLoading} onSave={onSave} content={html} onChange={onChange} />
            </div>
        );
    });