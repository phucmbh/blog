import BlogService from './service';

export default class BlogQueryMethods {
  static getLatestBlogs = async (query) => {
    const response = await BlogService.getLatestBlogs(query);
    return response;
  };

  static getBlog = async (query) => {
    const response = await BlogService.getBlog(query);
    return response;
  };

  static getTrendingBlogs = async (query) => {
    const response = await BlogService.getTrendingBlogs(query);
    return response;
  };
}
