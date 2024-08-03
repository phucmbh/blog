import request from '../request';



export const apiNotification = () =>
  request({
    url: '/notifications',
    method: 'GET',
  });
