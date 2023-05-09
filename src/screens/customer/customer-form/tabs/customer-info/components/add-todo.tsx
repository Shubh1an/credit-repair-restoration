import React, { useState } from 'react';
import moment from 'moment';

import { ButtonComponent } from '../../../../../../shared/components/button';
import { asyncComponent } from '../../../../../../shared/components/async-component';
const AsyncHTMLEditor = asyncComponent(() => import('../../../../../../shared/components/html-editor'));


export const AddTodoComponent = (props: { loading?: boolean, onSave: (text: string, dueDate: string) => any }) => {
    const [todo, setTodo] = useState('' as string);
    const [dueDate, setDueDate] = useState('' as string);

    const getDateForPicker = (d?: string): string => {
        const dd = moment(d).format("YYYY-MM-DD");
        return (dd !== '0001-01-01' && dd !== '1900-01-01') ? dd : '';
    }
    const addToDo = () => {
        props?.onSave(todo?.trim(), moment(dueDate).format('MM/DD/YYYY'));
    }
    return (
        <div className="add-screen">
            <div className="row">
                <div className='col-12'>
                    <AsyncHTMLEditor allowPreview={false} hideSaveButton={true} allowHTMLEdit={true} allowAddFieldTokens={false} content={todo} onChange={(text: string) => setTodo(text)} />
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-12 col-sm-6">

                </div>
                <div className="col-12 col-sm-6  text-right">
                    <div className="form-group form-inline">
                        <label className='text-orange-red' style={{ minWidth: '100px' }}>Due Date*</label>
                        <div className="input-group flex-1">
                            <input type="date" value={getDateForPicker(dueDate) ?? ''} onChange={(e) => setDueDate(e.target.value)} className="form-control" />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-2">

                </div>
            </div>
            <div className="row">
                <div className="col-12  d-flex justify-content-end">
                    <ButtonComponent text="Save" loading={props?.loading} disabled={!todo?.trim() || !dueDate?.trim()} onClick={addToDo} className="btn btn-sm btn-primary shadow rounded  w-xs-100 w-sm-auto" >
                        <i className="fa fa-floppy-o mr-2"></i>
                    </ButtonComponent>
                </div>
            </div>
        </div>
    );
}