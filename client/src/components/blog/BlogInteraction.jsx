import icons from '../../utils/icons.util';
import { useContext, useEffect } from 'react';
import { BlogContext } from '../../pages/BlogPage';
import { Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { UserContext } from 'context/user.context';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ApiUser } from 'apis/user.api';
import { ApiBlog } from 'apis/blog.api';
const { FaHeart, FaRegCommentDots, FaRegHeart, FaTwitter } = icons;

const BlogInteraction = () => {
  let {
    blog,
    blog: {
      _id,
      title,
      blog_id,
      activity,
      activity: { total_likes, total_comments },
      author: {
        personal_info: { username: author_username },
      },
    },
    setBlog,
    islikedByUser,
    setLikedByUser,
    setCommentsWrapper,
  } = useContext(BlogContext);

  const {
    userAuth: { username },
    isAuthenticated,
  } = useContext(UserContext);

  const { data: likeData } = useQuery({
    queryKey: ['liked', _id],
    queryFn: () => ApiUser.isLikedByUser({ _id }),
    enabled: isAuthenticated,
  });

  const likeBlogMutation = useMutation({
    mutationFn: () => ApiBlog.likeBlog,
  });

  useEffect(() => {
    if (likeData) setLikedByUser(Boolean(likeData?.data.result));
  }, [likeData, setLikedByUser]);

  const handleLike = async () => {
    console.log(isAuthenticated);
    if (isAuthenticated) {
      //like the blog
      setLikedByUser((pre) => !pre);

      !islikedByUser ? total_likes++ : total_likes--;

      setBlog({ ...blog, activity: { ...activity, total_likes } });

      likeBlogMutation.mutate({ _id, islikedByUser });
    } else {
      // not logged in
      toast.error('Please signin to like this blog');
    }
  };

  return (
    <>
      <Toaster />
      <hr className="border-grey my-2" />

      <div className="flex gap-6 justify-between">
        <div className="flex gap-3 items-center">
          <button
            onClick={handleLike}
            className={
              'w-10 h-10 rounded-full flex items-center justify-center ' +
              (islikedByUser ? 'bg-red/20 text-red' : 'bg-grey/80')
            }
          >
            {islikedByUser ? <FaHeart /> : <FaRegHeart />}
          </button>
          <p className="text-xl text-dark-grey">{total_likes}</p>

          <button
            onClick={() => setCommentsWrapper((preVal) => !preVal)}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80"
          >
            <FaRegCommentDots />
          </button>
          <p className="text-xl text-dark-grey">{total_comments}</p>
        </div>

        <div className="flex gap-6 items-center">
          {username == author_username ? (
            <Link
              to={`/editor/${blog_id}`}
              className="underline hover:text-purple"
            >
              Edit
            </Link>
          ) : (
            ''
          )}

          <Link
            to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`}
          >
            <FaTwitter />
          </Link>
        </div>
      </div>

      <hr className="border-grey my-2" />
    </>
  );
};

export default BlogInteraction;
