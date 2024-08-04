import http from 'utils/common/http';

export const ApiBlog = {
  uploadImageBanner(body) {
    return http.post('/upload', body, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getBlog(params) {
    return http.get('get-blog', { params });
  },
  getAllBlogs(params) {
    return http.get('get-all-blogs', { params });
  },
  getTredingBlogs() {
    return http.get('trending-blogs');
  },
  createBlog(body) {
    return http.post('create-blog', body);
  },
  autoSaveContent(body) {
    return http.post('autosave', body);
  },
  likeBlog(body) {
    return http.post('like-blog', body);
  },
  searchBlogs(params) {
    return http.get('search-blogs', { params });
  },
  latestBlogs(body) {
    return http.post('latest-blogs', body);
  },
  trendingBlogs(body) {
    return http.get('trending-blogs', body);
  },
  getBlogsByUser(body) {
    return http.get('get-blogs-by-user', body);
  },
  getDraftsByUser(body) {
    return http.get('get-drafts-by-user', body);
  },
  deleteBlog(body) {
    return http.get('delete-blog', body);
  },
};
