import moment from 'moment';
import React, { useState } from 'react';

export const DateRangeComponent = (props: any) => {

    const [from, setFrom] = useState('' as any);
    const [to, setTo] = useState('' as any);

    const onInputChange = (ev: any) => {
        const name = ev.target.name;
        if (name === 'from') {
            setFrom(ev.target.value);
        } else {
            setTo(ev.target.value);
        }
    }
    const onSearch = () => {
        props?.onChange({ from: moment(from).format('MM/DD/YYYY'), to: moment(to).format('MM/DD/YYYY') });
    }
    return (
        <div className='date-range-controls '>
            <div className='row m-0'>
                <div className='col-5 form-group form-inline p-0'>
                    <label className='pr-1 f-12'>From:</label>
                    <input className='form-control input-sm p-1' name='from' value={getDateForPicker(from)} onChange={onInputChange} type='date' />
                </div>
                <div className='col-5 form-group form-inline p-0'>
                    <label className='pr-1 f-12'>To:</label>
                    <input className='form-control input-sm p-1' name='to' value={getDateForPicker(to)} onChange={onInputChange} type='date' />
                </div>
                <div className='col-2 p-0 form-group form-inline'>
                    <label> &nbsp;</label>
                    <button disabled={!from || !to} className="btn  btn-sm btn-primary form-control f-10 p-1  pl-2 pr-2 ml-1" onClick={onSearch}><i className="fa fa-search"></i></button>
                </div>
            </div>
        </div>
    );
}
const getDateForPicker = (d?: string): string => {
    const dd = moment(d).format("YYYY-MM-DD");
    return (dd !== '0001-01-01' && dd !== '1900-01-01') ? dd : '';
}