import { createReducer } from "@reduxjs/toolkit"
import { CHANGE_SUBPRODUCT_ACTIVE, CHANGE_SUBPRODUCT_HIGHLIGHT, CREATE_MANUALLY_BUY, CREATE_MANUALLY_CLIENT, CREATE_MANUALLY_SELL, GET_BUYS_REPORT, GET_DELIVERY_BY_WEEK, GET_ORDER_DETAILS, GET_PAGINATED_BUYS, GET_PAGINATED_ORDERS, GET_PAGINATED_PRODUCTS, GET_PAGINATED_USERS, GET_SELLS_REPORT, GET_USERS_REPORT, LOGOUT, SEARCH_PRODUCTS, SEARCH_USERS, UPDATE_ORDER_DELIVER_STATUS, UPDATE_SUBPRODUCT, VERIFY_ADMIN_TOKEN } from "./actions"

const initialState = {
    token: localStorage.getItem('token'),
    products: [],
    user: localStorage.getItem('user') ? localStorage.getItem('user') : '',
    user_auth: localStorage.getItem('token') ? true : false,
    users: [],
    total_products: 0,
    sells: [],
    buys: [],
    total_pages: 0,
    total_movements: 0,
    subproduct: {},
    total_import_sell: 0,
    total_import_buy: 0,
    month_sell: '',
    month_buy: '',
    total_profit: 0,
    percentage: 0,
    deliverys: [],
    week: {},
    order: {}
}

export const adminReducer = createReducer(initialState, (builder) => {
    builder.addCase(VERIFY_ADMIN_TOKEN.fulfilled, (state, action) => {
        state.user_auth = action.payload
    })
    builder.addCase(SEARCH_PRODUCTS.fulfilled, (state, action) => {
        state.products_filtered = action.payload
    })
    builder.addCase(SEARCH_USERS.fulfilled, (state, action) => {
        state.users = action.payload
    })
    builder.addCase(LOGOUT.fulfilled, (state, action) => {
        state.user = ''
        state.token = ''
    })
    builder.addCase(CREATE_MANUALLY_SELL.fulfilled, (state, action) => {
        state.sells.push(action.payload.data)
    })
    builder.addCase(GET_PAGINATED_ORDERS.fulfilled, (state, action) => {
        state.sells = action.payload.movements
        state.total_movements = action.payload.total_movements
        state.total_pages = action.payload.total_pages
    })
    builder.addCase(CREATE_MANUALLY_BUY.fulfilled, (state, action) => {
        state.buys.push(action.payload.data)
    })
    builder.addCase(GET_PAGINATED_BUYS.fulfilled, (state, action) => {
        state.buys = action.payload.movements
        state.total_movements = action.payload.total_movements
        state.total_pages = action.payload.total_pages
    })
    builder.addCase(CREATE_MANUALLY_CLIENT.fulfilled, (state, action) => {
        state.users.push(action.payload.data)
    })
    builder.addCase(GET_PAGINATED_USERS.fulfilled, (state, action) => {
        state.users = action.payload.movements
        state.total_movements = action.payload.total_movements
        state.total_pages = action.payload.total_pages
    })
    builder.addCase(GET_PAGINATED_PRODUCTS.fulfilled, (state, action) => {
        state.products = action.payload.movements
        state.total_movements = action.payload.total_movements
        state.total_pages = action.payload.total_pages
    })
    builder.addCase(CHANGE_SUBPRODUCT_ACTIVE.fulfilled, (state, action) => {
        state.subproduct = action.payload
    })
    builder.addCase(CHANGE_SUBPRODUCT_HIGHLIGHT.fulfilled, (state, action) => {
        state.subproduct = action.payload
    })
    builder.addCase(UPDATE_SUBPRODUCT.fulfilled, (state, action) => {
        state.subproduct = action.payload
    })
    builder.addCase(GET_BUYS_REPORT.fulfilled, (state, action) => {
        state.buys = action.payload
        state.total_import_buy = action.payload.total_import
        state.month_buy = action.payload.month
    })
    builder.addCase(GET_SELLS_REPORT.fulfilled, (state, action) => {
        state.sells = action.payload.movements
        state.total_import_sell = action.payload.total_import
        state.month_sell = action.payload.month
        state.total_profit = action.payload.total_profit
        state.percentage = action.payload.percentage
    })
    builder.addCase(GET_USERS_REPORT.fulfilled, (state, action) => {
        state.users = action.payload
    })
    builder.addCase(GET_DELIVERY_BY_WEEK.fulfilled, (state, action) => {
        state.deliverys = action.payload.deliverys
        state.week = action.payload.week
    })
    builder.addCase(GET_ORDER_DETAILS.fulfilled, (state, action) => {
        state.order = action.payload
    })
    builder.addCase(UPDATE_ORDER_DELIVER_STATUS.fulfilled, (state, action) => {
        state.deliverys = action.payload
    })
})