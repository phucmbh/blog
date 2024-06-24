import request from '../request';

export const apiNewNotification = () =>
  request({
    url: '/new-notification',
    method: 'GET',
  });

export const apiNotification = () =>
  request({
    url: '/notifications',
    method: 'GET',
  });
