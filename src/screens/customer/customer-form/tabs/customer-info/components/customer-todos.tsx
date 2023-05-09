import axios, { CancelTokenSource } from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import toastr from 'toastr';

import { IToDo } from '../../../../../../models/interfaces/customer-view';
import { Messages } from '../../../../../../shared/constants';
import { DashboardWidget } from '../../../../../dashboard/components/dashboard-widget';
import { updateTodo, getTodos, addTodo, deleteTodo } from '../../../../../../actions/customers.actions';
import { ButtonComponent } from '../../../../../../shared/components/button';
import { CheckboxList } from '../../../../../../shared/components/checkbox-list';
import { Alignment, EnumScreens, ToDoTargetTypes } from '../../../../../../models/enums';
import { ICheckboxList } from '../../../../../../models/interfaces/shared';
import { ModalComponent } from '../../../../../../shared/components/modal';
import { AddTodoComponent } from './add-todo';
import AuthService from '../../../../../../core/services/auth.service';

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        getTodos,
        updateTodo,
        addTodo,
        deleteTodo
    }, dispatch);
}

const mapStateToProps = (state: any) => {
    return {
        sharedModel: state.sharedModel
    }
}

export const CustomerToDosComponent = connect(mapStateToProps, mapDispatchToProps)(
    (props: any) => {

        const [toDos, setToDos] = useState([] as IToDo[]);
        const [axiosSource, setAxiosSource] = useState(axios.CancelToken.source() as CancelTokenSource);
        const [loading, setLoading] = useState(false as boolean);
        const [isTodoSaving, setIsTodoSaving] = useState(false as boolean);
        const [isAddTodo, setIsAddTodo] = useState(false as boolean);
        const [selectedValues, setSelectedValues] = useState([] as string[]);
        const [checkList, setCheckList] = useState([] as ICheckboxList[]);

        useEffect(() => {
            if (props?.id) {
                loadTodos();
            }
            return () => {
                if (axiosSource.cancel) {
                    axiosSource.cancel(Messages.APIAborted);
                }
            }

        }, [props?.id]);

        const setSelected = (list: IToDo[]) => {
            setSelectedValues(list?.filter(x => x.isCompleted)?.map(x => x.toDoId?.toString()));
            setCheckList(list?.map(x => {
                const due = moment(x.dueDate).format('MM/DD/YYYY');
                const today = moment().format('MM/DD/YYYY');
                return ({
                    text: x.toDoText,
                    value: x.toDoId?.toString(),
                    disabled: x.isCompleted,
                    title: x.toDoText + '\nDue Date : ' + due,
                    cssClass: (!x.isCompleted && due === today ? 'todo-alert' : '')
                });
            }));
        }
        const loadTodos = () => {
            if (!props?.id) {
                return;
            }
            setLoading(true);
            const source = axios.CancelToken.source();
            setAxiosSource(source);
            props?.getTodos(props?.id, props?.targetType, source)
                .then((list: IToDo[]) => {
                    setLoading(false);
                    setToDos(list);
                    setSelected(list);
                }).catch((err: any) => {
                    if (!axios.isCancel(err)) {
                        setLoading(false);
                    }
                });
        }
        const addTodo = (text: string, dueDate: string) => {
            setIsTodoSaving(true);
            const source = axios.CancelToken.source();
            setAxiosSource(source);
            props?.addTodo(text, dueDate, props?.id, props?.targetType, source)
                .then((list: IToDo[]) => {
                    setIsTodoSaving(false);
                    loadTodos();
                    setIsAddTodo(false);
                }).catch((err: any) => {
                    if (!axios.isCancel(err)) {
                        setIsTodoSaving(false);
                    }
                });
        }
        const markCompleteTodo = (todoId: number) => {
            setIsTodoSaving(true);
            const source = axios.CancelToken.source();
            setAxiosSource(source);
            props?.updateTodo(todoId, source)
                .then((list: IToDo[]) => {
                    setIsTodoSaving(false);
                    loadTodos();
                }).catch((err: any) => {
                    if (!axios.isCancel(err)) {
                        setIsTodoSaving(false);
                    }
                });
        }
        const removeTodo = (todoId: number) => {
            setIsTodoSaving(true);
            const source = axios.CancelToken.source();
            setAxiosSource(source);
            props?.deleteTodo(todoId, source)
                .then((list: IToDo[]) => {
                    setIsTodoSaving(false);
                    loadTodos();
                }).catch((err: any) => {
                    if (!axios.isCancel(err)) {
                        setIsTodoSaving(false);
                    }
                });
        }
        const handleChange = (items: string[], { value, checked }: any) => {
            const allowAction = AuthService.isFieldHidden(getAuthRules, 'ToDoCompleteAction')
                || AuthService.isFieldReadOnly(getAuthRules, 'ToDoCompleteAction')
            if (allowAction) {
                setSelectedValues([...selectedValues]);
                toastr.error('You are not allowed to perform this action. Please contact customer care.');
                return;
            }
            setSelectedValues(items);
            markCompleteTodo(value);
        }
        const onTodoRemove = (item: ICheckboxList, index: number) => {
            removeTodo(item?.value);
        }
        const getAuthRules = useMemo(() => {
            switch (props?.targetType) {
                case ToDoTargetTypes.FRANCHISE_AGENT:
                    return AuthService.getScreenOject(props?.sharedModel?.AuthRules, EnumScreens.ViewFranchiseAgents)
                    break;
                case ToDoTargetTypes.REFERRAL_AGENT:
                    return AuthService.getScreenOject(props?.sharedModel?.AuthRules, EnumScreens.ViewReferralAgents)
                    break;
                case ToDoTargetTypes.CUSTOMER:
                    return AuthService.getScreenOject(props?.sharedModel?.AuthRules, EnumScreens.CustomerDetails)
                    break;
                case ToDoTargetTypes.LEAD:
                    return AuthService.getScreenOject(props?.sharedModel?.AuthRules, EnumScreens.ViewLeads)
                    break;
                default:
                    return null;
                    break;
            }
        }, [props?.targetType])
        return (
            <DashboardWidget title={"To Dos"} isLoading={loading || isTodoSaving} >
                <div className="row pb-5 pt-2">
                    {
                        !props?.addMode && !AuthService.isFieldHidden(getAuthRules as any, 'ToDoAdd') &&
                        <div className="col-12 d-flex justify-content-end">
                            <ButtonComponent text="Add New ToDo" className="btn-primary w-xs-100 w-sm-auto" onClick={() => setIsAddTodo(true)}>
                                <i className="fa fa-plus mr-2"></i>
                            </ButtonComponent>
                        </div>
                    }
                    <div className="col-12">
                        <div className="todo-items mt-4 mt-sm-1">
                            {checkList?.length ?
                                <CheckboxList enableRemove={
                                    !AuthService.isFieldHidden(getAuthRules as any, 'ToDoRemove')
                                } enableClickOnDisabled={true} onRemove={onTodoRemove} selectedValues={selectedValues || []} alignment={Alignment.Vertical}
                                    list={checkList} onChange={handleChange} disableLabelClick={true} />
                                : <div className="text-danger text-center">No Todos Available</div>
                            }
                        </div>
                    </div>
                </div>
                <ModalComponent title={"Add ToDo"} halfFullScreen={true} isVisible={isAddTodo} onClose={() => setIsAddTodo(false)}>
                    <AddTodoComponent loading={isTodoSaving} onSave={addTodo} />
                </ModalComponent>
            </DashboardWidget>
        );
    });