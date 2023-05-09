import React from 'react';

export const CBFilesList = (props: { s3Folder: string, onSelect: any, onClose: any, files: { fileName: string, folderName: string, filePath: string }[] }) => {
    return (
        <div className="cb-list table-responsive">
            <h6 className="mb-2">Available files for {props?.s3Folder}</h6>
            <table className='dataTableCustomers table table-striped table-hover mb-0'>
                <thead className='back_table_color'>
                    <tr className={'table-active'}>
                        <th style={{ width: '20%' }}>
                            Date(yy-mm-dd)
                        </th>
                        <th style={{ width: '60%' }}>File Name</th>
                        <th style={{ width: '20%' }}></th>
                    </tr>
                    {
                        props?.files?.length ?
                            props?.files?.map((item: any, index: number) =>
                            (<tr key={index} className="table-light">
                                <td className="text-left align-middle pl-2">{item?.folderName}</td>
                                <td className="text-left align-middle pl-2">{item?.fileName}</td>
                                <td className="text-center align-middle">
                                    <button className="btn btn-primary input-sm btn-sm pointer"
                                        onClick={e => { props?.onSelect(item); props?.onClose() }}> Select </button>
                                </td>
                            </tr>))
                            :
                            <tr>
                                <td colSpan={3} className="text-center f-15 text-danger">
                                    <i>No files found!</i>
                                </td>
                            </tr>
                    }

                </thead>
            </table>
            <em style={{ color: 'red', fontSize: '12px' }}>*(latest on top)</em>
        </div>
    );
}