import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { adminReducer } from "./reducer";

export const store = configureStore({
    reducer: {
        adminReducer
    },
    devTools: true,
    middleware: getDefaultMiddleware({
        serializableCheck: false
    })
})