import React, { useState } from 'react';
import ManageBlogStats from './ManageBlogStats';
import { Link } from 'react-router-dom';
import { useDeleteBlogById } from 'apis/services/BlogService/mutation';
import { getDay } from 'common/date';
import { useQueryClient } from '@tanstack/react-query';
import { useManageBlogStore } from './store/manage.blog.store';

const ManageBlogItem = ({ blog, isBlog }) => {
  let { banner, blog_id, title, publishedAt, activity, index } = blog;
  const queryClient = useQueryClient();
  const pageBLog = useManageBlogStore((state) => state.pageBlog);
  const pageDraft = useManageBlogStore((state) => state.pageDraft);
  const search = useManageBlogStore((state) => state.search);
  let [showStat, setShowStat] = useState(false);
  index++;

  const { mutate: deleteBlogById } = useDeleteBlogById();

  const handleDeleteBlog = (blog_id) => {
    if (isBlog) {
      return deleteBlogById(
        { blog_id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(['blogs', pageBLog, search]);
          },
        }
      );
    }

    return deleteBlogById(
      { blog_id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['drafts', pageDraft, search]);
        },
      }
    );
  };

  return (
    <>
      <div className="flex gap-10 border-b mb-6 max-md:px-4 border-grey pb-6 items-center">
        <img
          src={banner?.url || 'https://placehold.co/400'}
          className="max-md:hidden lg:hidden xl:block w-28 h-28 flex-none bg-grey object-cover rounded"
        />

        <div className="flex flex-col justify-between py-2 w-full min-w-[300px]">
          <div>
            <Link
              to={`/blog/${blog_id}`}
              className="blog-title mb-4 hover:underline"
            >
              {title}
            </Link>

            <p className="line-clamp-1">Published on {getDay(publishedAt)}</p>
          </div>

          <div className="flex gap-6 mt-3">
            <Link to={`/editor/${blog_id}`} className="pr-4 py-2 underline">
              Edit
            </Link>

            <button
              className="lg:hidden pr-4 py-2 underline"
              onClick={() => setShowStat((preVal) => !preVal)}
            >
              Stats
            </button>

            <button
              className="pr-4 py-2 underline text-red"
              onClick={(e) => handleDeleteBlog(blog_id)}
            >
              Delete
            </button>
          </div>
        </div>

        <div className="max-lg:hidden">
          <ManageBlogStats stats={activity} />
        </div>
      </div>

      {showStat ? (
        <div className="lg:hidden">
          <ManageBlogStats stats={activity} />
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default ManageBlogItem;
