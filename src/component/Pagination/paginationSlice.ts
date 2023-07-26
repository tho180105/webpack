import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import TodoService from "../../services/Services/TodoService";
export const getActivePage = () => {
    return localStorage.getItem('ACTIVE_PAGE')||1 ;
}
export default createSlice({
    name: 'pagination',
    initialState: {
        numberOfPages: 1,
        activePage:1
    },
    reducers: {
        activePageChange: (state, action) => {
            state.activePage = action.payload;
        },
        numberOfPagesChange: (state, action) => {
            state.numberOfPages = action.payload;
        },
    },
    extraReducers:(builder => {
        builder.addCase(getNumberOfPages.fulfilled,(state,action)=>{
            state.numberOfPages = action.payload.data;
        })
    })
})

export const getNumberOfPages=createAsyncThunk('page/getNumberOfPages',(nothing,thunkAPI:any)=>{
    const {search, status, priority,startDate,endDate} = thunkAPI.getState().filters
    return TodoService.getTotalPages(search,status,priority,startDate,endDate);
})

