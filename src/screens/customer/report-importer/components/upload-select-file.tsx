import React from 'react';
import { useState } from 'react';
import { Alignment } from '../../../../models/enums';
import { ICheckboxList } from '../../../../models/interfaces/shared';

import { RadioCheckboxList, IRadioCheckboxListOutpout } from '../../../../shared/components/radio-checkbox-list';
import { ReportTypesList } from '../import-constants';

export const UploadCreditReport = (props: { selected: ICheckboxList, onSelect: (value: ICheckboxList) => void }) => {

    const [selectedReport, setSelectedReport] = useState((props.selected || ReportTypesList[0]) as ICheckboxList);

    const onReportTypeSelect = (data: any) => {
        setSelectedReport(data);
        props.onSelect(data);
    }

    return (
        <div className="upload-report-file">
            <div className="report-types">
                <div className="row">
                    <div className="col-12 form-group form-inline">
                        <h6 className="import-label pr-5">Report Type:</h6>
                        <div className="pl-0 pl-sm-5">
                            <RadioCheckboxList
                                list={ReportTypesList}
                                selectedValue={selectedReport.value}
                                groupName={'credit-reports'}
                                alignment={Alignment.Horizontal}
                                onChange={(data: IRadioCheckboxListOutpout) => onReportTypeSelect(data)} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}