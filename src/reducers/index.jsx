import { combineReducers } from '@reduxjs/toolkit'
import AuthReducers from "./AuthReducers";
import HomeReducers from "./HomeReducers";

const rootReducer = combineReducers({
    authReducer: AuthReducers,
    homeReducer: HomeReducers
});

export default rootReducer;