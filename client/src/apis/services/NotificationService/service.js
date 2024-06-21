import request from 'apis/request';

export default class UserService {
  static apiNewNotification = () =>
    request({
      url: '/new-notification',
      method: 'GET',
    });

  static apiNotification = () =>
    request({
      url: '/notifications',
      method: 'POST',
    });
}
