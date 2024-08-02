import { useContext, useState } from 'react';
import { UserContext } from '../App';
import Loader from '../components/Loader';
import AnimationWrapper from '../common/page-animation';
import NoDataMessage from '../components/NoDataMessage';
import NotificationCard from '../components/notification/NotificationCard';
import LoadMoreDataBtn from '../components/LoadMoreDataBtn';
import { apiNotification } from '../apis';
import { useQuery } from '@tanstack/react-query';

const Notifications = () => {
  const {
    userAuth,
    userAuth: { new_notification_available },
    setUserAuth,
  } = useContext(UserContext);

  const page = 1;

  const [filter, setFilter] = useState('all');

  const filters = ['all', 'like', 'comment', 'reply'];

  const { data, isLoading, error } = useQuery({
    queryKey: ['notifications', filter, page],
    queryFn: () => apiNotification({ filter, page }),
  });

  if (isLoading) return <Loader />;
  if (error) return 'An error has occurred: ' + error.message;

  const { notifications } = data;

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

      {notifications == null ? (
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
                    notificationState={{ notifications, setNotifications }}
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
