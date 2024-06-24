import request from 'apis/request';

export default class UserService {
  static apiNewNotification = () =>
    request({
      url: '/new-notification',
      method: 'GET',
    });

  static getNotifications = (params) =>
    request({
      url: '/notifications',
      method: 'GET',
      params
    });
}
