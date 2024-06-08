import axiosInstance from './axios.config';

export const apiNewNotification = () =>
  axiosInstance({
    url: '/new-notification',
    method: 'GET',
  });


  export const apiNotification = () =>
    axiosInstance({
      url: '/notifications',
      method: 'POST',
    });
