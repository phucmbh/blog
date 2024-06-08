import axiosInstance from './axios.config';

export const apiChangePasswordUser = (data) =>
  axiosInstance({
    url: '/change-password',
    method: 'POST',
    data,
  });
export const apiGetProfile = (data) =>
  axiosInstance({
    url: '/get-profile',
    method: 'POST',
    data,
  });

export const apiUpdateProfileImage = (data) =>
  axiosInstance({
    url: '/update-profile-img',
    method: 'POST',
    data,
  });
export const apiUpdateProfile = (data) =>
  axiosInstance({
    url: '/update-profile',
    method: 'POST',
    data,
  });


export const apiIsLikedByUser = (data) =>
  axiosInstance({
    url: '/isliked-by-user',
    method: 'POST',
    data,
  });
export const apiSearchUsers = (data) =>
  axiosInstance({
    url: '/search-users',
    method: 'POST',
    data,
  });
