import React, { useEffect, useState } from 'react';
import { EnumBureausShorts } from '../../../../models/enums';
import { BureauLogoComponent } from '../../../../shared/components/bureau-logo';


export const CBCreditScoreDetails = (props: any) => {

    const [tu, setTU] = useState(null as any);
    const [exp, setEXP] = useState(null as any);
    const [eqf, setEQF] = useState(null as any);

    useEffect(() => {
        setEXP(props?.score?.find((x: any) => x.source.bureau.symbol === 'EXP'));
        setEQF(props?.score?.find((x: any) => x.source.bureau.symbol === 'EQF'));
        setTU(props?.score?.find((x: any) => x.source.bureau.symbol === 'TUC'));
    }, [props]);

    return (
        <div className="cb-personal-details">
            <div className="clsCreditScore">
                <div className="headerSection">
                    <i className="fa fa-rocket mr-2"></i>
                    <span>Credit Score</span>
                </div>
                <div className="DetailsSection">
                    <div className="headerDescription">
                        <span>Your Credit Score is a representation of your overall credit health. Most lenders utilize some form of credit scoring to help determine your credit worthiness.</span>
                    </div>
                    <table cellSpacing="0" cellPadding="0" id="tblCreditScore">
                        <tbody><tr>
                            <th className="class1"></th>
                            <th className="classTH3">
                                <BureauLogoComponent type={EnumBureausShorts.TU} size={'md'} />
                            </th>
                            <th className="classTH1">
                                <BureauLogoComponent type={EnumBureausShorts.EXP} size={'md'} />
                            </th>
                            <th className="classTH2">
                                <BureauLogoComponent type={EnumBureausShorts.EQF} size={'md'} />
                            </th>
                        </tr>
                            <tr>
                                <td>
                                    <span className="leftHeader">Credit/Beacon Score :</span>
                                </td>
                                <td className="text-center">
                                    {
                                        tu?.riskScore
                                    }
                                </td>
                                <td className="text-center">
                                    {
                                        exp?.riskScore
                                    }
                                </td>
                                <td className="text-center">
                                    {
                                        eqf?.riskScore
                                    }
                                </td>
                            </tr>

                            <tr className="lenderRank">
                                <td>
                                    <span className="leftHeader">Lender Rank :</span>
                                </td>
                                <td className="text-center">
                                    {
                                        tu?.populationRank
                                    }
                                </td>
                                <td className="text-center">
                                    {
                                        exp?.populationRank
                                    }
                                </td>
                                <td className="text-center">
                                    {
                                        eqf?.populationRank
                                    }
                                </td>
                            </tr>
                            <tr className="scorescale">
                                <td>
                                    <span className="leftHeader">Score Scale:</span>
                                </td>
                                <td className="text-center">
                                    {
                                        tu?.scoreName
                                    }
                                </td>
                                <td className="text-center">
                                    {
                                        exp?.scoreName
                                    }
                                </td>
                                <td className="text-center">
                                    {
                                        eqf?.scoreName
                                    }
                                </td>
                            </tr>


                        </tbody></table>

                </div>
            </div>
        </div>
    );

}