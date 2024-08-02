import request from '../request';


export const apiGetProfile = (data) =>
  request({
    url: '/get-profile',
    method: 'POST',
    data,
  });

export const apiUpdateProfileImage = (data) =>
  request({
    url: '/update-profile-img',
    method: 'POST',
    data,
  });
export const apiUpdateProfile = (data) =>
  request({
    url: '/update-profile',
    method: 'POST',
    data,
  });

export const apiIsLikedByUser = (data) =>
  request({
    url: '/isliked-by-user',
    method: 'POST',
    data,
  });
export const apiSearchUsers = (data) =>
  request({
    url: '/search-users',
    method: 'POST',
    data,
  });
