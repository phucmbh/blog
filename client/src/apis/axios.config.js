import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_DOMAIN,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    config.headers.authorization = `Bearer ${user?.access_token}`;
    console.log(user?.access_token);
    return config;
  },
  (error) => {
    const user = sessionStorage.getItem('user');
    console.log(user?.access_token);
    console.log('Axios instance: Error: ' + error);
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response?.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log(error.response);
    return error.response;
  }
);

export default axiosInstance;
