import { createAsyncThunk } from '@reduxjs/toolkit'
import Swal from 'sweetalert2';
import { firebaseAuth } from '../helpers/firebase';
import { request } from '../helpers/request'
import { req_constants } from '../helpers/constants'
import errorHandler from '../helpers/errorHandler';
// REACT_APP_CART, REACT_APP_PROD, REACT_APP_ORDER, REACT_APP_OFFER
const { REACT_APP_AUTH, REACT_APP_ADMIN } = process.env;

export const VERIFY_ADMIN_TOKEN = createAsyncThunk(
  'VERIFY_ADMIN_TOKEN', async ({ user, idtoken }) => {
    try {
      const res = await request(req_constants.GET, `${REACT_APP_AUTH}/auth/verify-admin-token?user=${user}`, null, null, idtoken);
      if (res.data) {
        localStorage.setItem('token', idtoken)
        localStorage.setItem('user', user)
        localStorage.setItem('user_auth', res.data);
      } else {
        localStorage.getItem('token') && localStorage.removeItem('token')
        localStorage.getItem('user') && localStorage.removeItem('user')
        localStorage.getItem('user_auth') && localStorage.removeItem('user_auth')
      }
      return res?.data;
    } catch (error) {
      const firebaseError = error.message.replace('Firebase: Error', '').match(/\((.*)\)/).pop();
      Swal.fire({
        title: 'Error!',
        text: `${firebaseError}`,
        icon: 'error',
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false
      });
      return firebaseError;
    }
  }
);

export const LOGOUT = createAsyncThunk(
  'LOGOUT', async () => {
    try {
      await firebaseAuth.signOut()
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.setItem('user_auth', false)

    } catch (error) {
      const firebaseError = error.message.replace('Firebase: Error', '').match(/\((.*)\)/).pop()
      Swal.fire({
        title: 'Error!',
        text: `${firebaseError}`,
        icon: 'error'
      })
      return firebaseError
    }
  }
)

export const SEARCH_PRODUCTS = createAsyncThunk(
  'SEARCH_PRODUCTS', async ({ input_value }) => {
    try {
      const res = await request(req_constants.GET, `${REACT_APP_ADMIN}/admin/search/product-movement?input=${input_value}`, null, null)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const SEARCH_USERS = createAsyncThunk(
  'SEARCH_USERS', async ({ input_value }) => {
    try {
      const res = await request(req_constants.GET, `${REACT_APP_ADMIN}/admin/search/user-movement?input=${input_value}`, null, null)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const CREATE_MANUALLY_SELL = createAsyncThunk(
  'CREATE_MANUALLY_SELL', async (selldata) => {
    try {
      const res = await request(req_constants.POST, `${REACT_APP_ADMIN}/admin/manual-sell`, null, selldata)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const GET_PAGINATED_ORDERS = createAsyncThunk(
  'GET_PAGINATED_ORDERS', async (page) => {
    try {
      const res = await request(req_constants.GET, `${REACT_APP_ADMIN}/admin/orders?page=${page}`, null, null)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const CREATE_MANUALLY_BUY = createAsyncThunk(
  'CREATE_MANUALLY_BUY', async (buydata) => {
    try {
      const res = await request(req_constants.POST, `${REACT_APP_ADMIN}/admin/manual-buy`, null, buydata)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const GET_PAGINATED_BUYS = createAsyncThunk(
  'GET_PAGINATED_BUYS', async (page) => {
    try {
      const res = await request(req_constants.GET, `${REACT_APP_ADMIN}/admin/buys?page=${page}`, null, null)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const CREATE_MANUALLY_CLIENT = createAsyncThunk(
  'CREATE_MANUALLY_CLIENT', async (clientdata) => {
    try {
      const res = await request(req_constants.POST, `${REACT_APP_ADMIN}/admin/manual-client`, null, clientdata)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const GET_PAGINATED_USERS = createAsyncThunk(
  'GET_PAGINATED_USERS', async (page) => {
    try {
      const res = await request(req_constants.GET, `${REACT_APP_ADMIN}/admin/users?page=${page}`, null, null)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const GET_PAGINATED_PRODUCTS = createAsyncThunk(
  'GET_PAGINATED_PRODUCTS', async (page) => {
    try {
      const res = await request(req_constants.GET, `${REACT_APP_ADMIN}/admin/products?page=${page}`, null, null)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const CREATE_MANUALLY_EXPENSE = createAsyncThunk(
  'CREATE_MANUALLY_EXPENSE', async (expensedata) => {
    try {
      const res = await request(req_constants.POST, `${REACT_APP_ADMIN}/admin/manual-expense`, null, expensedata)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const GET_PAGINATED_EXPENSES = createAsyncThunk(
  'GET_PAGINATED_EXPENSES', async (page) => {
    try {
      const res = await request(req_constants.GET, `${REACT_APP_ADMIN}/admin/expenses?page=${page}`, null, null)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const CHANGE_SUBPRODUCT_ACTIVE = createAsyncThunk(
  'CHANGE_SUBPRODUCT_ACTIVE', async (subprod_id) => {
    try {
      const res = await request(req_constants.PUT, `${REACT_APP_ADMIN}/admin-atomic/active-change/${subprod_id}`, null, null)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const CHANGE_SUBPRODUCT_HIGHLIGHT = createAsyncThunk(
  'CHANGE_SUBPRODUCT_HIGHLIGHT', async (subprod_id) => {
    try {
      const res = await request(req_constants.PUT, `${REACT_APP_ADMIN}/admin-atomic/highlight-change/${subprod_id}`, null, null)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const UPDATE_SUBPRODUCT = createAsyncThunk(
  'UPDATE_SUBPRODUCT', async ({ subprod_id, dataToUpdate }) => {
    try {
      const res = await request(req_constants.PUT, `${REACT_APP_ADMIN}/admin-atomic/subprod/${subprod_id}`, null, dataToUpdate)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const GET_BUYS_REPORT = createAsyncThunk(
  'GET_BUYS_REPORT', async (date) => {
    try {
      let query = ''
      if (date) {
        query = `?date=${date}`
      }
      const res = await request(req_constants.GET, `${REACT_APP_ADMIN}/admin/report-buys${query}`, null, null)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const GET_EXPENSES_REPORT = createAsyncThunk(
  'GET_EXPENSES_REPORT', async (date) => {
    try {
      let query = ''
      if (date) {
        query = `?date=${date}`
      }
      const res = await request(req_constants.GET, `${REACT_APP_ADMIN}/admin/report-expenses${query}`, null, null)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const GET_SELLS_REPORT = createAsyncThunk(
  'GET_SELLS_REPORT', async (date) => {
    let query = ''
    if (date) {
      query = `?date=${date}`
    }
    try {
      const res = await request(req_constants.GET, `${REACT_APP_ADMIN}/admin/report-sells${query}`, null, null)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const GET_USERS_REPORT = createAsyncThunk(
  'GET_USERS_REPORT', async () => {
    try {
      const res = await request(req_constants.GET, `${REACT_APP_ADMIN}/admin/report-users`, null, null)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const GET_DELIVERY_BY_WEEK = createAsyncThunk(
  'GET_DELIVERY_BY_WEEK', async () => {
    try {
      const res = await request(req_constants.GET, `${REACT_APP_ADMIN}/admin/delivery-orders`, null, null)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const GET_ORDER_DETAILS = createAsyncThunk(
  'GET_ORDER_DETAILS', async (order_id) => {
    try {
      const res = await request(req_constants.GET, `${REACT_APP_ADMIN}/admin-atomic/details/${order_id}`, null, null)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const UPDATE_ORDER_DELIVER_STATUS = createAsyncThunk(
  'UPDATE_ORDER_DELIVER_STATUS', async ({ order_id, status }) => {
    try {
      const res = await request(req_constants.PUT, `${REACT_APP_ADMIN}/admin-atomic/order-status/${order_id}?status=${status}`, null, null)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const GET_PRODUCTS_SEARCH = createAsyncThunk(
  'GET_PRODUCTS_SEARCH', async ({ page, text }) => {
    try {
      const res = await request(req_constants.GET, `${REACT_APP_ADMIN}/admin/product-search?page=${page}&text=${text}`, null, null)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const GET_SUBPRODUCT_DETAILS = createAsyncThunk(
  'GET_SUBPRODUCT_DETAILS', async (subprod_id) => {
    try {
      const res = await request(req_constants.GET, `${REACT_APP_ADMIN}/admin/subprod/${subprod_id}`, null, null)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const GET_CAROUSEL_ITEMS = createAsyncThunk(
  'GET_CAROUSEL_ITEMS', async (type) => {
    try {
      const res = await request(req_constants.GET, `${REACT_APP_ADMIN}/admin/landing-images?type=CAROUSEL`, null, null)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const GET_PRODUCTS_TYPES = createAsyncThunk(
  'GET_PRODUCTS_TYPES', async () => {
    try {
      const res = await request(req_constants.GET, `${REACT_APP_ADMIN}/admin-atomic/product-types`, null, null)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const CREATE_PRODUCT = createAsyncThunk(
  'CREATE_PRODUCT', async (product) => {
    try {
      const res = await request(req_constants.POST, `${REACT_APP_ADMIN}/admin/create-product`, null, product)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const CREATE_SUBPRODUCT = createAsyncThunk(
  'CREATE_SUBPRODUCT', async (subproduct) => {
    try {
      const res = await request(req_constants.POST, `${REACT_APP_ADMIN}/admin/create-subproduct`, null, subproduct)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const UPDATE_USER_NEXT_BUY = createAsyncThunk(
  'UPDATE_USER_NEXT_BUY', async (next_buy) => {
    try {
      const res = await request(req_constants.PUT, `${REACT_APP_ADMIN}/admin-atomic/next-buy`, null, next_buy)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const GET_PRODUCTS_TO_ADD = createAsyncThunk(
  'GET_PRODUCTS_TO_ADD', async (input) => {
    try {
      const res = await request(req_constants.GET, `${REACT_APP_ADMIN}/admin-atomic/product?input=${input}`, null, null)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)

export const GET_USERS_REBUY_WEEK = createAsyncThunk(
  'GET_USERS_REBUY_WEEK', async () => {
    try {
      const res = await request(req_constants.GET, `${REACT_APP_ADMIN}/admin/users-week`, null, null)
      return res?.data
    } catch (error) {
      return errorHandler(error)
    }
  }
)