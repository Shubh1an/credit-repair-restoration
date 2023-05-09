import React from 'react';
import { EnumBureausShorts } from '../../../../models/enums';
import { BureauLogoComponent } from '../../../../shared/components/bureau-logo';


export const CBPersonalDetails = (props: any) => {
    return (
        <div className="cb-personal-details">
            <div className="clsPersonalProfile">
                <div className="headerSection">
                    <i className="fa fa-user mr-2"></i>
                    <span>Personal Profile</span>
                </div>
                <div className="DetailsSection">
                    <div className="headerDescription">
                        <span>Below is your personal information as it appears in your credt file. This information includes your legel name, current and previous addresses, employement information and other details.</span>
                    </div>
                    <table cellSpacing="0" cellPadding="0" id="tblPersonal">
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
                                    <span className="leftHeader">Credit Report Date :</span>
                                </td>
                                <td>
                                </td>
                                <td>
                                </td>
                                <td>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span className="leftHeader">Name :</span>
                                </td>
                                <td>
                                    {props?.customer?.fullName}
                                </td>
                                <td>
                                    {props?.customer?.fullName}
                                </td>
                                <td>
                                    {props?.customer?.fullName}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span className="leftHeader">Also Known As:</span>
                                </td>
                                <td>
                                </td>
                                <td>

                                </td>
                                <td>

                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <span className="leftHeader">Former :</span>
                                </td>
                                <td>
                                </td>
                                <td>
                                </td>
                                <td>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span className="leftHeader">Date of Birth:</span>
                                </td>
                                <td>
                                    {props?.customer?.dateOfBirth}</td>
                                <td>
                                    {props?.customer?.dateOfBirth}</td>
                                <td>
                                    {props?.customer?.dateOfBirth}</td>
                            </tr>
                            <tr>
                                <td>
                                    <span className="leftHeader">Current Address(es):</span>
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>
                                    <span className="leftHeader">Previous Address(es):</span>
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>
                                    <span className="leftHeader">Current Employer:</span>
                                </td>
                                <td>
                                </td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr className="profile-fraudalerts">
                                <td>
                                    <span className="leftHeader">Fraud Alert:</span>
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

}