import request from 'apis/request';

export default class UserService {
  static searchUsers = (params) => {
    return request({
      url: '/search-users',
      method: 'GET',
      params,
    });
  };

  static getProfileAndBlogsByUser = (params) => {
    return request({
      url: '/get-profile-and-blogs-by-user',
      method: 'GET',
      params,
    });
  };

  static apiChangePasswordUser = (data) => {
    return request({
      url: '/change-password',
      method: 'POST',
      data,
    });
  };



  static apiUpdateProfileImage = (data) => {
    return request({
      url: '/update-profile-img',
      method: 'POST',
      data,
    });
  };
  static apiUpdateProfile = (data) => {
    return request({
      url: '/update-profile',
      method: 'POST',
      data,
    });
  };

  static apiIsLikedByUser = (data) => {
    return request({
      url: '/isliked-by-user',
      method: 'POST',
      data,
    });
  };
}
