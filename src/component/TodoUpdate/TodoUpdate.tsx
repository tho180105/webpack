import {useDispatch, useSelector} from "react-redux";
import {todoUpdateSelector} from "../../redux/selectors";
import todoSlice, {updateTodo} from "../Todo/todoSlice";
import {useId, useRef} from "react";
import {FaPen} from "react-icons/fa";
import validator from "../../services/Validator/validator";
import {NOTIFICATION_INFO, notify} from "../../services/Notification/notification";
import TodoService from "../../services/Services/TodoService";
import React from 'react'
import {AppDispatch} from "../../redux/store";
const TodoUpdate = () => {
    const todo = useSelector(todoUpdateSelector)
    const dispatch = useDispatch<AppDispatch>();
    const todoUpdateModal:any = useRef();
    const taskInputId = useId();
    const startDateInputId = useId();
    const endDateInputId = useId();
    const prioritySelectId = useId();

    validator({
        formSelector: '[id=form-update]',
        errorSelector: `.form-message`,
        rules: [
            validator.isRequired(`[id='${taskInputId}']`),
            validator.minLength(`[id='${taskInputId}']`, 4,""),
            validator.isValid(`[id='${startDateInputId}'],[id='${endDateInputId}']`,
                () => {
                    if (todo.startDate > todo.endDate) {
                        return 'The end date cannot be before the start date'
                    } else {
                        return undefined

                    }
                }),
        ],
        onSubmit: () => {
            let x;
            TodoService.getOneById(todo.id).then(r => {
                x = r.data
                if (JSON.stringify(todo) === JSON.stringify(x)) {
                    notify("No changes",NOTIFICATION_INFO)
                    unShowModal()
                } else {
                    dispatch(updateTodo(todo))
                    unShowModal()
                    notify("Updated success")
                }

            })


        }
    })


    const handleTodoChange=(e:any)=> {
        let value = e.target.value
        if (e.target.name === 'status') {
            value = value !== 'true'
        }
        dispatch(todoSlice.actions.todoUpdateChange({
            ...todo,
            [e.target.name]: value
        }))
    }

    const unShowModal=()=> {
        const messageElements = document.querySelectorAll("#form-update .form-message")
        const inputElements = document.querySelectorAll("#form-update input")
        messageElements.forEach(messElement => {
            messElement.innerHTML = ''
        })
        inputElements.forEach(inputElement => {
            inputElement.classList.remove("invalid")
        })
        todoUpdateModal.current.classList.remove('show-modal')
    }

    return (
        <div className={'todo-update-modal'} id={"form-update"} ref={todoUpdateModal}>
            <form className={'todo-update-form'}>
                <fieldset>
                    <legend style={{textAlign:"right"}}>
                        <div>
                            <span style={{margin: "0 5px", fontSize: "20px", color: "gray"}}><FaPen/></span>
                            <span>Todo</span>
                        </div>
                    </legend>
                    <div className={'form-group'}>
                        <label className={'form-label'}>Id: </label>
                        <input className={'form-input-text'} readOnly={true} value={todo.id}/>
                    </div>
                    <div className={'form-group'}>
                        <label className={'form-label'} htmlFor={taskInputId}>Task: </label>
                        <div className={'form-group-input'}>
                            <input value={todo.task}
                                   name={'task'}
                                   id={taskInputId}
                                   className={'form-input-text'}
                                   onChange={e => handleTodoChange(e)}/>
                            <span className={'form-message'}></span>
                        </div>
                    </div>
                    <div className={'form-group'}>
                        <label className={'form-label'} htmlFor={prioritySelectId}>Priority : </label>
                        <select value={todo.priority}
                                name={'priority'}
                                id={prioritySelectId}
                                className={'form-select'}
                                onChange={e => handleTodoChange(e)}>
                            <option value={"High"}>High</option>
                            <option value={"Medium"}>Medium</option>
                            <option value={"Low"}>Low</option>
                        </select>
                    </div>
                    <div className={'form-group'}>
                        <label className={'form-label'}>Status :</label>
                        <input type={"checkbox"}
                               name={'status'}
                               className={'form-input-checkbox'}
                               value={todo.status}
                               checked={todo.status === true }
                               onChange={e => handleTodoChange(e)}/>
                    </div>
                    <div className={'form-group'}>
                        <label className={'form-label'} htmlFor={startDateInputId}>
                            Start date :
                        </label>
                        <div className={'form-group-input'}>
                            <input value={todo.startDate}
                                   name={'startDate'}
                                   type={"date"}
                                   id={startDateInputId}
                                   className={'form-input-date'}
                                   onChange={e => handleTodoChange(e)}/>
                            <span className={'form-message'}></span>
                        </div>
                    </div>
                    <div className={'form-group'}>
                        <label className={'form-label'} htmlFor={endDateInputId}>
                            End date :
                        </label>
                        <div className={'form-group-input'}>
                            <input value={todo.endDate}
                                   name={'endDate'}
                                   type={"date"}
                                   id={endDateInputId}
                                   className={'form-input-date'}
                                   onChange={e => handleTodoChange(e)}/>
                            <span className={'form-message'}></span>
                        </div>
                    </div>

                    {/*<button className={"btn-refresh"} type={"button"}>Refresh</button>*/}
                    <button className={'btn-close'} onClick={unShowModal} type={"button"}>&times;</button>
                    <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                        <button className={"btn-warning"}>Submit</button>
                    </div>
                </fieldset>
            </form>
        </div>
    )
}
export default TodoUpdate
