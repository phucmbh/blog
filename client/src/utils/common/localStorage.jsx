export const LocalStorage = {
  setTheme(newTheme) {
    return localStorage.setItem('theme', newTheme);
  },
  getTheme() {
    return localStorage.getItem('theme');
  },
  setUser(user) {
    return localStorage.setItem('user', JSON.stringify(user));
  },
  getUser() {
    const result = localStorage.getItem('user');
    return result
      ? JSON.parse(result)
      : { username: '', fullname: '', profile_img: '' };
  },
  setAccessToken(accessToken) {
    return localStorage.setItem('accessToken', accessToken);
  },
  getAccessToken() {
    return localStorage.getItem('accessToken');
  },
  clear() {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
  },
};
