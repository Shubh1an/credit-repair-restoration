import React, { useState, useEffect } from 'react';

import { EnumBureausShorts, EnumComponentMode, EnumControlTypes } from '../../../../../models/enums';
import { IHTMLParserData, IImportPersonalDetails } from '../../../../../models/interfaces/importer';
import { BureauLogoComponent } from '../../../../../shared/components/bureau-logo';
import { FEAccountField } from '../../../../../shared/components/fe-account-field';


export const ImportPersonaldetailsComponent = (props: { data: IHTMLParserData | null, onChange: any }) => {

    const [formData, setformData] = useState(props?.data?.personalDetails as IImportPersonalDetails || {});

    useEffect(() => {
        setformData(props?.data?.personalDetails || {});
        if (props?.onChange && props?.data?.personalDetails) {
            props?.onChange(props?.data?.personalDetails || {});
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
        <div className="personal-details">
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
                <div className="col-3 text-right d-flex align-items-center justify-content-end f-13">Credit Report Date :</div>
                <div className="col-3 ">
                    <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.TextBox} value={formData?.crDateTU} onChange={(e) => onFieldChange('crDateTU', e)} />
                </div>
                <div className="col-3 ">
                    <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.TextBox} value={formData?.crDateEXP} onChange={(e) => onFieldChange('crDateEXP', e)} />

                </div>
                <div className="col-3">
                    <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.TextBox} value={formData?.crDateEQF} onChange={(e) => onFieldChange('crDateEQF', e)} />

                </div>
            </div>
            <div className="row">
                <div className="col-3 text-right d-flex align-items-center justify-content-end f-13">Name :</div>
                <div className="col-3">
                    <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.TextBox} value={formData?.NameTU} onChange={(e) => onFieldChange('NameTU', e)} />
                </div>
                <div className="col-3">
                    <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.TextBox} value={formData?.NameEXP} onChange={(e) => onFieldChange('NameEXP', e)} />

                </div>
                <div className="col-3">
                    <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.TextBox} value={formData?.NameEQF} onChange={(e) => onFieldChange('NameEQF', e)} />

                </div>
            </div>
            <div className="row">
                <div className="col-3 text-right d-flex align-items-center justify-content-end f-13">Also Known As :</div>
                <div className="col-3">
                    <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.TextBox} value={formData?.KnownAsTU} onChange={(e) => onFieldChange('KnownAsTU', e)} />
                </div>
                <div className="col-3">
                    <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.TextBox} value={formData?.KnownAsEXP} onChange={(e) => onFieldChange('KnownAsEXP', e)} />

                </div>
                <div className="col-3">
                    <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.TextBox} value={formData?.KnownAsEQF} onChange={(e) => onFieldChange('KnownAsEQF', e)} />

                </div>
            </div>
            <div className="row">
                <div className="col-3 text-right d-flex align-items-center justify-content-end f-13">Former :</div>
                <div className="col-3">
                    <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.TextBox} value={formData?.formerTU} onChange={(e) => onFieldChange('formerTU', e)} />
                </div>
                <div className="col-3">
                    <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.TextBox} value={formData?.formerEXP} onChange={(e) => onFieldChange('formerEXP', e)} />

                </div>
                <div className="col-3">
                    <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.TextBox} value={formData?.formerEQF} onChange={(e) => onFieldChange('formerEQF', e)} />

                </div>
            </div>
            <div className="row">
                <div className="col-3 text-right d-flex align-items-center justify-content-end f-13">Date of Birth :</div>
                <div className="col-3">
                    <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.TextBox} value={formData?.DOBTU} onChange={(e) => onFieldChange('DOBTU', e)} />
                </div>
                <div className="col-3">
                    <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.TextBox} value={formData?.DOBEXP} onChange={(e) => onFieldChange('DOBEXP', e)} />

                </div>
                <div className="col-3">
                    <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.TextBox} value={formData?.DOBEQF} onChange={(e) => onFieldChange('DOBEQF', e)} />

                </div>
            </div>
            <div className="row">
                <div className="col-3 text-right pt-1 d-flex align-items-start justify-content-end f-13">Current Address(es) :</div>
                <div className="col-3">
                    {
                        formData?.CurrAddressTU?.map((x, index) => {
                            return <FEAccountField key={index} mode={EnumComponentMode.Add} type={EnumControlTypes.TextArea} value={x} onChange={(e) => onFieldChange('CurrAddressTU' + (index + 1), e)} />
                        })
                    }
                </div>
                <div className="col-3">
                    {
                        formData?.CurrAddressEXP?.map((x, index) => {
                            return <FEAccountField key={index} mode={EnumComponentMode.Add} type={EnumControlTypes.TextArea} value={x} onChange={(e) => onFieldChange('CurrAddressEXP' + (index + 1), e)} />
                        })
                    }
                </div>
                <div className="col-3">
                    {
                        formData?.CurrAddressEQF?.map((x, index) => {
                            return <FEAccountField key={index} mode={EnumComponentMode.Add} type={EnumControlTypes.TextArea} value={x} onChange={(e) => onFieldChange('CurrAddressEQF' + (index + 1), e)} />
                        })
                    }
                </div>
            </div>
            <div className="row">
                <div className="col-3 text-right pt-1 d-flex align-items-start justify-content-end f-13">Previous Address(es) :</div>
                <div className="col-3">
                    {
                        formData?.PrevAddressesTU?.map((x, index) => {
                            return <FEAccountField key={index} mode={EnumComponentMode.Add} type={EnumControlTypes.TextArea} value={x} onChange={(e) => onFieldChange('PrevAddressesTU' + (index + 1), e)} />
                        })
                    }
                </div>
                <div className="col-3">
                    {
                        formData?.PrevAddressesEXP?.map((x, index) => {
                            return <FEAccountField key={index} mode={EnumComponentMode.Add} type={EnumControlTypes.TextArea} value={x} onChange={(e) => onFieldChange('PrevAddressesEXP' + (index + 1), e)} />
                        })
                    }
                </div>
                <div className="col-3">
                    {
                        formData?.PrevAddressesEQF?.map((x, index) => {
                            return <FEAccountField key={index} mode={EnumComponentMode.Add} type={EnumControlTypes.TextArea} value={x} onChange={(e) => onFieldChange('PrevAddressesEQF' + (index + 1), e)} />
                        })
                    }
                </div>
            </div>
            <div className="row">
                <div className="col-3 text-right d-flex align-items-center justify-content-end f-13">Current Employer :</div>
                <div className="col-3">
                    <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.TextBox} value={formData?.CurrentEmployerTU} onChange={(e) => onFieldChange('CurrentEmployerTU', e)} />
                </div>
                <div className="col-3">
                    <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.TextBox} value={formData?.CurrentEmployerEXP} onChange={(e) => onFieldChange('CurrentEmployerEXP', e)} />
                </div>
                <div className="col-3">
                    <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.TextBox} value={formData?.CurrentEmployerEQF} onChange={(e) => onFieldChange('CurrentEmployerEQF', e)} />
                </div>
            </div>
            <div className="row">
                <div className="col-3 text-right d-flex align-items-center justify-content-end f-13">Fraud Alert :</div>
                <div className="col-3">
                    <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.TextBox} value={formData?.AlertTU} onChange={(e) => onFieldChange('AlertTU', e)} />
                </div>
                <div className="col-3">
                    <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.TextBox} value={formData?.AlertEXP} onChange={(e) => onFieldChange('AlertEXP', e)} />

                </div>
                <div className="col-3">
                    <FEAccountField mode={EnumComponentMode.Add} type={EnumControlTypes.TextBox} value={formData?.AlertEQF} onChange={(e) => onFieldChange('AlertEQF', e)} />

                </div>
            </div>
        </div>
    );

}