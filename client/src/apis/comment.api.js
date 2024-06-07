import axiosInstance from './axios.config';

export const apiGetReply = (data) =>
  axiosInstance({
    url: '/get-replies',
    method: 'POST',
    data,
  });

export const apiBlogComment = (data) =>
  axiosInstance({
    url: '/get-blog-comments',
    method: 'POST',
    data,
  });

export const apiAddComment = (data) =>
  axiosInstance({
    url: '/add-comment',
    method: 'POST',
    data,
  });

export const apiDeleteComment = (data) =>
  axiosInstance({
    url: '/delete-comment',
    method: 'POST',
    data,
  });
