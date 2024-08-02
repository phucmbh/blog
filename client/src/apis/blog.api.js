import request from './request';

export const ApiBlog = {
  uploadImageBanner(body) {
    return request.post('/upload', body, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getBlog(params) {
    return request.get('get-blog', { params });
  },
  createBlog(body) {
    return request.post('create-blog', body);
  },
  autoSaveContent(body) {
    return request.post('autosave', body);
  },
  likeBlog(body) {
    return request.post('like-blog', body);
  },
  searchBlog(body) {
    return request.post('search-blogs', body);
  },
  latestBlogs(body) {
    return request.post('latest-blogs', body);
  },
  trendingBlogs(body) {
    return request.get('trending-blogs', body);
  },
};
