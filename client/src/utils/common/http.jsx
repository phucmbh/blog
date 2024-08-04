import axios from 'axios';
import { LocalStorage } from './localStorage';
import { URL } from 'utils/constants/url.constant';

class Http {
  instance;
  accessToken;

  constructor() {
    this.accessToken = LocalStorage.getAccessToken();

    this.instance = axios.create({
      baseURL: import.meta.env.VITE_SERVER_DOMAIN,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken)
          config.headers.authorization = 'Bearer ' + this.accessToken;
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response) => {
      // console.log(response);
        const { url } = response.config;
        if (url === URL.SIGN_IN || url === URL.SIGN_UP) {
          this.accessToken = response.data.access_token;
          LocalStorage.setAccessToken(response.data.access_token);
          LocalStorage.setUser(response.data);
        }
        return response;
      },
      function (error) {
        return Promise.reject(error);
      }
    );
  }
}

const http = new Http().instance;
export default http;
