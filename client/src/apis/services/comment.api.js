import request from '../request';

export const apiGetReply = (data) =>
  request({
    url: '/get-replies',
    method: 'POST',
    data,
  });

export const apiBlogComment = (params) =>
  request({
    url: '/get-blog-comments',
    method: 'GET',
    params,
  });

export const apiAddComment = (data) =>
  request({
    url: '/add-comment',
    method: 'POST',
    data,
  });

export const apiDeleteComment = (data) =>
  request({
    url: '/delete-comment',
    method: 'POST',
    data,
  });
