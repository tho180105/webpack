import {FaPen, FaSort, FaSortDown, FaSortUp, FaTrash} from "react-icons/fa";
import {useDispatch, useSelector} from "react-redux";
import {
    directionSelector,
    fieldSortSelector, filtersSelector,
    todosRemainingSelector,
    usernameSelector
} from "../../redux/selectors";
import todoSlice, {deleteTodo, fetchTodos, statusCheckBoxChange} from "../Todo/todoSlice";
import {useEffect} from "react";
import {getActivePage} from "../Pagination/paginationSlice";
import filtersSlice from "../Filters/filtersSlice";
import {notify} from "../../services/Notification/notification";
import {withTranslation} from "react-i18next";
import React from 'react'
import {AppDispatch} from "../../redux/store";

const TodoList = ({t}:{t:any}) => {
    const todos = useSelector(todosRemainingSelector)
    const dispatch = useDispatch<AppDispatch>()
    const userName = useSelector(usernameSelector)
    const directionSort = useSelector(directionSelector)
    const field = useSelector(fieldSortSelector)
    const filters= useSelector(filtersSelector)
    useEffect(() => {
        if (userName !== null) {
            dispatch(fetchTodos(Number(getActivePage())))
        }
    }, [userName,filters])

    const handleDelete=(id:number)=> {
        dispatch(deleteTodo(id))
        notify("Delete success")
    }

    const handleStatusCheckBoxChange=(todo:any)=> {
        dispatch(statusCheckBoxChange(todo))
    }

    const handleUpdate=(todo:any)=> {
        dispatch(todoSlice.actions.getTodoForUpdateModal(todo))
        document.getElementById("form-update").classList.add('show-modal')
    }

    const sortTable=(field:string)=> {
        dispatch(filtersSlice.actions.fieldSortChange(field))
        dispatch(filtersSlice.actions.directionSortChange(directionSort !== 'asc' ? 'asc' : 'desc'))
        dispatch(fetchTodos(1))
    }

    return (
        <div>
            <table id={'myTable'}>
                <thead>
                <tr>
                    <td style={{maxWidth:"65px"}} className={'idColumn'} onClick={() => sortTable('id')}><span>{t('todo:id')}</span>
                        {(directionSort === 'asc' && field === 'id') ? (
                            <FaSortUp />
                        ) : (field === 'id' ? (
                                <FaSortDown />
                            ) : (
                                <FaSort />
                            )
                        )
                        }
                    </td>
                    <td onClick={() => sortTable('task')}><span>  {t('todo:task')}</span>
                        {(directionSort === 'asc' && field === 'task') ?
                            <FaSortUp/>: (field === 'task' ?  <FaSortDown/>: <FaSort/>)
                        }
                    </td>
                    <td width={100}><span>  {t('todo:status')}</span></td>
                    <td width={65}><span>  {t('todo:priority')}</span></td>
                    <td width={135} onClick={() => sortTable('start_date')}><span>  {t('todo:startDate')}</span>
                        {(directionSort === 'asc' && field === 'start_date') ? (
                            <FaSortUp />
                        ) : (field === 'start_date' ? (
                                <FaSortDown />
                            ) : (
                                <FaSort />
                            )
                        )
                        }
                    </td>
                    <td width={135} onClick={() => sortTable('end_date')}><span>  {t('todo:endDate')}</span>
                        {(directionSort === 'asc' && field === 'end_date') ? (
                            <FaSortUp />
                        ) : (field === 'end_date' ? (
                                <FaSortDown />
                            ) : (
                                <FaSort />
                            )
                        )
                        }
                    </td>
                    <td width={100}>  {t('todo:action')}</td>
                </tr>
                </thead>
                <tbody>
                {todos.map((todo:any) => {
                    return (
                        <tr
                            className={todo.status ? 'done' : ''}
                            key={todo.id}>
                            <td>{todo.id}</td>
                            <td>{todo.task}</td>
                            <td><input type={"checkbox"}
                                       style={{width: "16px", height: "16px", margin: 'auto auto', display: 'block'}}
                                       checked={todo.status}
                                       onChange={() => {
                                           handleStatusCheckBoxChange(todo)
                                       }}/></td>
                            <td>{todo.priority}</td>
                            <td>{todo.startDate}</td>
                            <td>{todo.endDate}</td>
                            <td>
                                <button onClick={() => {
                                    handleUpdate(todo)
                                }} className={'icon-table-warning'}><FaPen></FaPen></button>
                                <button onClick={() => handleDelete(todo.id)} className={'icon-table-danger'}>
                                    <FaTrash></FaTrash></button>
                            </td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </div>
    )
}

export default withTranslation(['translation','todo'])(TodoList)
