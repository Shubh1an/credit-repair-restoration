import React, { useEffect, useState } from 'react';
import { EnumBureausShorts, EnumComponentMode, EnumControlTypes } from '../../../../../models/enums';

import { IHTMLParserData, IImportCreditSummary } from '../../../../../models/interfaces/importer';
import { BureauLogoComponent } from '../../../../../shared/components/bureau-logo';
import { FEAccountField } from '../../../../../shared/components/fe-account-field';


export const ImportCreditSummaryComponent = (props: { data: IHTMLParserData | null, onChange: any }) => {
    const [formData, setformData] = useState(props?.data?.creditSummaries as IImportCreditSummary[] || []);

    useEffect(() => {
        setformData(props?.data?.creditSummaries || []);
        if (props?.onChange && props?.data?.creditSummaries) {
            props?.onChange(props?.data?.creditSummaries || []);
        }
    }, [props?.data]);

    const onFieldChange = (fieldName: string, value: any, index: number) => {
        let copy = JSON.parse(JSON.stringify(formData));
        const rowData = copy[index];
        const newRowData = {
            ...rowData,
            [fieldName]: value
        };
        copy.splice(index, 1, newRowData);
        setformData(copy);
        if (props?.onChange) {
            props?.onChange(copy);
        }
    }
    return (
        <div className="credit-summary">
            <div className="row">
                <div className="col-3"></div>
                <div className="col-3 tu-head">
                    <BureauLogoComponent type={EnumBureausShorts.TU} size={'md'} />
                </div>
                <div className="col-3 exp-head">
                    <BureauLogoComponent type={EnumBureausShorts.EXP} size={'md'} />
                </div>
                <div className="col-3 eq-head">
                    <BureauLogoComponent type={EnumBureausShorts.EQF} size={'md'} />
                </div>
            </div>
            {
                formData?.map((summary, index) => (
                    <div className="row" key={index}>
                        <div className="col-3 text-right d-flex align-items-center justify-content-end f-13">{summary?.creditParam} :</div>
                        <div className="col-3 ">
                            <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.TextBox} value={summary?.creditParamValueTU} onChange={(e) => onFieldChange('creditParamValueTU', e, index)} />
                        </div>
                        <div className="col-3 ">
                            <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.TextBox} value={summary?.creditParamValueEXP} onChange={(e) => onFieldChange('creditParamValueEXP', e, index)} />
                        </div>
                        <div className="col-3">
                            <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.TextBox} value={summary?.creditParamValueEQF} onChange={(e) => onFieldChange('creditParamValueEQF', e, index)} />
                        </div>
                    </div>
                ))
            }
        </div>
    );

}