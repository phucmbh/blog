import request from 'apis/request';

export default class BlogService {
  static getBlog = (data) => {
    return request({
      url: '/get-blog',
      method: 'GET',
      data,
    });
  };

  static getTrendingBlogs = (data) => {
    return request({
      url: '/trending-blogs',
      method: 'GET',
      data,
    });
  };

  static getLatestBlogs = (data) => {
    return request({
      url: '/latest-blogs',
      method: 'GET',
      data,
    });
  };

  static getBlogsByUser = ({page, search}) => {
    return request({
      url: '/get-blogs-by-user',
      method: 'GET',
      params:{
        page,
        search
      }
    });
  };

  static getDraftsByUser = ({ page, search }) => {
    return request({
      url: '/get-drafts-by-user',
      method: 'GET',
      params: {
        page,
        search,
      },
    });
  };

  static uploadImageBanner = (file) => {
    const formData = new FormData();
    formData.append('image', file);

    return request({
      url: '/upload',
      method: 'POST',
      header: { 'Content-Type': 'multipart/form-data' },
      data: formData,
    });
  };

  static deleteBlog = (data) => {
    return request({
      url: '/delete-blog',
      method: 'POST',
      data,
    });
  };

  static createBlog = async (data) => {
    return request({
      url: '/create-blog',
      method: 'POST',
      data,
    });
  };

  static autoSaveContent = (data) => {
    return request({
      url: '/autosave',
      method: 'POST',
      data,
    });
  };

  static likeBlog = (data) => {
    return request({
      url: '/like-blog',
      method: 'POST',
      data,
    });
  };

  static searchBlogs = (data) => {
    return request({
      url: '/search-blogs',
      method: 'POST',
      data,
    });
  };

  static userWrittenBlogs = (data) => {
    return request({
      url: '/user-written-blogs',
      method: 'POST',
      data,
    });
  };
}
