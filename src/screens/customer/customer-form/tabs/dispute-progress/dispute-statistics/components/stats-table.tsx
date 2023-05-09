import React from 'react';

export interface IStat {
    title?: string;
    status?: string;
    round?: string;
}
export const StatsTableComponent = (props: { list?: IStat[] }) => {
    return (
        <div className="table-responsive custom-scrollbar" style={{ width: '400px', maxHeight: '300px' }}>
            <table className="dataTableCustomers2 table table-striped table-hover table-sm">
                <thead className="back_table_color">
                    <tr className="secondary">
                        <th style={{ width: '50%' }}>Account Name</th>
                        <th style={{ width: '25%', textAlign: 'center' }}>Status</th>
                        <th style={{ width: '25%', textAlign: 'center' }}>Round</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props?.list?.length ?
                            props?.list?.map((acc: IStat, index: number) => {
                                return (
                                    <tr key={index}>
                                        <td className="f-11">
                                            {
                                                acc?.title
                                            }
                                        </td>
                                        <td className="text-danger text-center f-11">
                                            {
                                                acc?.status
                                            }
                                        </td>
                                        <td className="text-center f-11">
                                            {
                                                acc?.round
                                            }
                                        </td>
                                    </tr>
                                );
                            })
                            : <tr>
                                <td colSpan={3}>
                                    <i className="text-danger"> No records available!</i>
                                </td>
                            </tr>
                    }
                </tbody>
            </table>
        </div>
    );
}