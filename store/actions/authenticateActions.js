import commerce from '../../lib/commerce';
import axios from 'axios';
import { CLEAR_CUSTOMER, SET_CUSTOMER, SET_USER, CLEAR_USER } from './actionTypes';

const fetchUser = (url) =>
  fetch(url)
    .then((r) => r.json())
    .then((data) => {
      console.log(data)
      useStore.dispatch({ type: 'SET_USER', payload: data?.user || null });
      return { user: data?.user || null };
    });

/**
 * 
 * Fetch user info from backend API
 */
export const setUser = () => (dispatch) => {
  return fetchUser('/api/user').then((user) => {
    dispatch({ type: SET_CUSTOMER, payload: user });
  }).catch((error) => {
    // Most likely a 404, meaning the customer doesn't exist. It should be logged out
    console.log(error)
  });
  // First check is customer is logged in and just return out if they're not
  /*const isLoggedIn = commerce.customer.isLoggedIn();
  if (!isLoggedIn || isLoggedIn === false) {
    dispatch({ type: CLEAR_CUSTOMER });
    return Promise.resolve(null);
  }
  return commerce.customer.about().then((customer) => {
    dispatch({ type: SET_CUSTOMER, payload: customer });
  }).catch(() => {
    // Most likely a 404, meaning the customer doesn't exist. It should be logged out
    commerce.customer.logout();
    dispatch({ type: CLEAR_CUSTOMER });
  });*/
}

/**
 * Fetch the customer information from Commerce.js. If the customer is not
 * logged in yet, an empty promise will be returned.
 */
export const setCustomer = () => (dispatch) => {
  // First check is customer is logged in and just return out if they're not
  const isLoggedIn = commerce.customer.isLoggedIn();
  if (!isLoggedIn || isLoggedIn === false) {
    dispatch({ type: CLEAR_CUSTOMER });
    return Promise.resolve(null);
  }
  return commerce.customer.about().then((customer) => {
    dispatch({ type: SET_CUSTOMER, payload: customer });
  }).catch(() => {
    // Most likely a 404, meaning the customer doesn't exist. It should be logged out
    commerce.customer.logout();
    dispatch({ type: CLEAR_CUSTOMER });
  });
}

/**
 * Clear the logged in customer from state, and from Commerce.js.
 */
export const clearCustomer = () => (dispatch) => {
  commerce.customer.logout();
  dispatch({ type: CLEAR_CUSTOMER });
}
