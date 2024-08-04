import { useContext, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { UserContext } from 'context/user.context';
import { useMutation } from '@tanstack/react-query';
import { ApiComment } from 'apis/comment.api';

const NotificationCommentField = ({
  _id,
  blog_author,
  index = undefined,
  replyingTo = undefined,
  setReplying,
  notification_id,
  notificationData,
}) => {
  const [comment, setComment] = useState('');

  const { _id: user_id } = blog_author;
  const {
    userAuth: { access_token },
  } = useContext(UserContext);
  const {
    notifications,
    notifications: { results },
    setNotifications,
  } = notificationData;

  const addCommentMutation = useMutation({ mutationFn: ApiComment.addComment });

  const handleComment = async () => {
    if (!comment.length) {
      return toast.error('Write something to leave a comment');
    }

    const response = await addCommentMutation.mutateAsync({
      _id,
      blog_author: user_id,
      comment,
      replying_to: replyingTo,
      notification_id,
    });

    const newComment = response.data;

    setReplying(false);

    results[index].reply = { comment, _id: newComment._id };
    setNotifications({ ...notifications, results });
  };

  return (
    <>
      <Toaster />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Leave a reply..."
        className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
      ></textarea>
      <button className="btn-dark mt-5 px-10" onClick={handleComment}>
        Reply
      </button>
    </>
  );
};

export default NotificationCommentField;
