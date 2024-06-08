import axiosInstance from './axios.config';

export const apiUploadImageBanner = (file) => {
  const formData = new FormData();
  formData.append('image', file);

  return axiosInstance({
    url: '/upload',
    method: 'POST',
    header: { 'Content-Type': 'multipart/form-data' },
    data: formData,
  });
};

export const apiDeleteBlog = (data) =>
  axiosInstance({
    url: '/delete-blog',
    method: 'POST',
    data,
  });
export const apiGetBlog = (data) =>
  axiosInstance({
    url: '/get-blog',
    method: 'POST',
    data,
  });

export const apiCreateBlog = (data) =>
  axiosInstance({
    url: '/create-blog',
    method: 'POST',
    data,
  });

export const apiLikeBlog = (data) =>
  axiosInstance({
    url: '/like-blog',
    method: 'POST',
    data,
  });

export const apiSearchBlogs = (data) =>
  axiosInstance({
    url: '/search-blogs',
    method: 'POST',
    data,
  });
export const apiLatestBlogs = (data) =>
  axiosInstance({
    url: '/latest-blogs',
    method: 'POST',
    data,
  });
export const apiUserWrittenBlogs = (data) =>
  axiosInstance({
    url: '/user-written-blogs',
    method: 'POST',
    data,
  });












export const apiTrendingBlogs = (data) =>
  axiosInstance({
    url: '/trending-blogs',
    method: 'GET',
    data,
  });
