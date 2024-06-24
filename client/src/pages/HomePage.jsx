import AnimationWrapper from '../common/page-animation';
import InPageNavigation from '../components/InPageNavigation';
import { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import BlogPostCard from '../components/blog/BlogPostCard';
import MinimalBlogPost from '../components/blog/MinimalBlogPost';
import NoDataMessage from '../components/NoDataMessage';
import LoadMoreDataBtn from '../components/LoadMoreDataBtn';
import { IoTrendingUpOutline } from 'react-icons/io5';
import { useQuery } from '@tanstack/react-query';
import BlogQueryMethods from 'apis/services/BlogService/query';

const HomePage = () => {
  const [pageState, setPageState] = useState('home');

  let categories = [
    'interview',
    'react query',
    'spring',
    'spring boot',
    'entertainment',
    'food',
    'business',
    'social media',
    'travel',
  ];

  const { data: trendingBlogs } = useQuery({
    queryKey: ['trending-blogs'],
    queryFn: () => BlogQueryMethods.getTrendingBlogs(),
  });

  let blogs = [];

  if (pageState === 'home') {
    const { data, isLoading } = useQuery({
      queryKey: ['latest-blogs'],
      queryFn: () => BlogQueryMethods.getAllBlogs({ page: 1 }),
    });

    if (isLoading) return <Loader />;
    blogs = data.blogs;
  } else {
    const { data, isLoading } = useQuery({
      queryKey: ['search', pageState],
      queryFn: () => BlogQueryMethods.searchBlogs({ tag: pageState }),
    });

    if (isLoading) return <Loader />;
    blogs = data.blogs;
  }

  const loadBlogByCategory = (e) => {
    let tag = e.target.innerText.toLowerCase().substring(1);

    if (pageState == tag) {
      setPageState('home');
      return;
    }

    setPageState(tag);
  };

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* latest blogs */}
        <div className="w-full">
          <InPageNavigation
            routes={[pageState, 'trending blogs']}
            defaultHidden={['trending blogs']}
          >
            <>
              {blogs.length ? (
                blogs.map((blog, i) => {
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
              {/* <LoadMoreDataBtn
                state={blogs}
                fetchDataFun={
                  pageState == 'home' ? fetchLatestBlogs : fetchBlogsByCategory
                }
              /> */}
            </>

            {trendingBlogs == null ? (
              <Loader />
            ) : trendingBlogs.blogs.length ? (
              trendingBlogs.blogs.map((blog, i) => {
                return (
                  <AnimationWrapper
                    transition={{ duration: 1, delay: i * 0.1 }}
                    key={i}
                  >
                    <MinimalBlogPost blog={blog} index={i} />
                  </AnimationWrapper>
                );
              })
            ) : (
              <NoDataMessage message="No trending blogs" />
            )}
          </InPageNavigation>
        </div>

        {/* filters and trending blogs */}
        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-1 border-grey pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10">
            <div>
              <h1 className="font-medium text-xl mb-8">
                Stories from all interests
              </h1>

              <div className="flex gap-3 flex-wrap">
                {categories.map((category, i) => {
                  return (
                    <button
                      onClick={loadBlogByCategory}
                      className={
                        'tag ' +
                        (pageState == category ? ' bg-black text-white ' : ' ')
                      }
                      key={i}
                    >
                      #{category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 font-medium text-xl mb-8">
                <h1>Trending</h1>
                <IoTrendingUpOutline />
              </div>

              {trendingBlogs == null ? (
                <Loader />
              ) : trendingBlogs.blogs.length ? (
                trendingBlogs.blogs.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      transition={{ duration: 1, delay: i * 0.1 }}
                      key={i}
                    >
                      <MinimalBlogPost blog={blog} index={i} />
                    </AnimationWrapper>
                  );
                })
              ) : (
                <NoDataMessage message="No trending blogs" />
              )}
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default HomePage;
