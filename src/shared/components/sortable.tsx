import React, { useState } from 'react'
import { SortOrderType } from '../../models/enums';
import { CommonUtils } from '../../utils/common-utils';

export const Sortable = (props: {
    data: any,
    sortKey: string,
    sort: any,
    children: any,
    currentKey?: string
}) => {
    const [orderType, setOrderType] = useState(SortOrderType.ASC);
    const [sortColumn, setSortColumn] = useState('');

    const onSort = () => {
        if (props?.data && props?.data.length) {
            let sortOrder = orderType;
            if (props?.sortKey !== props?.currentKey) {
                sortOrder = SortOrderType.ASC
            } else {
                sortOrder = sortOrder === SortOrderType.ASC ? SortOrderType.DESC : SortOrderType.ASC;
            }
            setOrderType(sortOrder)
            setSortColumn(props?.sortKey);
            const sortedAccount = [...props?.data];
            sortedAccount.sort((a, b) => {
                return CommonUtils.customSort(a, b, sortOrder, props?.sortKey)
            });
            return props?.sort(sortedAccount, props?.sortKey);
        }
    }
    return (
        <span onClick={onSort} className="pointer d-flex align-items-center">
            {props?.children}
            {props?.currentKey === props?.sortKey ? <i className={`fa fa-2x fa-sort-${orderType === SortOrderType.ASC ? 'up mt-2' : 'down mb-2'}`}></i> : null}
        </span>
    )
}
