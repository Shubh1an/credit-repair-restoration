import React, { useEffect, useState } from 'react';
import axios, { CancelTokenSource } from 'axios';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { ButtonComponent } from '../../../../shared/components/button';
import { Checkbox } from '../../../../shared/components/checkbox';
import { getS3Files } from '../../../../actions/customers.actions';
import { Messages } from '../../../../shared/constants';
import { ICBFilesModel } from '../../../../models/interfaces/shared';
import { getS3JSONFileData } from '../../../../actions/importer.actions';
import { LargeSpinner } from '../../../../shared/components/large-spinner';
import { IHTMLParserData } from '../../../../models/interfaces/importer';
import { ImporterUtils } from '../../../../utils/importer-utils';
import { ReportType } from '../import-constants';


const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getS3JSONFileData
    }, dispatch);
}
export const RecentS3FilesComponent = connect(null, mapDispatchToProps)((
    props: {
        cid?: string, size: any, isLead?: boolean,
        fileFolder: string, getS3JSONFileData?: any,
        onSuccess: any, onClose: any,
        reportType: ReportType;
    }) => {

    const [selectedFile, setSelectedFile] = useState(null as any);
    const [axiosSource] = useState({} as CancelTokenSource);
    const [s3FilesList, setS3FilesList] = useState([] as ICBFilesModel[]);
    const [isLoadingFile, setIsLoadingFile] = useState(false);
    const [isLoadingS3, setIsLoadingS3] = useState(false);

    useEffect(() => {
        GetLastS3Files(props?.cid);
        return () => {
            if (axiosSource?.cancel)
                axiosSource?.cancel(Messages.APIAborted);
        }
    }, []);
    const GetLastS3Files = (cid?: string) => {
        if (cid) {
            setIsLoadingS3(true);
            getS3Files(cid, props?.size, props.fileFolder, axiosSource, props?.isLead)
                .then((result: ICBFilesModel[]) => {
                    setIsLoadingS3(false);
                    setS3FilesList(result);
                    if (result?.length) {
                        setSelectedFile(result[0]?.filePath);
                    }
                }).catch((err: any) => {
                    if (!axios.isCancel(err)) {
                        setIsLoadingS3(false);
                    }
                });
        }
    }
    const GetFileData = (filename: string) => {
        setIsLoadingFile(true);
        props?.getS3JSONFileData(filename, axiosSource)
            .then((result: any) => {
                setIsLoadingFile(false);
                if (props?.onSuccess) {
                    result = result && JSON.parse(result);
                    result = parseJSON(result);
                    props?.onSuccess(result);
                    props?.onClose();
                }
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setIsLoadingFile(false);
                }
            });
    }
    const onSubmit = () => {
        GetFileData(selectedFile);
    }
    const parseJSON = (jsonData: any): IHTMLParserData => {
        if (props?.reportType === ReportType.CB) {
            return {
                personalDetails: ImporterUtils.parsePersonalDetail(jsonData),
                creditScoreDetails: ImporterUtils.parseCreditDetail(jsonData),
                creditSummaries: ImporterUtils.parseSummaryDetail(jsonData),
                accountHistory: ImporterUtils.parseHistoryDetail(jsonData),
                creditInquiries: ImporterUtils.parseInquiryDetail(jsonData),
                publicRecords: ImporterUtils.parsePublicRecordDetail(jsonData),
            }
        } else if (props?.reportType === ReportType.Array) {
            return {
                personalDetails: ImporterUtils.parsePersonalDetailArray(jsonData?.CREDIT_RESPONSE),
                creditScoreDetails: ImporterUtils.parseCreditDetailArray(jsonData?.CREDIT_RESPONSE),
                creditSummaries: ImporterUtils.parseSummaryDetailArray(jsonData?.CREDIT_RESPONSE),
                accountHistory: ImporterUtils.parseHistoryDetailArray(jsonData?.CREDIT_RESPONSE),
                creditInquiries: ImporterUtils.parseInquiryDetailArray(jsonData?.CREDIT_RESPONSE),
                publicRecords: ImporterUtils.parsePublicRecordDetailArray(jsonData?.CREDIT_RESPONSE),
            }
        }
        return {};
    }

    return (
        <>
            <div className="table-responsive list-scrollable custom-scrollbar ">
                <table className="dataTableCustomers table table-striped table-hover">
                    <thead className="back_table_color">
                        <tr className="secondary">
                            <th style={{ width: '20%' }}>
                                <div>Date(yy-mm-dd)</div>
                                <div className="f-10 text-danger">latest on top</div>
                            </th>
                            <th style={{ width: '70%' }}>File Name</th>
                            <th style={{ width: '10%' }}>Select</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            !isLoadingS3 ?
                                s3FilesList?.length ?
                                    s3FilesList.map((file: ICBFilesModel, index: number) => (
                                        <tr key={index}>
                                            <td>{file?.folderName} </td>
                                            <td>{file?.fileName}</td>
                                            <td>
                                                <Checkbox
                                                    groupName={'s3-files'}
                                                    value={file.filePath}
                                                    text={''}
                                                    circled={true}
                                                    checked={file.filePath === selectedFile}
                                                    onChange={e => setSelectedFile(e.value)} />
                                            </td>
                                        </tr>
                                    ))
                                    :
                                    <tr>
                                        <td colSpan={3} className="text-center text-danger" style={{ height: '150px' }}>
                                            <i>No Files available!!!</i>
                                        </td>
                                    </tr>
                                :
                                <tr>
                                    <td colSpan={3} className="text-center position-relative" style={{ height: '150px' }}>
                                        <LargeSpinner />
                                    </td>
                                </tr>
                        }
                    </tbody>
                </table>
            </div>
            {
                !isLoadingS3 &&
                <div className="row mb-2 mt-2">
                    <div className="col-12 d-flex justify-content-end pr-3">
                        <ButtonComponent text="Close"
                            disabled={isLoadingFile} onClick={props?.onClose}
                            className="btn-secondary input-md mr-3" loading={isLoadingS3} >
                            <i className="fa fa-times mr-2"></i>
                        </ButtonComponent>
                        {
                            !!s3FilesList?.length &&
                            <ButtonComponent text="Select File" spinnerRight={true}
                                disabled={!s3FilesList?.length}
                                className="btn-primary input-md" loading={isLoadingFile} onClick={onSubmit} >
                                <i className="fa fa-arrow-circle-right fa-lg ml-2"></i>
                            </ButtonComponent>
                        }
                    </div>
                </div>
            }
        </>
    );
});
