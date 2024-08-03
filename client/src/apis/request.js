import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_DOMAIN,
  headers: {
    Accept: 'application/json, text/plain, */*',
  },
});

instance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    config.headers.authorization = `Bearer ${user?.access_token}`;
    console.log('api request');
    return config;
  },
  (error) => {
    return Promise.reject({
      message: error.message,
      code: error.code,
      response: error.response,
    });
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    const { data } = response;

    return data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log(error.response);
    return Promise.reject(error);
  }
);

const request = instance;
export default request;
