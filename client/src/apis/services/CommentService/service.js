import request from 'apis/request';

export default class CommentService {
  static apiGetReply = (data) =>
    request({
      url: '/get-replies',
      method: 'POST',
      data,
    });

  static apiBlogComment = (data) =>
    request({
      url: '/get-blog-comments',
      method: 'POST',
      data,
    });

  static apiAddComment = (data) =>
    request({
      url: '/add-comment',
      method: 'POST',
      data,
    });

  static apiDeleteComment = (data) =>
    request({
      url: '/delete-comment',
      method: 'POST',
      data,
    });
}
