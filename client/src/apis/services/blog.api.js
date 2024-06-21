import request from '../request';

export const apiUploadImageBanner = (file) => {
  const formData = new FormData();
  formData.append('image', file);

  return request({
    url: '/upload',
    method: 'POST',
    header: { 'Content-Type': 'multipart/form-data' },
    data: formData,
  });
};

export const apiDeleteBlog = (data) =>
  request({
    url: '/delete-blog',
    method: 'POST',
    data,
  });
export const apiGetBlog = (data) =>
  request({
    url: '/get-blog',
    method: 'POST',
    data,
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
export const apiUserWrittenBlogs = (data) =>
  request({
    url: '/user-written-blogs',
    method: 'POST',
    data,
  });

export const apiTrendingBlogs = (data) =>
  request({
    url: '/trending-blogs',
    method: 'GET',
    data,
  });
