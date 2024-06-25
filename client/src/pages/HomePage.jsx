import AnimationWrapper from '../common/page-animation';
import InPageNavigation from '../components/InPageNavigation';
import { useState } from 'react';
import Loader from '../components/Loader';
import BlogPostCard from '../components/blog/BlogPostCard';
import MinimalBlogPost from '../components/blog/MinimalBlogPost';
import NoDataMessage from '../components/NoDataMessage';
import { IoTrendingUpOutline } from 'react-icons/io5';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import BlogQueryMethods from 'apis/services/BlogService/query';

const HomePage = () => {
  const [pageState, setPageState] = useState('home');
  const [page, setPage] = useState({ pageHome: 1, pageTag: 1 });

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

  let data;

  if (pageState === 'home') {
    const { data: homeBlogs, isLoading } = useQuery({
      queryKey: ['latest-blogs', page.pageHome],
      queryFn: () => BlogQueryMethods.getAllBlogs({ page: page.pageHome }),
      placeholderData: keepPreviousData,
    });

    if (isLoading) return <Loader />;
    data = homeBlogs;
  } else {
    const { data: tagBlogs, isLoading } = useQuery({
      queryKey: ['search', pageState, page.pageTag],
      queryFn: () =>
        BlogQueryMethods.searchBlogs({ tag: pageState, page: page.pageTag }),
      placeholderData: keepPreviousData,
    });

    if (isLoading) return <Loader />;
    data = tagBlogs;
  }

  const { blogs, totalDocs } = data;


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
                <>
                  {blogs.map((blog, i) => {
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
                  })}

                  {blogs.length < totalDocs && (
                    <button
                      onClick={() => {
                        pageState === 'home'
                          ? setPage({ ...page, pageHome: page.pageHome + 1 })
                          : setPage({ ...page, pageTag: page.pageTag + 1 });
                      }}
                      className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
                    >
                      Load More
                    </button>
                  )}
                </>
              ) : (
                <NoDataMessage message="No blogs published" />
              )}
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
