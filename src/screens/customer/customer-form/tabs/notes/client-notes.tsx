import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios, { CancelTokenSource } from 'axios';
import toastr from 'toastr';

import { EnumRoles, EnumScreens, NotesTypes } from '../../../../../models/enums';
import { ISaveNotesPayLoad, NotesComponent } from './notes';
import { CannedNotes } from './canned-notes';
import { ModalComponent } from '../../../../../shared/components/modal';
import { addClientNote, updateClientNote, deleteClientNote } from '../../../../../actions/customers.actions';
import { Messages } from '../../../../../shared/constants';
import { EditClientNoteComponent } from './edit-client-note';
import AuthService from '../../../../../core/services/auth.service';
import { IDropdown } from '../../../../../models/interfaces/shared';


const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        addClientNote,
        updateClientNote,
        deleteClientNote
    }, dispatch);
}
const mapStateToProps = (state: any) => {
    return {
        AuthRules: AuthService.getScreenOject(state.sharedModel.AuthRules, EnumScreens.CustomerDetails)
    };
}

export const CustomerClientNotesComponent = connect(mapStateToProps, mapDispatchToProps)((props: any) => {

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [isEditNote, setIsEditNote] = useState(false);
    const [editNote, setEditNote] = useState(null as any);
    const [customer, setCustomer] = useState(null as any);
    const [role, setRole] = useState('' as EnumRoles);
    const [content, setContent] = useState('' as string | undefined);
    const [franchiseAgents, setFranchiseAgents] = useState([] as IDropdown[]);

    const [axiosSource, setAxiosSource] = useState({} as CancelTokenSource);

    useEffect(() => {
        const list = props?.franchiseAgents?.map((item: any) => {
            return {
                abbreviation: item?.id,
                name: item?.fullName
            }
        })
        setFranchiseAgents(list);
    }, [props?.franchiseAgents])

    const onEdit = (param: ISaveNotesPayLoad) => {
        setUpdating(true);
        props.updateClientNote(props?.customer?.id, param?.content, param?.noteId,
            param?.agentId, param?.date, axiosSource, props?.isLead)
            .then((result: string) => {
                setUpdating(false);
                toastr.success("Client Note Updated Successfully!!");
                props?.onReloadCustomer();
                setIsEditNote(false);
            })
            .catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setUpdating(false);
                    toastr.error(err?.response?.data || Messages.GenericError);
                }
            })
    }
    const onDelete = (noteId: string) => {
        setDeleting(true);
        props.deleteClientNote(noteId, axiosSource, props?.isLead)
            .then((result: string) => {
                setDeleting(false);
                setCustomer({
                    ...customer,
                    historicalNotes: customer?.historicalNotes?.filter((x: any) => x?.id !== noteId)
                });
                toastr.success('Client Note removed successfully!!');
            })
            .catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setDeleting(false);
                    toastr.error(err?.response?.data);
                }
            })
    }

    const onSave = (param: ISaveNotesPayLoad) => {
        setSaving(true);
        setContent(param.content);
        let payload;
        if (props?.isLead) {
            payload = {
                customerId: props?.customer?.id,
                noteContent: param?.content,
                userIdForNotes: param?.agentName,
                isSendMail: param?.isEmailSend,
                franchiseAgentId: param?.agentId?.split('|')[0],
                isLead: props?.isLead
            };
        } else {
            payload = {
                customerId: props?.customer?.id,
                noteContent: param?.content,
                userIdForNotes: param?.agentId,
                isSendMail: param?.isEmailSend,
                isLead: props?.isLead
            };
        }
        props.addClientNote(payload, axiosSource)
            .then((result: string) => {
                setSaving(false);
                toastr.success(result);
                setContent('');
                props?.onReloadCustomer();
            })
            .catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setSaving(false);
                    toastr.error(err?.response?.data);
                }
            })
    }
    useEffect(() => {
        setCustomer({
            ...props?.customer,
            historicalNotes: [...(props?.customer?.historicalNotes || [])]?.reverse()
        });
        setRole(AuthService.getCurrentJWTPayload()?.roles);
        return () => {
            if (axiosSource?.cancel)
                axiosSource?.cancel(Messages.APIAborted);
        }
    }, [props?.customer])
    const onCannedSelect = (param: any) => {
        setContent(param?.note);
    }
    const onCannedClose = (param: any) => {
        setCannedNotes(false);
    }
    const getAgents = () => {
        return role !== EnumRoles.Customer ? [{
            abbreviation: (props?.customer?.id + '|-|-|' + props?.customer?.membershipId),
            name: props?.customer?.fullName
        }, {
            abbreviation: (props?.customer?.referrer?.id + '|-|-|' + props?.customer?.referrer?.membershipId),
            name: props?.customer?.referrer?.fullName
        }] : [{
            abbreviation: (props?.customer?.agent?.id + '|-|-|' + props?.customer?.agent?.membershipId),
            name: props?.customer?.agent?.fullName
        }, {
            abbreviation: (props?.customer?.referrer?.id + '|-|-|' + props?.customer?.referrer?.membershipId),
            name: props?.customer?.referrer?.fullName
        }]
    }
    const [cannedNotes, setCannedNotes] = useState(false);
    return (
        <>
            <NotesComponent type={NotesTypes.ClientNotes} title={'Client Notes/Help Requests'}
                agents={
                    props?.isLead ?
                        franchiseAgents : getAgents()
                }
                notes={customer?.historicalNotes}
                onSave={onSave}
                onEdit={(note: any) => { setEditNote(note); setIsEditNote(true); }}
                onDelete={onDelete}
                saving={saving}
                content={content}
                updating={updating}
                deleting={deleting}
                allowAddNotes={(!AuthService.isFieldHidden(props.AuthRules, 'AddClientNotes') && !AuthService.isFieldReadOnly(props.AuthRules, 'AddClientNotes'))}
                allowEditNotes={(!AuthService.isFieldHidden(props.AuthRules, 'EditClientNotes') && !AuthService.isFieldReadOnly(props.AuthRules, 'EditClientNotes'))}
                allowRemoveNotes={(!AuthService.isFieldHidden(props.AuthRules, 'RemoveClientNotes') && !AuthService.isFieldReadOnly(props.AuthRules, 'RemoveClientNotes'))}
                onOpenCannedNotes={() => { setCannedNotes(true) }}
            />
            <ModalComponent title={"Client Canned Notes"} isVisible={cannedNotes} onClose={() => setCannedNotes(false)}>
                <CannedNotes onSelect={onCannedSelect} type={NotesTypes.ClientNotes}
                    onClose={onCannedClose} />
            </ModalComponent>
            <ModalComponent title={"Edit Client Note"} isVisible={isEditNote} onClose={() => setIsEditNote(false)}>
                <EditClientNoteComponent note={editNote} isUpdating={updating} onUpdate={onEdit} />
            </ModalComponent>

        </>
    );
})