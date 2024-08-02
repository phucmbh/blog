import http from "utils/common/http";

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
  createBlog(body) {
    return http.post('create-blog', body);
  },
  autoSaveContent(body) {
    return http.post('autosave', body);
  },
  likeBlog(body) {
    return http.post('like-blog', body);
  },
  searchBlog(body) {
    return http.post('search-blogs', body);
  },
  latestBlogs(body) {
    return http.post('latest-blogs', body);
  },
  trendingBlogs(body) {
    return http.get('trending-blogs', body);
  },
};
