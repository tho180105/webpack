import {useDispatch} from "react-redux";
import {useEffect, useId, useRef, useState} from "react";
import {addNewTodo} from "./todoSlice";
import {dateToYMD} from "../../services/Services/dateConverter";
import {FaPen} from "react-icons/fa";
import validator from "../../services/Validator/validator";
import {notify} from "../../services/Notification/notification";
import {withTranslation} from "react-i18next";
import React from 'react'
import {AppDispatch} from "../../redux/store";

const Todo = ({t}:{t:any}) => {

    const dispatch = useDispatch<AppDispatch>();
    const startDateInputId = useId();
    const endDateInputId = useId();
    const taskInputId = useId();
    const prioritySelectId = useId();
    const todoInput = useRef();
    const [todo, setTodo] = useState({
            task: '',
            priority: 'Medium',
            startDate: dateToYMD(new Date()),
            endDate: dateToYMD(new Date()),
        }
    );
    validator({
        formSelector: '[id=new-todo-form]',
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
            dispatch(addNewTodo(todo))
            clearForm();
            notify("Added success")
        }
    })
    const clearForm = () => {
        const messageElements = document.querySelectorAll("#new-todo-form .form-message")
        const inputElements = document.querySelectorAll("#new-todo-form input")
        messageElements.forEach(messElement => {
            messElement.innerHTML = ''
        })
        inputElements.forEach(inputElement => {
            inputElement.classList.remove("invalid")
        })
        setTodo({
            task: '',
            priority: 'Medium',
            startDate: dateToYMD(new Date()),
            endDate: dateToYMD(new Date()),
        })
    }

    const handleTodoChange = (e:any) => {
        setTodo(todo => {
                return {
                    ...todo,
                    [e.target.name]: e.target.value
                }
            }
        )
    }
    return (
        <div className={'todo-border'}>
            <form className={'todo-form'} id={'new-todo-form'}>
                <fieldset>
                    <legend style={{textAlign:"right"}}>
                        <div>
                            <span style={{margin: "0 5px", fontSize: "20px", color: "gray"}}><FaPen/></span>
                            <span>{t('todo')}</span>
                        </div>
                    </legend>
                    <div className={'form-group'} id={'task-todo'}>
                        <label htmlFor={taskInputId} className={'form-label'}>{t('todo')} : </label>
                        <div className={'form-group-input'}>
                            <input value={todo.task}
                                   className={'form-input-text '}
                                   id={taskInputId}
                                   ref={todoInput}
                                   name={'task'}
                                   onChange={e => handleTodoChange(e)}
                            />
                            <div className={"form-message  "} style={{textAlign: "right"}}></div>
                        </div>
                    </div>
                    <div className={'form-group'}>
                        <label htmlFor={prioritySelectId} className={'form-label'}>{t('todo:priority')} :</label>
                        <select value={todo.priority}
                                className={'form-select'}
                                name={'priority'}
                                id={prioritySelectId}
                                onChange={e => handleTodoChange(e)}>
                            <option value={"High"}>{t('todo:high')}</option>
                            <option value={"Medium"}>{t('todo:medium')}</option>
                            <option value={"Low"}>{t('todo:low')}</option>
                        </select>
                    </div>
                    <div className={'form-group'}>
                        <label htmlFor={startDateInputId} className={'form-label'}> {t('todo:startDate')} :</label>
                        <div className={'form-group-input'}>
                            <input value={todo.startDate}
                                   id={startDateInputId}
                                   className={'form-input-date'}
                                   name={'startDate'}
                                   type={"date"}
                                   onChange={e => handleTodoChange(e)}/>
                            <div className={"form-message"} style={{textAlign: "right"}}></div>
                        </div>
                    </div>
                    <div className={'form-group'} id={'end-date-todo'}>
                        <label htmlFor={endDateInputId} className={'form-label'}> {t('todo:endDate')}: </label>
                        <div className={'form-group-input'}>
                            <input value={todo.endDate}
                                   id={endDateInputId}
                                   className={'form-input-date'}
                                   name={'endDate'}
                                   type={"date"}
                                   onChange={e => handleTodoChange(e)}/>
                            <div className={"form-message"} style={{textAlign: "right"}}></div>
                        </div>
                    </div>
                    <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                        <button className={"btn-add"}>{t('todo:add')}</button>
                        <button className={"btn-refresh"} onClick={() => {
                            clearForm()
                        }} type={"button"}>{t('todo:refresh')}
                        </button>
                    </div>
                </fieldset>
            </form>
        </div>
    )
}
export default withTranslation(['translation','todo'])(Todo)
