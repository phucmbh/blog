import request from '../request';

export const apiUploadImageBanner = (file) => {
  const formData = new FormData();
  formData.append('image', file);

  return request({
    url: '/upload',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  });
};

export const apiGetBlog = (params) =>
  request({
    url: '/get-blog',
    method: 'GET',
    params,
  });

export const apiCreateBlog = async (data) => {
  return await request({
    url: '/create-blog',
    method: 'POST',
    data,
  });
};
export const apiAutoSaveContent = (data) =>
  request({
    url: '/autosave',
    method: 'POST',
    data,
  });

export const apiLikeBlog = (data) =>
  request({
    url: '/like-blog',
    method: 'POST',
    data,
  });

export const apiSearchBlogs = (data) =>
  request({
    url: '/search-blogs',
    method: 'POST',
    data,
  });
export const apiLatestBlogs = (data) =>
  request({
    url: '/latest-blogs',
    method: 'POST',
    data,
  });

export const apiTrendingBlogs = (data) =>
  request({
    url: '/trending-blogs',
    method: 'GET',
    data,
  });
