import UserService from './service';

export default class UserQueryMethods {
  static searchUsers = async (params) => {
    const response = await UserService.searchUsers(params);
    return response;
  };

  static getProfileAndBlogsByUser = async (params) => {
    const response = await UserService.getProfileAndBlogsByUser(params);
    console.log(response);
    return response;
  };
}
