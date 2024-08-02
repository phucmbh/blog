import request from './request';

export const ApiUser = {
  changePasswordUser(body) {
    return request.post('change-password', body);
  },
  getProfile(body) {
    return request.post('get-profile', body);
  },
  updateProfile(body) {
    return request.post('update-profile', body);
  },
  updateProfileImage(body) {
    return request.post('update-profile-img', body);
  },
  searchUsers(body) {
    return request.post('search-users', body);
  },
  isLikedByUser(body) {
    return request.post('isliked-by-user', body);
  },
};
