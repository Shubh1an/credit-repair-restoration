import React, { useEffect, useState } from 'react';
import { EnumBureausShorts } from '../../../../models/enums';

import { IImportAccountHistory, IImportCreditInquiry, IImportPublicRecords, IImportReportStats } from '../../../../models/interfaces/importer';
import { BureauLogoComponent } from '../../../../shared/components/bureau-logo';
import { ImporterUtils } from '../../../../utils/importer-utils';

export const ReportStatsComponent = (props: {
    historyData: IImportAccountHistory[] | null,
    inquiriesData: IImportCreditInquiry[] | null,
    publicRecordData: IImportPublicRecords[] | null
}) => {
    const [statsSum, setStateSum] = useState(null as IImportReportStats | null);

    useEffect(() => {
        AnalyzeAccounts();
    }, [props]);

    const AnalyzeAccounts = () => {
        const { historyData, inquiriesData, publicRecordData } = props;
        const data = ImporterUtils.AnalyzeAccounts({ historyData, inquiriesData, publicRecordData });
        setStateSum(data);
    }
    return (
        statsSum &&
        <div className="form-group">
            <label>Report Statistics:</label>
            <div className="table-responsive list-scrollable custom-scrollbar import-report-stats-table">
                <table className="dataTableCustomers table table-striped table-hover">
                    <thead className="back_table_color">
                        <tr className="secondary">
                            <th>
                                Type
                            </th>
                            <th className="text-center">
                                <BureauLogoComponent type={EnumBureausShorts.TU} size={'sm'} />
                            </th>
                            <th className="text-center">
                                <BureauLogoComponent type={EnumBureausShorts.EXP} size={'sm'} />
                            </th>
                            <th className="text-center">
                                <BureauLogoComponent type={EnumBureausShorts.EQF} size={'sm'} />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="tdlefttext">
                                Inquiries:
                            </td>
                            <td>
                                <label >
                                    {statsSum?.numtuinquiriestoimport ?? 0}
                                </label>
                            </td>
                            <td>
                                <label  >
                                    {statsSum?.numexpinquiriestoimport ?? 0}
                                </label>
                            </td>
                            <td>
                                <label  >
                                    {statsSum?.numeqfinquiriestoimport ?? 0}
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <td className="tdlefttext">Accounts:
                            </td>
                            <td>
                                <label  >
                                    {statsSum?.numtuaccountstoimport ?? 0}
                                </label>
                            </td>
                            <td>
                                <label >
                                    {statsSum?.numexpaccountstoimport ?? 0}
                                </label>
                            </td>
                            <td>
                                <label >
                                    {statsSum?.numeqfaccountstoimport ?? 0}
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <td className="tdlefttext">Public&nbsp;Records:
                            </td>
                            <td>
                                <label >
                                    {statsSum?.numtupubrecstoimport ?? 0}
                                </label>
                            </td>
                            <td>
                                <label >
                                    {statsSum?.numexppubrecstoimport ?? 0}
                                </label>
                            </td>
                            <td>
                                <label >
                                    {statsSum?.numeqfpubrecstoimport ?? 0}
                                </label>
                            </td>
                        </tr>
                        <tr >
                            <td className="tdlefttext">
                                Negative:
                            </td>
                            <td>
                                <label >
                                    {statsSum?.numtuneg ?? 0}
                                </label>
                            </td>
                            <td>
                                <label >
                                    {statsSum?.numexpneg ?? 0}
                                </label>
                            </td>
                            <td>
                                <label  >
                                    {statsSum?.numeqfneg ?? 0}
                                </label>
                            </td>
                        </tr>
                        <tr >
                            <td className="tdlefttext">
                                Questionable:
                            </td>
                            <td>
                                <label  >
                                    {statsSum?.numtuquest ?? 0}
                                </label>
                            </td>
                            <td>
                                <label >
                                    {statsSum?.numexpquest ?? 0}
                                </label>
                            </td>
                            <td>
                                <label >
                                    {statsSum?.numeqfquest ?? 0}
                                </label>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}