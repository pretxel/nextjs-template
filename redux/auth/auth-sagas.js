import { put, call, takeLatest } from 'redux-saga/effects';
import Router from 'next/router';
import Cookies from 'js-cookie';
import moment from 'moment';

import { http } from '@lib/http';

import { wrap } from '@redux/app/app-utilities';

import { authActions } from './auth-actions';
import { authApi } from './auth-api';

export function * loginSaga(action) {
  const response = yield call([authApi, 'login'], action.credentials); // see https://github.com/redux-saga/redux-saga/issues/1389

  const data = yield response.json();

  if (data.token) {
    // set the cookie
    const expires = moment(data.expires).diff(moment(), 'days', true);
    Cookies.set('token', data.token, { expires });
    // set the Authorization header
    http.defaults.headers['Authorization'] = `Bearer ${data.token}`;

    // update state and navigate
    yield put(authActions.setUser(data));
    yield call(Router.push, '/');
  } else {
    yield put(authActions.setAuthError(true));
  }
}

export function * registerSaga(action) {
  let response;
  try {
    response = yield call([authApi, 'register'], action.credentials);
  } catch {
    yield put(authActions.setAuthError(true));
    return;
  }

  const data = yield response.json();

  if (data.token) {
    // set the cookie
    const expires = moment(data.expires).diff(moment(), 'days', true);
    Cookies.set('token', data.token, { expires });

    // set the Authorization header
    http.defaults.headers['Authorization'] = `Bearer ${data.token}`;

    // update state and navigate
    yield put(authActions.setUser(data));
    yield call(Router.push, '/');
  } else {
    yield put(authActions.setAuthError(true));
  }
}

export function * logoutSaga() {
  // remove the cookie
  Cookies.remove('token');

  // clear state and navigate
  yield call(Router.push, '/login');

  try
  {
    // logout from the server
    yield call([authApi, 'logout']);
  } catch { /* not much to be done about it /shrug */ } // eslint-disable-line no-empty

  yield put(authActions.setUser({}));

  // remove the Authorization header
  delete http.defaults.headers['Authorization'];
}

export function * getUserSaga() {
  const response = yield call([authApi, 'getUser']);

  const data = yield response.json();

  yield put(authActions.setUser(data));
}

export const authSagas = [
  takeLatest('LOGIN_SAGA', wrap(loginSaga)),
  takeLatest('REGISTER_SAGA', wrap(registerSaga)),
  takeLatest('LOGOUT_SAGA', logoutSaga),
  takeLatest('GET_USER_SAGA', wrap(getUserSaga))
];

