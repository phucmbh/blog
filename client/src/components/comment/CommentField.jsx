import { useContext, useState } from 'react';
import { UserContext } from '../../App';
import toast, { Toaster } from 'react-hot-toast';
import { BlogContext } from '../../pages/BlogPage';
import { apiAddComment } from '../../apis';

const CommentField = ({
  action,
  index = undefined,
  replyingTo = undefined,
  setReplying,
}) => {
  const {
    blog,
    blog: {
      _id,
      author: { _id: blog_author },
      comments,
      comments: { results: commentsArr },
      activity,
      activity: { total_comments, total_parent_comments },
    },
    setBlog,
    setTotalParentCommentsLoaded,
  } = useContext(BlogContext);

  const {
    userAuth: { access_token, username, fullname, profile_img },
  } = useContext(UserContext);

  const [comment, setComment] = useState('');

  const handleComment = async () => {
    if (!access_token) {
      return toast.error('Sign-in first to leave a comment');
    }

    if (!comment.length) {
      return toast.error('Write something to leave a comment');
    }

    const response = await apiAddComment({
      _id,
      blog_author,
      comment,
      replying_to: replyingTo,
    });

    if (response) {
      setComment('');

      response.commented_by = {
        personal_info: { username, profile_img, fullname },
      };

      let newCommentArr;

      if (replyingTo) {
        commentsArr[index].children.push(response._id);

        response.childrenLevel = commentsArr[index].childrenLevel + 1;
        response.parentIndex = index;

        commentsArr[index].isReplyLoaded = true;

        commentsArr.splice(index + 1, 0, response);

        newCommentArr = commentsArr;

        setReplying(false);
      } else {
        response.childrenLevel = 0;

        newCommentArr = [response, ...commentsArr];
      }

      const parentCommentIncrementval = replyingTo ? 0 : 1;

      setBlog({
        ...blog,
        comments: { ...comments, results: newCommentArr },
        activity: {
          ...activity,
          total_comments: total_comments + 1,
          total_parent_comments:
            total_parent_comments + parentCommentIncrementval,
        },
      });

      setTotalParentCommentsLoaded(
        (preVal) => preVal + parentCommentIncrementval
      );
    }
  };

  return (
    <>
      <Toaster />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Leave a comment..."
        className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
      ></textarea>
      <button className="btn-dark mt-5 px-10" onClick={handleComment}>
        {action}
      </button>
    </>
  );
};

export default CommentField;
