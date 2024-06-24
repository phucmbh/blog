import CommentService from '../CommentService/service';
import BlogService from './service';

export default class BlogQueryMethods {
  static getBlogAndComments = async ({ blog_id, setParentCommentCountFun }) => {
    const { blog } = await BlogService.getBlog({ blog_id });
    blog.comments = await CommentService.getBlogComment({
      blog_id: blog._id,
      setParentCommentCountFun,
    });
    console.log(blog);

    return blog;
  };

  static getBlog = async (params) => {
    const response = await BlogService.getBlog(params);
    return response;
  };

  static searchBlogs = async (params) => {
    const response = await BlogService.searchBlogs(params);
    return response;
  };

  static getAllBlogs = async (params) => {
    const response = await BlogService.getAllBlogs(params);
    return response;
  };

  static getTrendingBlogs = async (query) => {
    const response = await BlogService.getTrendingBlogs(query);
    return response;
  };

  static getBlogsByUser = async (query) => {
    const response = await BlogService.getBlogsByUser(query);
    return response;
  };

  static getDraftsByUser = async (query) => {
    const response = await BlogService.getDraftsByUser(query);
    return response;
  };
}
