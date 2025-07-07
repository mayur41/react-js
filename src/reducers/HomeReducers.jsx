import { createSlice } from '@reduxjs/toolkit'

const dashboardSlice = createSlice({
    name: 'homeReducer',
    initialState: {
        taskData: null,
    },
    reducers: {
        setTaskData: (state, action) => {
            state.taskData = action.payload
        },

    },
})

export const { setTaskData } = dashboardSlice.actions

export default dashboardSlice.reducer