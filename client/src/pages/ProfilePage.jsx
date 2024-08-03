import { Link, useParams } from 'react-router-dom';
import AnimationWrapper from '../utils/common/page-animation';
import Loader from '../components/Loader';
import AboutUser from '../components/user/AboutUser';
import InPageNavigation from '../components/InPageNavigation';
import BlogPostCard from '../components/blog/BlogPostCard';
import NoDataMessage from '../components/NoDataMessage';
import LoadMoreDataBtn from '../components/LoadMoreDataBtn';
import PageNotFound from './PageNotFound';
import { useQuery } from '@tanstack/react-query';
import { ApiUser } from 'apis/user.api';

const ProfilePage = () => {
  const { id: profileId } = useParams();

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['profile', profileId],
    queryFn: () => ApiUser.getProfileAndBlogByUser({ username: profileId }),
  });

  const profile = profileData?.data.profile;
  const account_info = profileData?.data.profile.account_info;
  const personal_info = profileData?.data.profile.personal_info;

  // {
  //   personal_info: { fullname, username, profile_img, bio },
  //   account_info: { total_posts, total_reads },
  //   social_links,
  //   joinedAt,
  // }

  const blogs = profileData?.data.blogs;

  return (
    <AnimationWrapper>
      {isLoading ? (
        <Loader />
      ) : personal_info.username.length && profileData ? (
        <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
          <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-grey md:sticky md:top-[100px] md:py-10">
            <img
              src={personal_info.profile_img}
              className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32"
            />

            <h1 className="text-2xl font-medium">@{personal_info.username}</h1>
            <p className="text-xl capitalize h-6">{personal_info.fullname}</p>

            <p>
              {account_info.total_posts.toLocaleString()} Blogs -{' '}
              {account_info.total_reads.toLocaleString()} Reads
            </p>

            <div className="flex gap-4 mt-2">
              {profileId == personal_info.username ? (
                <Link
                  to="/settings/edit-profile"
                  className="btn-light rounded-md"
                >
                  Edit Profile
                </Link>
              ) : (
                ' '
              )}
            </div>

            <AboutUser
              className="max-md:hidden"
              bio={personal_info.bio}
              social_links={profile.social_links}
              joinedAt={profile.joinedAt}
            />
          </div>

          <div className="max-md:mt-12 w-full">
            <InPageNavigation
              routes={['Blogs Published', 'About']}
              defaultHidden={['About']}
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
                {/* <LoadMoreDataBtn /> */}
              </>

              <AboutUser
                bio={personal_info.bio}
                social_links={profile.social_links}
                joinedAt={profile.joinedAt}
              />
            </InPageNavigation>
          </div>
        </section>
      ) : (
        <PageNotFound />
      )}
    </AnimationWrapper>
  );
};

export default ProfilePage;
