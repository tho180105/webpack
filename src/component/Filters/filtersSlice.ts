
import { createSlice} from "@reduxjs/toolkit";
const initialState : {
    search: string,
    status: string,
    priority: string[],
    startDate:any,
    endDate:any,
    sort:{
        field:string,
        direction:string
    }
}
= {
    search: "",
    status: 'All',
    priority: new Array(),
    startDate:'',
    endDate:'',
    sort:{
        field:'id',
        direction:'desc'
    }
}
export default  createSlice({
    name :'filters',
    initialState ,
    reducers:{
        searchFilterChange:(state,action)=>{
            state.search = action.payload
        },
        statusFilterChange:(state,action)=>{
            state.status = action.payload
        },
        priorityFilterTick:(state,action)=>{
            state.priority.push(action.payload)
        },
        priorityFilterUnTick:(state,action)=>{
            state.priority =state.priority.filter(priority=>priority!==action.payload)
        },
        startDateChange:(state,action)=>{
            state.startDate=action.payload
        },
        endDateChange:(state,action)=>{
            state.endDate=action.payload
        },
        fieldSortChange:(state,action)=>{
            state.sort.field=action.payload
        },
        directionSortChange:(state,action)=>{
            state.sort.direction=(action.payload)
        },
        clearStore:()=>{
           return initialState;
        }
    },
});



