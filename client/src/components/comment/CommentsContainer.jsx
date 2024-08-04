import { useContext } from 'react';
import { BlogContext } from '../../pages/BlogPage';
import CommentField from './CommentField';
import AnimationWrapper from '../../utils/common/page-animation';
import CommentCard from './CommentCard';
import NoDataMessage from '../NoDataMessage';
import icons from '../../utils/icons.util';
import { ApiComment } from 'apis/comment.api';

const { RxCross1 } = icons;

export const fetchComments = async ({
  skip = 0,
  blog_id,
  setParentCommentCountFun,
  comment_array = null,
}) => {
  let res;

  console.log({blog_id, skip})

  const response = await ApiComment.getBlogComments({
    blog_id: blog_id,
    skip: skip,
  });

  console.log(response);

  const comments = response.data;

  comments.map((comment) => {
    comment.childrenLevel = 0;
  });

  setParentCommentCountFun((preVal) => preVal + comments.length);

  if (comment_array == null) {
    res = { results: comments };
  } else {
    res = { results: [...comment_array, ...comments] };
  }

  return res;
};

const CommentsContainer = () => {
  const {
    blog,
    blog: {
      _id,
      title,
      comments: { results: commentsArr },
      activity: { total_parent_comments },
    },
    commentsWrapper,
    setCommentsWrapper,
    totalParentCommentsLoaded,
    setTotalParentCommentsLoaded,
    setBlog,
  } = useContext(BlogContext);

  console.log(blog);

  const loadMoreComments = async () => {
    let newCommentsArr = await fetchComments({
      skip: totalParentCommentsLoaded,
      blog_id: _id,
      setParentCommentCountFun: setTotalParentCommentsLoaded,
      comment_array: commentsArr,
    });

    setBlog({ ...blog, comments: newCommentsArr });
  };

  return (
    <div
      className={
        'max-sm:w-full fixed ' +
        (commentsWrapper ? 'top-0 sm:right-0' : 'top-[100%] sm:right-[-100%]') +
        ' duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden'
      }
    >
      <div className="relative">
        <h1 className="text-xl font-medium">Comments</h1>
        <p className="text-lg mt-2 w-[70%] text-dark-grey line-clamp-1">
          {title}
        </p>

        <button
          onClick={() => setCommentsWrapper((preVal) => !preVal)}
          className="absolute top-0 right-0 flex justify-center items-center w-12 h-12 rounded-full bg-grey"
        >
          <RxCross1 />
        </button>
      </div>

      <hr className="border-grey my-8 w-[120%] -ml-10" />

      <CommentField action="comment" />

      {commentsArr && commentsArr.length ? (
        commentsArr.map((comment, i) => {
          return (
            <AnimationWrapper key={i}>
              <CommentCard
                index={i}
                leftVal={comment.childrenLevel * 4}
                commentData={comment}
              />
            </AnimationWrapper>
          );
        })
      ) : (
        <NoDataMessage message="No Comments" />
      )}

      {total_parent_comments > totalParentCommentsLoaded ? (
        <button
          onClick={loadMoreComments}
          className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
        >
          Load More
        </button>
      ) : (
        ''
      )}
    </div>
  );
};

export default CommentsContainer;
