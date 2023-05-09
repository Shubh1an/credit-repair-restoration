import React, { useState } from 'react';
import { useEffect } from 'react';
// @ts-ignore
import { AccordionWithHeader, AccordionNode, AccordionHeader, AccordionPanel } from 'react-accordion-with-header';
import { IHTMLParserData } from '../../../../../models/interfaces/importer';
import { EnumImportSection, ImporterSections, ReportType } from '../../import-constants';

export const ReportSections = (
    props: {
        data: IHTMLParserData | null,
        onProfileChange: any,
        onScoreChange: any,
        onSummaryChange: any,
        onHistoryChange: any,
        onInquiriesChange: any,
        onPublicRecordChange: any,
        onGlobalReasonChange: any,
        reportType: ReportType
    }
) => {

    const [openedIndex, setOpenedIndex] = useState(-1 as number);

    useEffect(() => {
        setOpenedIndex(-1);
    }, [props?.data]);

    const actionCallback = (panels: any, state: any) => {
        let index = -1;
        if (state?.active?.length) {
            index = state?.active[0];
            setOpenedIndex(index);
        } else {
            setOpenedIndex(index);
        }
    }
    const onDataChange = (data: any, key: EnumImportSection) => {
        switch (key) {
            case EnumImportSection.Personal:
                props?.onProfileChange(data);
                break;
            case EnumImportSection.CreditScore:
                props?.onScoreChange(data);
                break;
            case EnumImportSection.CreditSummary:
                props?.onSummaryChange(data);
                break;
            case EnumImportSection.AccountHistory:
                props?.onHistoryChange(data);
                break;
            case EnumImportSection.CreditInquiry:
                props?.onInquiriesChange(data);
                break;
            case EnumImportSection.PublicRecords:
                props?.onPublicRecordChange(data);
                break;
        }
    }
    return (
        <div className="row access-container ">
            <div className="col-12 all-screens-list">
                <AccordionWithHeader actionCallback={actionCallback} className="my-acc-demo accordion-with-header-root">
                    {
                        ImporterSections.map((item, index) => {
                            return (
                                <AccordionNode key={index} className="my-acc-node accordion-node">
                                    <AccordionHeader horizontalAlignment="centerSpaceBetween"
                                        verticalAlignment="center" className="my-acc-header accordion-header">
                                        <div className="toggle-container">
                                            <i className={"text-light fa fa-chevron-" + (openedIndex === index ? 'down' : 'right')}></i>
                                        </div>
                                        <div className="title-container d-flex align-items-center" >
                                            <h5 className="text-light">
                                                {item.title}
                                            </h5>
                                        </div>
                                    </AccordionHeader>
                                    <AccordionPanel className="accordion-panel">
                                        <div className="import-section">
                                            <div className="sub-title">
                                                {item.subTitle}
                                            </div>
                                            <div className="section-body pr-4">
                                                {
                                                    <item.component data={props?.data}
                                                        onChange={(data: any) => onDataChange(data, item.key)}
                                                        reportType={props?.reportType}
                                                        onGlobalReasonChange={props?.onGlobalReasonChange}
                                                    />
                                                }
                                            </div>
                                        </div>
                                    </AccordionPanel>
                                </AccordionNode>
                            );
                        })
                    }
                </AccordionWithHeader>
            </div>
        </div>

    );
}