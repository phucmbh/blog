import request from 'apis/request';

export default class UserService {
  static apiChangePasswordUser = (data) =>
    request({
      url: '/change-password',
      method: 'POST',
      data,
    });
  static apiGetProfile = (data) =>
    request({
      url: '/get-profile',
      method: 'POST',
      data,
    });

  static apiUpdateProfileImage = (data) =>
    request({
      url: '/update-profile-img',
      method: 'POST',
      data,
    });
  static apiUpdateProfile = (data) =>
    request({
      url: '/update-profile',
      method: 'POST',
      data,
    });

  static apiIsLikedByUser = (data) =>
    request({
      url: '/isliked-by-user',
      method: 'POST',
      data,
    });
  static apiSearchUsers = (data) =>
    request({
      url: '/search-users',
      method: 'POST',
      data,
    });
}
