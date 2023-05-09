import React, { useEffect, useState } from 'react';
import axios, { CancelTokenSource } from 'axios';
import { useParams } from 'react-router-dom';
import toastr from 'toastr';

import './cb-report-viewer.scss';
import { CBPersonalDetails } from './components/cb-personal-details';
import { CBCreditScoreDetails } from './components/cb-creditscore-details';
import { CBCreditSummary } from './components/cb-credit-summary';
import { CBAccountHistory } from './components/cb-account-history';
import { CBCreditInquiries } from './components/cb-credit-inquiries';
import { CBPublicRecords } from './components/cb-public-records';
import { getS3Files, getS3SingleFile } from '../../../actions/customers.actions';
import { ModalComponent } from '../../../shared/components/modal';
import { CBFilesList } from './components/cb-files-list';
import { LargeSpinner } from '../../../shared/components/large-spinner';
import { Messages } from '../../../shared/constants';
import { withAuthorize } from '../../../shared/hoc/authorize';
import { EnumScreens } from '../../../models/enums';

const CBReportViewerComponent = ((props: any) => {

    const [axiosSource] = useState({} as CancelTokenSource);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [customer, setCustomer] = useState(null as any);
    const [files, setFiles] = useState([] as any[]);
    const [selectedFile, setSelectedFile] = useState(null as any);
    const { cid, date } = useParams() as { cid: string, date: string };

    useEffect(() => {
        const fetchS3List = () => {
            setIsLoading(true);
            getS3Files(cid, 100, date, axiosSource)
                .then((result: any[]) => {
                    setIsLoading(false);
                    setFiles(result);
                    if (result?.length === 1) {
                        getSingleFile(result[0]?.filePath);
                    } else {
                        setShowModal(true);
                    }
                })
                .catch((err: any) => {
                    setIsLoading(false);
                    toastr.error(Messages.GenericError);
                })
        }
        if (cid && date) {
            fetchS3List();
        }
        return () => {
            if (axiosSource?.cancel) {
                axiosSource.cancel(Messages.APIAborted);
            }
        }
    }, [cid, date])
    const getSingleFile = (filename: string) => {
        setIsLoading(true);
        getS3SingleFile(cid, filename, axiosSource)
            .then((fileData: any) => {
                setIsLoading(false);
                setSelectedFile(fileData?.file);
                setCustomer(fileData?.customer);
            })
            .catch((err: any) => {
                setIsLoading(false);
                toastr.error(Messages.GenericError);
            })
    }
    return (
        <div className="cb-viewer">
            <section className="content-header">
                <div className="header-icon">
                    <i className="fa fa-dashboard"></i>
                </div>
                <div className="header-title">
                    <h1>Credit Bliss Report Viewer</h1>
                    <small>View Credit Bliss reports here</small>
                </div>
            </section>
            <section className="content f-12 position-relative" style={{ minHeight: '74vh' }}>
                {isLoading && <LargeSpinner />}
                {selectedFile &&
                    <>
                        <div className="row">
                            <div className="col-12">
                                <CBPersonalDetails customer={customer} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <CBCreditScoreDetails score={(selectedFile?.borrower?.length ? selectedFile?.borrower[0]?.creditScore : null)} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <CBCreditSummary summary={selectedFile?.summary} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <CBAccountHistory history={selectedFile?.tradeLinePartition} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <CBCreditInquiries inquiries={selectedFile?.inquiryPartition} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <CBPublicRecords records={selectedFile?.pulblicRecordPartition} />
                            </div>
                        </div>
                    </>
                }
            </section>
            <ModalComponent title={'Select file from the list'} hideClose={true} isVisible={showModal} onClose={() => setShowModal(false)}>
                <CBFilesList s3Folder={date} files={files} onSelect={(file: any) => { getSingleFile(file?.filePath) }} onClose={() => setShowModal(false)} />
            </ModalComponent>
        </div>
    );
})

export default withAuthorize(CBReportViewerComponent, EnumScreens.CBReportViewer);