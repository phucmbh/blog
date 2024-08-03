import { useContext, useState } from 'react';
import Loader from '../components/Loader';
import AnimationWrapper from '../utils/common/page-animation';
import NoDataMessage from '../components/NoDataMessage';
import NotificationCard from '../components/notification/NotificationCard';
import { useQuery } from '@tanstack/react-query';
import { UserContext } from 'context/user.context';
import { ApiNotification } from 'apis/notification.api';

const Notifications = () => {
  const {
    userAuth,
    userAuth: { new_notification_available },
    setUserAuth,
  } = useContext(UserContext);

  const page = 1;

  const [filter, setFilter] = useState('all');

  const filters = ['all', 'like', 'comment', 'reply'];

  const {
    data: notificationData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['notifications', filter, page],
    queryFn: () => ApiNotification.notification({ filter, page }),
  });

  const notifications = notificationData?.data;

  if (error) return 'An error has occurred: ' + error.message;

  if (new_notification_available) {
    setUserAuth({ ...userAuth, new_notification_available: false });
  }

  const handleFilter = (e) => {
    let btn = e.target;

    setFilter(btn.innerHTML);
  };

  return (
    <div>
      <h1 className="max-md:hidden">Recent Notifications</h1>

      <div className="my-8 flex gap-6">
        {filters.map((filterName, i) => {
          return (
            <button
              key={i}
              className={
                'py-2 ' + (filter == filterName ? 'btn-dark' : 'btn-light')
              }
              onClick={handleFilter}
            >
              {filterName}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <>
          {notifications.length ? (
            notifications.map((notification, i) => {
              return (
                <AnimationWrapper key={i} transition={{ delay: i * 0.08 }}>
                  <NotificationCard
                    data={notification}
                    index={i}
                    notificationState={notifications}
                  />
                </AnimationWrapper>
              );
            })
          ) : (
            <NoDataMessage message="Nothing available" />
          )}

          {/* <LoadMoreDataBtn
            state={notifications}
            fetchDataFun={fetchNotifications}
            additionalParam={{ deletedDocCount: notifications.deletedDocCount }}
          /> */}
        </>
      )}
    </div>
  );
};

export default Notifications;
