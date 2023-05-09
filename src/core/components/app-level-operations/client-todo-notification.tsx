import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { IToDo } from '../../../models/interfaces/customer-view';


const mapStateToProps = (state: any) => {
    return {
        isLoggedIn: state?.authModel?.auth?.isLoggedIn
    };
}
export const ClientToDoNotificationComponent = connect(mapStateToProps)((props: { isLoggedIn: boolean, ToDos: IToDo[] }) => {

    return (
        <ul className='all-to-dos'>
            {
                props?.ToDos?.map((todo: IToDo, index) => (
                    <div className="quote-container single-item-to-do">
                        <i className="pin"></i>
                        <blockquote className="note yellow" >
                            <div dangerouslySetInnerHTML={{ __html: todo?.toDoText }}>

                            </div>
                            <cite className="author f-12 bottom-layer">
                                <span className='text-success'>
                                    {moment(todo.createdOn).format('MM/DD/YYYY')}
                                </span>
                                <span className='text-danger'>
                                    {moment(todo.dueDate).format('MM/DD/YYYY')}
                                </span>
                            </cite>
                        </blockquote>
                    </div>
                ))
            }
        </ul>
    )
});
