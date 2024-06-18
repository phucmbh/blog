import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AnimationWrapper from '../common/page-animation';
import Loader from '../components/Loader';
import { getDay } from '../common/date';
import BlogInteraction from '../components/blog/BlogInteraction';
import BlogPostCard from '../components/blog/BlogPostCard';
import DOMPurify from 'dompurify';
import CommentsContainer, {
  fetchComments,
} from '../components/comment/CommentsContainer';
import { apiGetBlog, apiSearchBlogs } from '../apis';

import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

export const blogStructure = {
  title: '',
  des: '',
  content: '',
  author: { personal_info: {} },
  banner: '',
  publishedAt: '',
};

export const BlogContext = createContext({});

const BlogPage = () => {
  let { blog_id } = useParams();

  const [blog, setBlog] = useState(blogStructure);
  const [similarBlogs, setSimilarBlogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [islikedByUser, setLikedByUser] = useState(false);
  const [commentsWrapper, setCommentsWrapper] = useState(false);
  const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0);

  useEffect(() => {
    hljs.highlightAll();
  });
  let {
    title,
    content,
    banner,
    author: {
      personal_info: { fullname, username: author_username, profile_img },
    },
    publishedAt,
  } = blog;

  const fetchBlog = async () => {
    const { blog } = await apiGetBlog({ blog_id });
    if (!blog) return setLoading(false);
    blog.comments = await fetchComments({
      blog_id: blog._id,
      setParentCommentCountFun: setTotalParentCommentsLoaded,
    });
    setBlog(blog);

    const { blogs } = await apiSearchBlogs({
      tag: blog.tags[0],
      limit: 6,
      eliminate_blog: blog_id,
    });

    setSimilarBlogs(blogs);
    setLoading(false);
  };

  useEffect(() => {
    resetStates();
    fetchBlog();
  }, [blog_id]);

  const resetStates = () => {
    setBlog(blogStructure);
    setSimilarBlogs(null);
    setLoading(true);
    setLikedByUser(false);
    setCommentsWrapper(false);
    setTotalParentCommentsLoaded(0);
  };

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : (
        <BlogContext.Provider
          value={{
            blog,
            setBlog,
            islikedByUser,
            setLikedByUser,
            commentsWrapper,
            setCommentsWrapper,
            totalParentCommentsLoaded,
            setTotalParentCommentsLoaded,
          }}
        >
          <CommentsContainer />

          <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
            <img src={banner?.url} className="aspect-video rounded-lg" />

            <div className="mt-12">
              <h1 className="text-[28px] font-medium">{title}</h1>

              <div className="flex max-sm:flex-col justify-between my-8">
                <div className="flex gap-5 items-start">
                  <img src={profile_img} className="w-12 h-12 rounded-full" />

                  <p className="capitalize">
                    {fullname}
                    <br />@
                    <Link to={`/user/${author_username}`} className="underline">
                      {author_username}
                    </Link>
                  </p>
                </div>
                <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                  Published on {getDay(publishedAt)}
                </p>
              </div>
            </div>

            <BlogInteraction />

            <div className="blog-content">
              <div
                dangerouslySetInnerHTML={{
                  __html: content,
                }}
              />
            </div>

            <BlogInteraction />

            {similarBlogs != null && similarBlogs.length ? (
              <>
                <h1 className="text-2xl mt-14 mb-10 font-medium">
                  Similar Blogs
                </h1>

                {similarBlogs.map((blog, i) => {
                  let {
                    author: { personal_info },
                  } = blog;

                  return (
                    <AnimationWrapper
                      key={i}
                      transition={{ duration: 1, delay: i * 0.08 }}
                    >
                      <BlogPostCard content={blog} author={personal_info} />
                    </AnimationWrapper>
                  );
                })}
              </>
            ) : (
              ' '
            )}
          </div>
        </BlogContext.Provider>
      )}
    </AnimationWrapper>
  );
};

export default BlogPage;
