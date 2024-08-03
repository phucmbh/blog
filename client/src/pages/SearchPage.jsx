import { useParams } from 'react-router-dom';
import InPageNavigation from '../components/InPageNavigation';
import Loader from '../components/Loader';
import AnimationWrapper from '../utils/common/page-animation';
import BlogPostCard from '../components/blog/BlogPostCard';
import NoDataMessage from '../components/NoDataMessage';
import LoadMoreDataBtn from '../components/LoadMoreDataBtn';
import UserCard from '../components/user/UserCard';
import icons from '../utils/icons.util';
import { useQuery } from '@tanstack/react-query';
import BlogQueryMethods from 'apis/services/BlogService/query';
import UserQueryMethods from 'apis/services/UserService/query';
import { ApiBlog } from 'apis/blog.api';
import { ApiUser } from 'apis/user.api';
const { FaRegUser } = icons;

const SearchPage = () => {
  const { search } = useParams();
  const page = 1;

  const { data: blogsData, isLoading: blogsLoading } = useQuery({
    queryKey: ['search', page, search],
    queryFn: () => ApiBlog.searchBlogs({ search }),
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['users', page, search],
    queryFn: () => ApiUser.searchUsers({ search }),
  });

  const UserCardWrapper = () => {
    return (
      <>
        {usersLoading ? (
          <Loader />
        ) : usersData?.data.users.length ? (
          usersData?.data.users.map((user, i) => {
            return (
              <AnimationWrapper
                key={i}
                transition={{ duration: 1, delay: i * 0.08 }}
              >
                <UserCard user={user} />
              </AnimationWrapper>
            );
          })
        ) : (
          <NoDataMessage message="No user found" />
        )}
      </>
    );
  };

  return (
    <section className="h-cover flex justify-center gap-10">
      <div className="w-full">
        <InPageNavigation
          routes={[`Search results for "${search}"`, 'Accounts Matched']}
          defaultHidden={['Accounts Matched']}
        >
          <>
            {blogsLoading ? (
              <Loader />
            ) : blogsData?.data.blogs.length ? (
              blogsData?.data.blogs.map((blog, i) => {
                return (
                  <AnimationWrapper
                    transition={{ duration: 1, delay: i * 0.1 }}
                    key={i}
                  >
                    <BlogPostCard
                      content={blog}
                      author={blog.author.personal_info}
                    />
                  </AnimationWrapper>
                );
              })
            ) : (
              <NoDataMessage message="No blogs published" />
            )}
            {/* <LoadMoreDataBtn state={blogs} fetchDataFun={searchBlogs} /> */}
          </>

          <UserCardWrapper />
        </InPageNavigation>
      </div>

      <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
        <div className="flex gap-3 items-center">
          <FaRegUser />
          <h1 className="font-medium text-xl">User related to search</h1>
        </div>

        <UserCardWrapper />
      </div>
    </section>
  );
};

export default SearchPage;
