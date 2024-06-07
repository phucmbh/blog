import axiosInstance from './axios.config';

export const apiChangePasswordUser = (data) =>
  axiosInstance({
    url: '/change-password',
    method: 'POST',
    data,
  });
