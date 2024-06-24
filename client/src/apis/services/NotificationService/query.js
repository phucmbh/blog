

export default class NotificationQueryMethods{

  static getNotifications = async (params) => {
    const response = await NotificationService.getNotifications(params);
    return response;
  }
}