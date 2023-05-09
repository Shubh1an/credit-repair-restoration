import moment from 'moment';
import React, { useEffect, useState } from 'react';
import toastr from 'toastr';

import AuthService from '../../../../../core/services/auth.service';
import { EnumRoles } from '../../../../../models/enums';
import { IValueTextRole } from '../../../../../models/interfaces/shared';
import { ButtonComponent } from '../../../../../shared/components/button';
import { CommonUtils } from '../../../../../utils/common-utils';
import { ISaveNotesPayLoad } from './notes';

export const EditClientNoteComponent = (props: any) => {

    const [content, setContent] = useState('' as string | undefined);
    const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
    const [roles, setRoles] = useState(CommonUtils.ClientNotesWhoLefts());
    const [selectedRole, setSelectedRole] = useState('' as string);
    const onUpdate = () => {
        if (!selectedRole) {
            toastr.error('Please select Who Left.');
            return;
        }
        if (!content) {
            toastr.error('Please Enter Comments.');
            return;
        }
        const payload: ISaveNotesPayLoad = {
            agentId: selectedRole,
            content,
            date: moment(date).format("MM/DD/YYYY"),
            noteId: props?.note?.id
        };
        props?.onUpdate(payload);
    }

    useEffect(() => {
        setContent(props?.note?.note);
    }, [props?.note?.note])

    useEffect(() => {
        const payload = AuthService.getCurrentJWTPayload();
        const role = payload?.roles;
        if (role === EnumRoles?.Administrator) {
            setSelectedRole(EnumRoles?.CreditAgent)
        } else {
            setSelectedRole(payload?.roles);
        }
        if (role === EnumRoles?.Processor) {
            const newroles = CommonUtils.ClientNotesWhoLefts()?.filter(x => !['Administrator', 'Office Manager'].some(m => m === x.value));
            setRoles(newroles);
        } else if (role === EnumRoles?.CreditAgent) {
            const newroles = CommonUtils.ClientNotesWhoLefts()?.filter(x => !['Administrator', 'Office Manager', 'Processor'].some(m => m === x.value));
            setRoles(newroles);
        }
    }, []);
    return (
        <div className="editnotes">
            <div className="row">
                <div className="col-12">
                    <div className="form-group mb-1">
                        <label className='text-orange-red'>Comments*</label>
                        <textarea className="form-control" value={content} onChange={e => setContent(e.target.value)} placeholder="comments here..."></textarea>
                    </div>
                </div>
            </div>
            <div className="row mb-2">
                <div className="col-3 form-inline">
                    <label className='text-orange-red'>Who Left*</label>
                    <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} className="form-control input-sm ml-2 flex-1">
                        <option>- Select Agent-</option>
                        {
                            roles?.map((item: IValueTextRole, index: number) => <option key={index} value={item?.value}>{item?.text}</option>)
                        }
                    </select>
                </div>
                <div className="col-4 form-inline">
                    <label>Date:</label>
                    <div className="input-group ml-2">
                        <input type="date" value={date} onChange={e => setDate(moment(e.target.value).format("YYYY-MM-DD"))} className="form-control input-sm" />
                    </div>
                </div>
                <div className="col-3"></div>
                <div className="col-2 pl-0 text-right">
                    <ButtonComponent text="Save" className="btn-primary input-sm" loading={props?.updating} onClick={onUpdate} >
                        <i className="fa fa-floppy-o mr-2"></i>
                    </ButtonComponent>
                </div>
            </div>
        </div>
    );
}