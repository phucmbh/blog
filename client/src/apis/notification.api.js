import request from "./request"



export const ApiNotification  = {
  newNotification(){
    return request.get('new-notification');
  },
  notification() {
    return request.get('notifications');
  }
}