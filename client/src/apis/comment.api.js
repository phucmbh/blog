import http from "utils/common/http";

export const ApiComment = {
  getReply(body) {
    return http.post('get-replies', body);
  },
  blogComment(params) {
    return http.get('get-blog-comments', params);
  },
  addComment(body) {
    return http.get('add-comment', body);
  },
  deleteComment(body) {
    return http.post('delete-comment', body);
  },
};
