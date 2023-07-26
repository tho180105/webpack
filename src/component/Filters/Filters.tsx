import {useDispatch, useSelector} from "react-redux";
import { prioritySelector, statusSelector} from "../../redux/selectors";
import filtersSlice from "./filtersSlice";
import {useState} from "react";
import {fetchTodos} from "../Todo/todoSlice";
import {withTranslation} from "react-i18next";
import React from 'react'
const Filters = ({t}:{t:any}) => {
    const statusRadiosText:string[] = [t('todo:all'), t('todo:completed'), 'Todo']
    const statusRadios:string[] = ['All','Completed', 'Todo']
    const priorityCheckboxesText:string[] = [t('todo:high'), t('todo:medium'), t('todo:low')]
    const priorityCheckboxes:string[] = ['High', 'Medium', 'Low']
    const dispatch = useDispatch()
    const [search, setSearch] = useState('')
    const status = useSelector(statusSelector)
    const priority = useSelector(prioritySelector)

    const handleSubmit = (e:any) => {
        e.preventDefault();
        dispatch(filtersSlice.actions.searchFilterChange(search))
    }
    const handleSearchInputChange = (value:string) => {
        setSearch(value)
    }

    const handleStatusRadioChange = (value:string) => {
        // console
        dispatch(filtersSlice.actions.statusFilterChange(value))
    }

    const handlePriorityCheckBoxChange = (value:string) => {
        priority.includes(value) ? dispatch(filtersSlice.actions.priorityFilterUnTick(value)) : dispatch(filtersSlice.actions.priorityFilterTick(value))
    }


    const handleLateCheckboxChange=(e:any)=> {
        const isChecked=e.target.checked
        if(isChecked){
            let d = new Date().valueOf()-1000*60*60*24;
            let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
            let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
            let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
            const date=`${ye}-${mo}-${da}`
            dispatch(filtersSlice.actions.endDateChange(date))
        }else{
            dispatch(filtersSlice.actions.endDateChange(''))
        }

    }

    return (
        <div className={'filters-border'}>
            <form onSubmit={(e) => {
                handleSubmit(e)
            }}
                  className={'search-form'}>
                <div className={'form-group'}>
                    <label className={'form-label'}>{t('todo:search')}: </label>
                    <input type={"text"}
                           className={'form-input-text'}
                           value={search}
                           onChange={e => handleSearchInputChange(e.target.value)}
                    />
                </div>
                <button className={'btn-warning'}>{t('todo:submit')}</button>
            </form>
            <div className={'filter-status-priority-group'}>
                <div className={'status-radios'}>
                    {statusRadios.map((statusRadio:string,index:number) => {
                        return (
                            <div key={statusRadio} className={'form-group'}>
                                <label className={'form-label'}
                                       htmlFor={statusRadio}>
                                    {statusRadiosText[index]}
                                </label>
                                <input type={"radio"}
                                       className={'form-input-radio'}
                                       value={statusRadio}
                                       id={statusRadio}
                                       checked={status === statusRadio}
                                       onChange={e => handleStatusRadioChange(e.target.value)}
                                />
                            </div>
                        )
                    })}
                </div>
                <div className={'priority-checkboxes'}>
                    {priorityCheckboxes.map((priorityCheckbox:string,index:number) => {
                        return (
                            <div key={priorityCheckbox} className={'form-group'}>
                                <label className={'form-label'}
                                       htmlFor={priorityCheckbox}>
                                    {priorityCheckboxesText[index]}
                                </label>
                                <input type={"checkbox"}
                                       className={'form-input-checkbox'}
                                       id={priorityCheckbox}
                                       value={priorityCheckbox}
                                       onChange={() => handlePriorityCheckBoxChange(priorityCheckbox)}
                                       checked={priority.includes(priorityCheckbox)}
                                />
                            </div>
                        )
                    })}
                </div>
                <div className={'out-of-date-border'}>

                    <div className={'form-group'}>
                        <label className={'form-label'}>
                            {t('todo:outOfDate')}
                        </label>
                        <input type={"checkbox"}
                               //nếu status là completed hoac all thì bỏ  check nếu đang check
                               onChange={(e)=>{handleLateCheckboxChange(e)}}
                               className={'form-input-checkbox'} />
                    </div>

                </div>
            </div>

        </div>
    )
}
export default withTranslation(['translation','todo'])(Filters)
