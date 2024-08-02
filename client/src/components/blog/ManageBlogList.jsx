import AnimationWrapper from 'utils/common/page-animation';
import React from 'react';
import Loader from 'components/Loader';
import NoDataMessage from 'components/NoDataMessage';
import ManageBlogItem from './ManageBlogItem';
import { useManageBlogAction } from './store/manage.blog.store';

const ManageBlogList = ({ data = null, totalDocs, isBlog = false }) => {
  const { increasePageBlog, increasePageDraft } = useManageBlogAction();

  return (
    <>
      {data == null ? (
        <Loader />
      ) : data.length ? (
        <>
          {data?.map((blog, i) => {
            return (
              <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                <ManageBlogItem blog={{ ...blog, index: i }} isBlog={isBlog} />
              </AnimationWrapper>
            );
          })}

          {data.length < totalDocs && (
            <button
              onClick={() => {
                isBlog ? increasePageBlog() : increasePageDraft();
              }}
              className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
            >
              Load More
            </button>
          )}
        </>
      ) : (
        <NoDataMessage message="No published blogs" />
      )}
    </>
  );
};

export default ManageBlogList;
