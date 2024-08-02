import http from 'utils/common/http';

export const ApiUser = {
  signIn(body) {
    return http.post('signin', body);
  },
  signUp(body) {
    return http.post('signup', body);
  },
  changePasswordUser(body) {
    return http.post('change-password', body);
  },
  getProfile(body) {
    return http.post('get-profile', body);
  },
  updateProfile(body) {
    return http.post('update-profile', body);
  },
  updateProfileImage(body) {
    return http.post('update-profile-img', body);
  },
  searchUsers(body) {
    return http.post('search-users', body);
  },
  isLikedByUser(body) {
    return http.post('isliked-by-user', body);
  },
};
