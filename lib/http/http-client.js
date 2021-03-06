import fetch from 'isomorphic-unfetch';

// Not super sure about isomorphic-unfetch,
// so this wrapper class
//
//   (1) decouples the app from any specific library
//   (2) provides some features missing from isomorphic-unfetch
//       (base urls, default headers, interceptors)
//
// Should be easy enough to switch to axios or something else if desired.
export class Http {

  isConfigured = false;

  defaults = {
    baseUrl: '',
    headers: {},
    interceptors: {}, // 404: (response) => {}
    options: {}
  };

  requestFn = fetch;
  onFail = null;

  static configure(callback) {
    if (!http.isConfigured) {
      callback(http);
      http.isConfigured = true;
    }
    return http;
  }

  static setAuth(callback) {
    callback(http);
  }

  get(url, options) {
    return this.request(url, 'GET', undefined, options);
  }

  post(url, body, options) {
    return this.request(url, 'POST', JSON.stringify(body), options);
  }

  put(url, body, options) {
    return this.request(url, 'PUT', JSON.stringify(body), options);
  }

  patch(url, body, options) {
    return this.request(url, 'PATCH', JSON.stringify(body), options);
  }

  delete(url, options) {
    return this.request(url, 'DELETE', undefined, options);
  }

  request(url, method, body, options) {
    url = this.defaults.baseUrl + url;

    options = {
      ...this.defaults.options,
      ...options,
      method,
      body
    };

    options.headers = {
      ...this.defaults.headers,
      ...options.headers
    };

    if (typeof(window) !== 'undefined' && body instanceof FormData) {
      delete options.headers['Content-Type'];
    }

    return new Promise((resolve, reject) => {
      this.requestFn(url, options)
        .then((response) => {
          const interceptor = this.defaults.interceptors[response.status];
          if (interceptor) {
            interceptor(response);
          }

          resolve(response);
        })
        .catch((error) => {
          if (error && error.toString() === 'TypeError: Failed to fetch' && this.onFail) {
            this.onFail(error);
          }
          reject(error);
        });
    });
  }
}

export const http = new Http();

