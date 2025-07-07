import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'authReducer',
    initialState: {
        loginData: null,
    },
    reducers: {
        loginSuccess: (state, action) => {
            state.loginData = action.payload
        }
    },
})

export const { loginSuccess } = authSlice.actions
export default authSlice.reducer