import axios, { CancelTokenSource } from 'axios';
import React, { useEffect, useState } from 'react';

import { getCCList } from '../../../../actions/create-letter.actions';
import { Messages } from '../../../../shared/constants';
import { LargeSpinner } from '../../../../shared/components/large-spinner';
import { CheckboxList } from '../../../../shared/components/checkbox-list';
import { ICCList } from '../../../../models/interfaces/create-letter';
import { Alignment } from '../../../../models/enums';
import { ICheckboxList } from '../../../../models/interfaces/shared';
import { ButtonComponent } from '../../../../shared/components/button';

export const CCListComponent = (props: { cid: string, onSelect: (list: ICCList[]) => void, selected?: string[] }) => {

    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([] as ICCList[]);
    const [checkList, setCheckList] = useState([] as ICheckboxList[]);
    const [selectedValues, setSelectedValues] = useState((props?.selected || []) as string[]);
    const [axiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);

    useEffect(() => {
        loadCCList();
        return () => {
            if (axiosSource.cancel) {
                axiosSource.cancel(Messages.APIAborted);
            }
        }
    }, [props?.cid]);

    const loadCCList = () => {
        setLoading(true);
        getCCList(props?.cid, axiosSource).then((items: ICCList[]) => {
            setLoading(false);
            setList(items);
            setCheckList(items?.map((item: ICCList) => ({ text: <span>{item?.roleName || 'Referral Agent'}:&nbsp;{item?.fullName}</span>, value: item?.email } as ICheckboxList)) as ICheckboxList[])
        }).catch((err: any) => {
            if (!axios.isCancel(err)) {
                setLoading(false);
            }
        })

    }
    const handleChange = (items: string[]) => {
        setSelectedValues(items);
    }
    const onSelect = () => {
        if (props?.onSelect) {
            const agents = list?.filter(x => selectedValues?.includes(x.email));
            props?.onSelect(agents);
        }
    }
    return (
        <div className="cc-list position-relative mb-3">
            { loading && <LargeSpinner />}
            <div className="items">
                <CheckboxList selectedValues={selectedValues || []} alignment={Alignment.Vertical}
                    list={checkList} onChange={handleChange} />
            </div>
            {
                !loading &&
                <div className="text-right">
                    <ButtonComponent text="Select" className="btn-primary" onClick={onSelect} ></ButtonComponent>
                </div>
            }
        </div>
    );
}