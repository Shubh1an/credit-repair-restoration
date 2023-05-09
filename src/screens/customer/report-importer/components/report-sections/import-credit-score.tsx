import React, { useEffect, useState } from 'react';

import { EnumBureausShorts, EnumComponentMode, EnumControlTypes } from '../../../../../models/enums';
import { IHTMLParserData, IImportCreditScore } from '../../../../../models/interfaces/importer';
import { BureauLogoComponent } from '../../../../../shared/components/bureau-logo';
import { FEAccountField } from '../../../../../shared/components/fe-account-field';


export const ImportCreditScoreComponent = (props: { data: IHTMLParserData | null, onChange: any }) => {
    const [formData, setformData] = useState(props?.data?.creditScoreDetails as IImportCreditScore || {});

    useEffect(() => {
        setformData(props?.data?.creditScoreDetails || {});
        if (props?.onChange && props?.data?.creditScoreDetails) {
            props?.onChange(props?.data?.creditScoreDetails || {});
        }
    }, [props?.data]);

    const onFieldChange = (fieldName: string, value: any) => {
        const newFormData = {
            ...formData,
            [fieldName]: value
        };
        setformData(newFormData);
        if (props?.onChange) {
            props?.onChange(newFormData);
        }
    }
    return (
        <div className="credit-score">
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
            <div className="row">
                <div className="col-3 text-right d-flex align-items-center justify-content-end f-13">Credit/Beacon Score :</div>
                <div className="col-3 ">
                    <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.Number} value={formData?.CreditScoreTU} onChange={(e) => onFieldChange('CreditScoreTU', e)} />
                </div>
                <div className="col-3 ">
                    <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.Number} value={formData?.CreditScoreEXP} onChange={(e) => onFieldChange('CreditScoreEXP', e)} />
                </div>
                <div className="col-3">
                    <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.Number} value={formData?.CreditScoreEQF} onChange={(e) => onFieldChange('CreditScoreEQF', e)} />
                </div>
            </div>
            <div className="row">
                <div className="col-3 text-right d-flex align-items-center justify-content-end f-13">Lender Rank :</div>
                <div className="col-3 ">
                    <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.TextBox} value={formData?.RankTU} onChange={(e) => onFieldChange('RankTU', e)} />
                </div>
                <div className="col-3 ">
                    <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.TextBox} value={formData?.RankEXP} onChange={(e) => onFieldChange('RankEXP', e)} />
                </div>
                <div className="col-3">
                    <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.TextBox} value={formData?.RankEQF} onChange={(e) => onFieldChange('RankEQF', e)} />
                </div>
            </div>
            <div className="row">
                <div className="col-3 text-right d-flex align-items-center justify-content-end f-13">Score Scale :</div>
                <div className="col-3 ">
                    <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.TextBox} value={formData?.ScoreScaleTU} onChange={(e) => onFieldChange('ScoreScaleTU', e)} />
                </div>
                <div className="col-3 ">
                    <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.TextBox} value={formData?.ScoreScaleEXP} onChange={(e) => onFieldChange('ScoreScaleEXP', e)} />
                </div>
                <div className="col-3">
                    <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.TextBox} value={formData?.ScoreScaleEQF} onChange={(e) => onFieldChange('ScoreScaleEQF', e)} />
                </div>
            </div>
        </div>
    );

}