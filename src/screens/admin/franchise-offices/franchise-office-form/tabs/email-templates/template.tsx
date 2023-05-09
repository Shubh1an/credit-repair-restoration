import axios, { CancelTokenSource } from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import { bindActionCreators } from 'redux';
import toastr from 'toastr';
import { setEmailTemplateActive } from '../../../../../../actions/email-templates.actions';

import { IEmailLetters } from '../../../../../../models/interfaces/email-letters';
import { ModalComponent } from '../../../../../../shared/components/modal';
import { ToggleSwitch } from '../../../../../../shared/components/toggle-switch';
import { OfcEmailTemplateEditor } from '../../../../email-templates/list/ofc-email-template-editor';

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        setEmailTemplateActive
    }, dispatch);
}
export const TemplateComponent = connect(null, mapDispatchToProps)((props: {
    letter: IEmailLetters | unknown, setEmailTemplateActive: any, type: string, name: string, officeId: string, onSave: any
}) => {

    const [letter, setLetter] = useState(undefined as IEmailLetters | unknown);
    const [openEditor, setOpenEditor] = useState(false);
    const [loading, setLoading] = useState(false);
    const [axiosSource, setAxiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);

    useEffect(() => {
        setLetter(props?.letter);
    }, [props])
    const onChange = (chk: boolean) => {
        setLoading(true);
        setLetter({
            ...(letter as IEmailLetters || {}),
            isActive: chk
        });
        props.setEmailTemplateActive((letter as IEmailLetters)?.officeId, (letter as IEmailLetters)?.id, chk, axiosSource)
            .then((res: any) => {
                setLoading(false);
                toastr.success(`${(letter as IEmailLetters)?.name} is ${chk ? 'Active' : 'Inactive'} now!`);
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setLoading(false);
                    setLetter({
                        ...(letter as IEmailLetters || {}),
                        isActive: !chk
                    });
                    toastr.error('Some error occured. please try again later!');
                }
            })
    }
    return (
        <>
            <div className='text-center col-6 col-sm-4 border-gray-16 p-3 p-sm-4 border-gray-top-16'  >
                {
                    !!letter && <> <ToggleSwitch size={'sm mb-4'} defaultChecked={(letter as IEmailLetters)?.isActive || false} onChange={onChange} />
                        <b>{!!(letter as IEmailLetters)?.isActive ? "ON" : "OFF"}</b>
                    </>
                }
            </div>
            <div className='text-center align-middle border-gray-16 col-6 col-sm-3 p-3 p-sm-4 border-gray-top-16' >
                {
                    !!letter
                        ? <Button color='link btn-sm pl-2 pr-2 text-dark hover-zoom' onClick={() => setOpenEditor(true)}><i className="fa fa-pencil"></i></Button>
                        : <Button color='link btn-sm pl-2 pr-2 text-dark hover-zoom' onClick={() => setOpenEditor(true)}><i className="fa fa-2x fa-plus-circle"></i></Button>
                }
            </div>
            <ModalComponent title={(letter as IEmailLetters)?.name || ('Add ' + props.type)} fullscreen={true} isVisible={openEditor} onClose={() => setOpenEditor(false)}>
                {openEditor && <OfcEmailTemplateEditor type={props.type} name={props.name} officeId={props?.officeId} onSave={() => { setOpenEditor(false); props.onSave(); }} letterId={(letter as IEmailLetters)?.id} letterObject={(letter as IEmailLetters)} />}
            </ModalComponent>
        </>
    );
})
