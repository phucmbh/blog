import request from './request';

export const ApiComment = {
  getReply(body) {
    return request.post('get-replies', body);
  },
  blogComment(params) {
    return request.get('get-blog-comments', params);
  },
  addComment(body) {
    return request.get('add-comment', body);
  },
  deleteComment(body) {
    return request.post('delete-comment', body);
  },
};
