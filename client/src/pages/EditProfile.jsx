import { useContext, useEffect, useRef, useState } from 'react';
import AnimationWrapper from '../utils/common/page-animation';
import Loader from '../components/Loader';
import { Toaster, toast } from 'react-hot-toast';
import { uploadImage } from '../utils/common/aws';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ApiUser } from 'apis/user.api';
import Button from 'components/Button';
import { useForm } from 'react-hook-form';
import { userSchema } from 'utils/validate/user.validate';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from 'components/Input';
import { UserContext } from 'context/user.context';
import icons from 'utils/icons.util';
const profileSchema = userSchema.omit(['password', 'newPassword']);

const { FaYoutube, FaInstagram, FaFacebook, FaTwitter, FaGithub, FaGlobe } =
  icons;

const EditProfile = () => {
  const { userAuth, setUserAuth, isAuthenticated } = useContext(UserContext);

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['profile', userAuth.username],
    queryFn: () => ApiUser.getProfile({ username: userAuth.username }),
    enabled: isAuthenticated,
  });

  const updateProfileMutation = useMutation({
    mutationFn: ApiUser.updateProfile,
  });
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      bio: '',
      email: '',
      facebook: '',
      fullname: '',
      github: '',
      instagram: '',
      twitter: '',
      username: '',
      website: '',
      youtube: '',
    },
    resolver: yupResolver(profileSchema),
  });

  const bioLimit = 150;

  const profileImgEle = useRef();

  const [charactersLeft, setCharactersLeft] = useState(bioLimit);
  const [updatedProfileImg, setUpdatedProfileImg] = useState(null);

  const profile = profileData?.data;

  useEffect(() => {
    if (profile) {
      console.log(profile);
      const { fullname, username, email, bio } = profile.personal_info;
      const { facebook, github, website, instagram, twitter, youtube } =
        profile.social_links;

      setValue('fullname', fullname);
      setValue('email', email);
      setValue('bio', bio);
      setValue('username', username);
      setValue('facebook', facebook);
      setValue('github', github);
      setValue('website', website);
      setValue('instagram', instagram);
      setValue('twitter', twitter);
      setValue('youtube', youtube);
    }
  }, [profile]);

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  const handleCharacterChange = (e) => {
    setCharactersLeft(bioLimit - e.target.value.length);
  };

  const handleImagePreview = (e) => {
    let img = e.target.files[0];

    profileImgEle.current.src = URL.createObjectURL(img);

    setUpdatedProfileImg(img);
  };

  // const handleImageUpload = (e) => {
  //   e.preventDefault();

  //   if (updatedProfileImg) {
  //     let loadingToast = toast.loading('Uploading...');
  //     e.target.setAttribute('disabled', true);

  //     uploadImage(updatedProfileImg)
  //       .then((url) => {
  //         if (url) {
  //           axios
  //             .post(
  //               import.meta.env.VITE_SERVER_DOMAIN + '/update-profile-img',
  //               { url },
  //               {
  //                 headers: {
  //                   Authorization: `Bearer ${access_token}`,
  //                 },
  //               }
  //             )
  //             .then(({ data }) => {
  //               let newUserAuth = {
  //                 ...userAuth,
  //                 profile_img: data.profile_img,
  //               };

  // LocalStorage.setUser(JSON.stringify(newUserAuth));

  //               setUserAuth(newUserAuth);

  //               setUpdatedProfileImg(null);

  //               toast.dismiss(loadingToast);
  //               e.target.removeAttribute('disabled');
  //               toast.success('Uploaded');
  //             })
  //             .catch(({ response }) => {
  //               toast.dismiss(loadingToast);
  //               e.target.removeAttribute('disabled');
  //               toast.error(response.data.error);
  //             });
  //         }
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // };

  return (
    <AnimationWrapper>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {profile && (
            <form onSubmit={onSubmit}>
              <Toaster />

              <h1 className="max-md:hidden">Edit Profile</h1>

              <div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10">
                <div className="max-lg:center mb-5">
                  <label
                    htmlFor="uploadImg"
                    id="profileImgLable"
                    className="relative block w-48 h-48 bg-grey rounded-full overflow-hidden"
                  >
                    <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/30 opacity-0 hover:opacity-100 cursor-pointer">
                      Upload Image
                    </div>
                    <img
                      ref={profileImgEle}
                      src={profile?.personal_info.profile_img}
                    />
                  </label>

                  <input
                    type="file"
                    id="uploadImg"
                    accept=".jpeg, .png, .jpg"
                    hidden
                    onChange={handleImagePreview}
                  />

                  <Button
                    className="btn-light mt-5 max-lg:center lg:w-full px-10"
                    onClick={() => null}
                  >
                    Upload
                  </Button>
                </div>

                <div className="w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                    <div>
                      <Input
                        name="fullname"
                        placeholder="Full Name"
                        disabled={true}
                        register={register}
                      />
                    </div>
                    <div>
                      <Input
                        name="email"
                        placeholder="Email"
                        disabled={true}
                        register={register}
                      />
                    </div>
                  </div>

                  <Input
                    name="username"
                    placeholder="Username"
                    register={register}
                    errorMessage={errors.username?.message}
                  />

                  <p className="text-dark-grey -mt-3">
                    Username will use to search user and will be visible to all
                    users
                  </p>

                  <textarea
                    name="bio"
                    className="input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5"
                    placeholder="Bio"
                    {...register('bio')}
                  ></textarea>

                  <p className="mt-1 text-dark-grey">
                    {charactersLeft} characters left
                  </p>

                  <p className="my-6 text-dark-grey">
                    Add your social handles below
                  </p>

                  <div className="md:grid md:grid-cols-2 gap-x-6">
                    {Object.keys(profile.social_links).map((key, i) => {
                      // let link = social_links[key];

                      return (
                        <Input
                          key={i}
                          name={key}
                          icon={social_icons[key]}
                          placeholder="https://"
                          register={register}
                        />
                      );
                    })}
                  </div>

                  <Button
                    type="submit"
                    isLoading={updateProfileMutation.isPending}
                  >
                    Update
                  </Button>
                </div>
              </div>
            </form>
          )}
        </>
      )}
    </AnimationWrapper>
  );
};

const social_icons = {
  youtube: <FaYoutube size={20} />,
  instagram: <FaInstagram size={20} />,
  facebook: <FaFacebook size={20} />,
  twitter: <FaTwitter size={20} />,
  github: <FaGithub size={20} />,
  website: <FaGlobe size={20} />,
};

export default EditProfile;
