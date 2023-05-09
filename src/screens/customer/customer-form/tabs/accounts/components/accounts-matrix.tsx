import React, { useEffect, useState } from 'react';
import { ICollectionAccountItem } from '../../../../../../models/interfaces/customer-view';

export const AccountsMatrixComponent = (props: { accounts: ICollectionAccountItem[] }) => {

    const [disputesTU, setDisputesTU] = useState(0 as number);
    const [deletedTU, setDeletedTU] = useState(0 as number);
    const [remainingTU, setRemainingTU] = useState(0 as number);
    const [progressTU, setProgressTU] = useState('0' as string);

    const [disputesEXP, setDisputesEXP] = useState(0 as number);
    const [deletedEXP, setDeletedEXP] = useState(0 as number);
    const [remainingEXP, setRemainingEXP] = useState(0 as number);
    const [progressEXP, setProgressEXP] = useState('0' as string);

    const [disputesEQF, setDisputesEQF] = useState(0 as number);
    const [deletedEQF, setDeletedEQF] = useState(0 as number);
    const [remainingEQF, setRemainingEQF] = useState(0 as number);
    const [progressEQF, setProgressEQF] = useState('0' as string);

    useEffect(() => {
        let distu = 0, deltu = 0, remtu = 0, progtu = '0', totalTU = 0;
        let disexp = 0, delexp = 0, remexp = 0, progexp = '0', totalEXP = 0;
        let diseqf = 0, deleqf = 0, remeqf = 0, progeqf = '0', totalEQF = 0;
        props?.accounts?.forEach((account: ICollectionAccountItem) => {
            if (account?.isTransUnion) {
                totalTU++;
            }
            if (account?.objtuOutcome) {
                if ((account?.objtuOutcome?.toLowerCase() == "deleted" || account?.objtuOutcome?.toLowerCase() == "repaired" || account?.objtuOutcome?.toLowerCase() == "satisfactory")) {
                    deltu++;
                } else if ((account?.objtuOutcome?.toLowerCase()?.replace(" ", "") == "indispute" || account?.objtuOutcome?.toLowerCase()?.replace(" ", "") == "inprogress")) {
                    distu++;
                }
            }

            if (account?.isExperian) {
                totalEXP++;
            }
            if (account?.objexpOutcome) {
                if ((account?.objexpOutcome?.toLowerCase() == "deleted" || account?.objexpOutcome?.toLowerCase() == "repaired" || account?.objexpOutcome?.toLowerCase() == "satisfactory")) {
                    delexp++;
                } else if ((account?.objexpOutcome?.toLowerCase()?.replace(" ", "") == "indispute" || account?.objexpOutcome?.toLowerCase()?.replace(" ", "") == "inprogress")) {
                    disexp++;
                }
            }

            if (account?.isEquifax) {
                totalEQF++;
            }
            if (account?.objeqfOutcome) {
                if ((account?.objeqfOutcome?.toLowerCase() == "deleted" || account?.objeqfOutcome?.toLowerCase() == "repaired" || account?.objeqfOutcome?.toLowerCase() == "satisfactory")) {
                    deleqf++;
                } else if ((account?.objeqfOutcome?.toLowerCase()?.replace(" ", "") == "indispute" || account?.objeqfOutcome?.toLowerCase()?.replace(" ", "") == "inprogress")) {
                    diseqf++;
                }
            }

        });
        remtu = totalTU - (deltu + distu);
        if (totalTU) {
            progtu = ((deltu / totalTU) * 100).toFixed(2);
        }
        remexp = totalEXP - (delexp + disexp);
        if (totalEXP) {
            progexp = ((delexp / totalEXP) * 100).toFixed(2);
        }
        remeqf = totalEQF - (deleqf + diseqf);
        if (totalEQF) {
            progeqf = ((deleqf / totalEQF) * 100).toFixed(2);
        }

        setDeletedTU(deltu);
        setDeletedEXP(delexp);
        setDeletedEQF(deleqf);
        setDisputesTU(distu);
        setDisputesEXP(disexp);
        setDisputesEQF(diseqf);
        setRemainingTU(remtu);
        setRemainingEXP(remexp);
        setRemainingEQF(remeqf);
        setProgressTU(progtu);
        setProgressEXP(progexp);
        setProgressEQF(progeqf);

    }, [props?.accounts]);

    return (
        <div className="acc-stats  p-2 shadow-sm mb-1 rounded w-100 w-sm-50" >
            <div className="detail total d-flex justify-content-start mb-1">
                <label style={{ width: '135px' }}>Total Disputes:</label>
                <div className="tu-detail text-center f-12" style={{ width: '135px' }}>
                    {disputesTU}
                </div>
                <div className="exp-detail text-center f-12" style={{ width: '135px' }}>
                    {disputesEXP}
                </div>
                <div className="eqf-detail text-center f-12" style={{ width: '135px' }}>
                    {disputesEQF}
                </div>
            </div>
            <div className="detail total d-flex justify-content-start mb-1">
                <label style={{ width: '135px' }}>Total Deleted:</label>
                <div className="tu-detail text-center f-12" style={{ width: '135px' }}>
                    {deletedTU}
                </div>
                <div className="exp-detail text-center f-12" style={{ width: '135px' }}>
                    {deletedEXP}
                </div>
                <div className="eqf-detail text-center f-12" style={{ width: '135px' }}>
                    {deletedEQF}
                </div>
            </div>
            <div className="detail total d-flex justify-content-start mb-1">
                <label style={{ width: '135px' }}>Total Remaining:</label>
                <div className="tu-detail text-center f-12" style={{ width: '135px' }}>
                    {remainingTU}
                </div>
                <div className="exp-detail text-center f-12" style={{ width: '135px' }}>
                    {remainingEXP}
                </div>
                <div className="eqf-detail text-center f-12" style={{ width: '135px' }}>
                    {remainingEQF}
                </div>
            </div>
            <div className="detail total d-flex justify-content-start mb-1">
                <label style={{ width: '135px' }}>Total Progress:</label>
                <div className="tu-detail text-center f-12" style={{ width: '135px' }}>
                    {progressTU}%
                </div>
                <div className="exp-detail text-center f-12" style={{ width: '135px' }}>
                    {progressEXP}
                </div>
                <div className="eqf-detail text-center f-12" style={{ width: '135px' }}>
                    {progressEQF}%
                </div>
            </div>
        </div>
    );
}