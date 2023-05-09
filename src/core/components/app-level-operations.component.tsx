import axios, { CancelTokenSource } from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// @ts-ignore
import confirm from 'reactstrap-confirm';
import { withRouter } from 'react-router-dom';

import { getTodos } from '../../actions/customers.actions'
import { IToDo } from '../../models/interfaces/customer-view'
import { addTodosShared } from '../../shared/actions/shared.actions'
import { ModalComponent } from '../../shared/components/modal'
import { AppUtils } from '../../utils/app-utils'
import AuthService from '../services/auth.service'
import { ClientToDoNotificationComponent } from './app-level-operations/client-todo-notification';
import { ClientRoutesConstants } from '../../shared/constants';


const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getTodos,
        addTodosShared
    }, dispatch);
}
const mapStateToProps = (state: any) => {
    return ({
        isLoggedIn: state?.authModel?.auth?.isLoggedIn,
        isLocked: state?.authModel?.auth?.isLocked,
        lockedMessage: state?.authModel?.auth?.lockedMessage,
        sharedToDos: state?.sharedModel?.todos,
        toggleToDo: state?.sharedModel?.toggleToDo,
        passwordNotStrong: state?.sharedModel?.passwordNotStrong,
    })
}
export const AppLevelOperations = withRouter(connect(mapStateToProps, mapDispatchToProps)((props: any) => {
    const [isClientVisible, setisClientVisible] = useState(false);
    const [gotCustomerData, setGotCustomerData] = useState(false);
    const [toDos, setToDos] = useState([] as IToDo[]);
    const [axiosSource, setAxiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);
    const [loading, setLoading] = useState(false as boolean);
    const [isPortalLocked, setisPortalLocked] = useState(false as boolean);

    useEffect(() => {
        setisPortalLocked(props?.isLocked);
    }, [props?.isLocked]);
    useEffect(() => {
        if (props?.isLoggedIn) {
            if (props?.passwordNotStrong) {
                showPasswordStrengthWindow();
            } else {
                showToDos();
            }
        }
    }, [props?.passwordNotStrong, props.isLoggedIn]);

    const showPasswordStrengthWindow = async () => {
        let result = await confirm({
            title: 'Weak Password!',
            message: "Your password is not strong!! Please change your password.",
            confirmText: "OK",
            confirmColor: "primary",
            cancelColor: null,
            cancelText: null
        });
        if (result) {
            props?.history?.push(ClientRoutesConstants.security);
        }
    }
    const showToDos = () => {
        const authData = AuthService.getCurrentJWTPayload();
        if (!gotCustomerData) {
            const todoTarget = AppUtils.convertRoleToToDoTypes(authData?.roles);
            loadTodos(authData?.cid || authData?.fid || authData?.rid || authData?.lid, todoTarget);
        }
    }

    useEffect(() => {
        if (props?.toggleToDo) {
            const authData = AuthService.getCurrentJWTPayload();
            const todoTarget = AppUtils.convertRoleToToDoTypes(authData?.roles);
            if (props?.sharedToDos?.length) {
                setisClientVisible(true);
                setGotCustomerData(true);
            } else {
                loadTodos(authData?.cid || authData?.fid || authData?.rid || authData?.lid, todoTarget);
            }
        }
    }, [props.toggleToDo]);

    const loadTodos = (cid?: string, role?: string) => {
        setLoading(true);
        const source = axios.CancelToken.source();
        setAxiosSource(source);
        setGotCustomerData(true);
        props?.getTodos(cid, role, source)
            .then((list: IToDo[]) => {
                setLoading(false);
                const pendings = list?.filter(x => !x?.isCompleted);
                setToDos(pendings);
                props?.addTodosShared(pendings);
                if (pendings?.length) {
                    setisClientVisible(true);
                    setGotCustomerData(true);
                }
            }).catch((err: any) => {
                if (!axios.isCancel(err)) {
                    setLoading(false);
                }
            });
    }

    return (<>
        <div>

        </div>

        <ModalComponent title={'Pending ToDos'} halfFullScreen={true} onClose={() => { setisClientVisible(false) }} fullscreen={true} isVisible={isClientVisible} >
            <ClientToDoNotificationComponent ToDos={toDos} />
        </ModalComponent>
        <ModalComponent title={'Portal is Locked'} halfFullScreen={true} onClose={() => { setisPortalLocked(false) }} fullscreen={false} isVisible={isPortalLocked} >
            <div className='text-danger p-2'>
                {
                    props?.lockedMessage
                }
            </div>
        </ModalComponent>
    </>
    )
}));

