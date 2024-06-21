import axios from 'axios';

const client = (() => {
  return axios.create({
    baseURL: import.meta.env.VITE_SERVER_DOMAIN,
    headers: {
      Accept: 'application/json, text/plain, */*',
    },
  });
})();

client.interceptors.request.use(
  (config) => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    config.headers.authorization = `Bearer ${user?.access_token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
client.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log(error.response);
    return error.response;
  }
);

const request = async (options) => {
  const onSuccess = (response) => {
    const { data } = response;
    return data;
  };

  const onError = function (error) {
    return Promise.reject({
      message: error.message,
      code: error.code,
      response: error.response,
    });
  };

  return client(options).then(onSuccess).catch(onError);
};

export default request;
