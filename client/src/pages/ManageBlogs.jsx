import { useState } from 'react';

import { Toaster } from 'react-hot-toast';

import { useSearchParams } from 'react-router-dom';
import InPageNavigation from '../components/InPageNavigation';

import { CiSearch } from 'react-icons/ci';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import BlogQueryMethods from 'apis/services/BlogService/query';
import ManageBlogList from 'components/blog/ManageBlogList';

import {
  useManageBlogAction,
  useManageBlogStore,
} from 'components/blog/store/manage.blog.store';

const ManageBlogs = () => {

  const pageBlog = useManageBlogStore((state) => state.pageBlog);
  const pageDraft = useManageBlogStore((state) => state.pageDraft);
  const search = useManageBlogStore((state) => state.search);

  const { setSearch } = useManageBlogAction();

  let activeTab = useSearchParams()[0].get('tab');

  const { data: blogs } = useQuery({
    queryKey: ['blogs', pageBlog, search],
    queryFn: () =>
      BlogQueryMethods.getBlogsByUser({
        page: pageBlog,
        search,
      }),
    placeholderData: keepPreviousData,
  });

  const { data: drafts } = useQuery({
    queryKey: ['drafts', pageDraft, search],
    queryFn: () =>
      BlogQueryMethods.getDraftsByUser({
        page: pageDraft,
        search,
      }),

    placeholderData: keepPreviousData,
  });


  const handleSearch = (e) => {
    let searchQuery = e.target.value;

    if (e.keyCode == 13 && searchQuery.length) {
      setSearch(searchQuery);
    }
  };

  return (
    <>
      <h1 className="max-md:hidden">Manage Blogs</h1>

      <Toaster />

      <div className="relative max-md:mt-5 md:mt-8 mb-10">
        <input
          type="search"
          className="w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey"
          placeholder="Search Blogs"
          onKeyDown={handleSearch}
        />

        <CiSearch className="absolute right-[10%] max-[530px]:right-[12%] max-[445px]:right-[15%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey" />
      </div>

      <InPageNavigation
        routes={['Published Blogs', 'Drafts']}
        defaultActiveIndex={activeTab != 'draft' ? 0 : 1}
      >
        {
          //published blogs
          <ManageBlogList
            isBlog={true}
            data={blogs?.blogs}
            totalDocs={blogs?.totalDocs}
          />
        }

        {
          //draft blogs
          <ManageBlogList data={drafts?.blogs} totalDocs={drafts?.totalDocs} />
        }
      </InPageNavigation>
    </>
  );
};

export default ManageBlogs;
