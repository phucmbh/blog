import http from "utils/common/http";



export const ApiNotification  = {
  newNotification(){
    return http.get('new-notification');
  },
  notification() {
    return http.get('notifications');
  }
}