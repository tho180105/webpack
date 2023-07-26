import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import TodoService from "../../services/Services/TodoService";
import paginationSlice, {getNumberOfPages} from "../Pagination/paginationSlice";
import {modal_confirm, NOTIFICATION_ERROR, notify} from "../../services/Notification/notification";
import {AppDispatch} from "../../redux/store";


const todoSlice = createSlice({
    name: 'todoList',
    initialState: {
        status: true,
        todos: [],
        todoUpdate: {
            id: 1,
            task: '',
            status: false,
            priority: 'Medium',
            startDate: '2012-02-02',
            endDate: '2012-12-12'
        }
    },
    reducers: {
        getTodoForUpdateModal: (state, action) => {
            state.todoUpdate = action.payload;
        },
        todoUpdateChange: (state, action) => {
            state.todoUpdate = action.payload
        }
    },
    extraReducers: (builder => {
        builder.addCase(fetchTodos.pending, (state, action) => {
            state.status = true
        }).addCase(fetchTodos.fulfilled, (state, action) => {
            state.todos = action.payload;
            state.status = false
        }).addCase(addNewTodo.fulfilled, (state, action) => {
            state.todos = action.payload;
        }).addCase(deleteTodo.fulfilled, (state, action) => {
            state.todos = action.payload;
        }).addCase(deleteTodo.rejected, (state, action) => {
        }).addCase(updateTodo.fulfilled, (state, action) => {
            state.todos = action.payload;
        }).addCase(updateTodo.rejected, (state, action) => {
        }).addCase(statusCheckBoxChange.fulfilled, (state, action) => {
            state.todos = action.payload;
        })
    })

})

export const reloadPage = async (thunkAPI:any) => {
    thunkAPI.dispatch(getNumberOfPages())
    const {search, status, priority,endDate,sort} = thunkAPI.getState().filters
    const activePage = thunkAPI.getState().page.activePage
    const numberOfPages = thunkAPI.getState().page.numberOfPages
    let response ;
    try{
        response = await TodoService.paging(activePage, search, status, priority, "startDate", endDate,sort.field,sort.direction);
    }catch (e){
        modal_confirm("Please log in again !","Oops...",NOTIFICATION_ERROR,()=>{
            window.location.replace("http://localhost:3000/login");
        })
    }
    if(numberOfPages>0 && response.data.length===0){
        thunkAPI.dispatch(paginationSlice.actions.activePageChange(1))
        response = await TodoService.paging(1, search, status, priority, "startDate", endDate,sort.field,sort.direction)
    }
    return response.data;
}
export const fetchTodos = createAsyncThunk<any,number,{dispatch:AppDispatch}>('todos/fetchTodo', async (activePage = 1, thunkAPI) => {
    thunkAPI.dispatch(paginationSlice.actions.activePageChange(activePage))
    return reloadPage(thunkAPI)
})
export const addNewTodo = createAsyncThunk<any,any>('todos/addNewTodo', async (newTodo, thunkAPI) => {
    await TodoService.create(newTodo)
    return reloadPage(thunkAPI)
})

export const statusCheckBoxChange = createAsyncThunk<any,any>('todos/updateStatusTodo', async (todo, thunkAPI) => {
    try {
        await TodoService.update({...todo, status: !todo.status})
    } catch (error) {
        notify(error.response.data.message, NOTIFICATION_ERROR)
    } finally {
        return reloadPage(thunkAPI)
    }
})
export const deleteTodo = createAsyncThunk<any,number>('/todos/deleteTodo', async (id=0, thunkAPI) => {
    try {
        await TodoService.delete(id)
    } catch (error) {
        console.log(error)
        notify(error.response.data.message, NOTIFICATION_ERROR)
    } finally {
        return reloadPage(thunkAPI)
    }
})
export const updateTodo = createAsyncThunk<any,any>('/todos/updateTodo', async (todo, thunkAPI) => {
    try {
        await TodoService.update(todo)
    } catch (error) {
        notify(error.response.data.message, NOTIFICATION_ERROR)
    } finally {
        return reloadPage(thunkAPI)
    }
})


/* Action
    =>todos/fetchTodo/pending
    =>todos/fetchTodo/fulfilled
    =>todos/fetchTodo/rejected
 */


export default todoSlice
// action(object) va action creator() => {return action}
// thunk action(function) thunk action creator ()=> {return thunk action}
/*
export const addTodos = (todo:any) => { //thunk function creator
    return function addTodoThunk(dispatch:AppDispatch, getState:any) { // thunk function - thunk action
        todo.task = 'Tho pro'
        dispatch(todoSlice.actions.addTodo(todo))
    }
}*/

