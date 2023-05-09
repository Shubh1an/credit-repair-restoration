import React, { useEffect, useState } from 'react';


export const CBCreditInquiries = (props: any) => {
    const [records, setRecords] = useState([] as any[]);
    useEffect(() => {
        if (props?.inquiries) {
            setRecords(getList());
        }
    }, [props])
    const getList = () => {
        let list = [] as any[];
        let flatList = props?.inquiries?.flatMap((x: any) => x.inquiry);
        flatList.forEach((item: any, index: number) => {
            let JQCreditEnquiry = {} as any;
            JQCreditEnquiry.BankName = item.subscriberName.replace(/\s+/g, ' ');
            JQCreditEnquiry.CreditType = (item.industryCode && item.industryCode.description && item.industryCode.description.replace(/\s+/g, ' ')) || '-';
            JQCreditEnquiry.CreditDate = getDateInMMDDYYYY(item.inquiryDate.replace(/\s+/g, ' '));

            const dateArr = JQCreditEnquiry.CreditDate.split('/');

            const year = +dateArr[2];
            const month = +dateArr[0];
            const day = +dateArr[1];

            JQCreditEnquiry.InqueryDate = new Date(year, month, day);

            let description = item.source.bureau.description;

            JQCreditEnquiry.Bureau = description;

            list.push(JQCreditEnquiry);
        });

        list.sort((a, b) => b.InqueryDate - a.InqueryDate); // sorting in descendng order

        return list;
    }
    const getDateInMMDDYYYY = (date: string) => {
        if (date && date.indexOf('-') != -1) {
            let arr = date.split('-');
            return (arr[1] + '/' + arr[2] + '/' + arr[0]);
        }
    }
    return (
        <div className="clsCreditEnquiries">
            <div className="headerSection">
                <i className="fa mr-2 fa-legal"></i>
                <span>Credit Inquiries</span>
            </div>
            <div className="DetailsSection">
                <div className="headerDescription">
                    <span>Below are the names of people and/or organizations who have obtained a copy of your Credit Report. Inquiries such as these can remain on your credit file for up to two years.</span>
                </div>
                <table cellSpacing="0" cellPadding="0" id="tblCreditEnquiries">
                    <tbody><tr className="enquiryHistoryHeaderInq">
                        <th>
                            Creditor Name
                        </th>
                        <th>Type of Business</th>
                        <th>Date of inquiry</th>
                        <th>Credit Bureau</th>
                    </tr>
                        {
                            records?.map((item: any, index: number) => <tr key={index} className="clsCreditEnquiriesMain">
                                <td>
                                    {item?.BankName}
                                </td>
                                <td>
                                    {item?.CreditType}

                                </td>
                                <td>
                                    {item?.CreditDate}

                                </td>
                                <td>
                                    {item?.Bureau}
                                </td>
                            </tr>)
                        }

                    </tbody>
                </table>
            </div>
        </div>
    );

}