import { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { profileDataStructure } from './ProfilePage';
import AnimationWrapper from '../utils/common/page-animation';
import Loader from '../components/Loader';
import { Toaster, toast } from 'react-hot-toast';
import InputBox from '../components/InputBox';
import { uploadImage } from '../utils/common/aws';
import { apiGetProfile, apiUpdateProfile } from '../apis';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ApiUser } from 'apis/user.api';
import Button from 'components/Button';
import { useForm } from 'react-hook-form';
import { userSchema } from 'utils/validate/user.validate';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from 'components/Input';
import { LocalStorage } from 'utils/common/localStorage';
import { UserContext } from 'context/user.context';
const profileSchema = userSchema.omit(['password', 'newPassword']);

const EditProfile = () => {
  const {
    userAuth,
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['profile', userAuth.username],
    queryFn: () => ApiUser.getProfile({ username: userAuth.username }),
    enabled: Boolean(userAuth.username),
  });

  console.log({ token: userAuth.username });

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
    resolver: yupResolver(profileSchema),
  });

  const bioLimit = 150;

  const profileImgEle = useRef();
  const editProfileForm = useRef();

  // const [profile, setProfile] = useState(profileDataStructure);
  const [charactersLeft, setCharactersLeft] = useState(bioLimit);
  const [updatedProfileImg, setUpdatedProfileImg] = useState(null);

  // const {
  //   personal_info: {
  //     fullname,
  //     username: profile_username,
  //     profile_img,
  //     email,
  //     bio,
  //   },
  //   social_links,
  // } = profileData;

  console.log(profileData);
  // useEffect(() => {
  //   if (profileData) {
  //     setValue('fullname', fullname);
  //     setValue('email', email);
  //     setValue('usename', profile_username);
  //     setValue('bio', bio);
  //   }
  // }, [profileData, setValue]);

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

  // const handleOnSubmit = async (e) => {
  //   e.preventDefault();

  //   let form = new FormData(editProfileForm.current);
  //   let formData = {};

  //   for (let [key, value] of form.entries()) {
  //     formData[key] = value;
  //   }

  //   let {
  //     username,
  //     bio,
  //     youtube,
  //     facebook,
  //     twitter,
  //     github,
  //     instagram,
  //     website,
  //   } = formData;

  //   if (username.length < 3) {
  //     return toast.error('Username should be at least 3 letters long');
  //   }
  //   if (bio.length > bioLimit) {
  //     return toast.error(`Bio  should not be more than ${bioLimit} characters`);
  //   }

  //   let loadingToast = toast.loading('Updating...');
  //   e.target.setAttribute('disabled', true);

  //   const response = await apiUpdateProfile(formData);

  //   if (!response.success) {
  //     toast.dismiss(loadingToast);
  //     e.target.removeAttribute('disabled');
  //     return toast.error(response.error);
  //   }

  //   if (userAuth.username != response.username) {
  //     let newUserAuth = { ...userAuth, username: response.username };
        // LocalStorage.setUser(JSON.stringify(newUserAuth));


  //     setUserAuth(newUserAuth);
  //   }

  //   toast.dismiss(loadingToast);
  //   e.target.removeAttribute('disabled');
  //   toast.success('Profile Updated');
  // };

  return (
    <AnimationWrapper>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {profileData && (
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
                    <img ref={profileImgEle} src={''} />
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
                      />
                    </div>
                    <div>
                      <Input name="email" placeholder="Email" disabled={true} />
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
                    maxLength={bioLimit}
                    className="input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5"
                    placeholder="Bio"
                    {...register}
                  ></textarea>

                  <p className="mt-1 text-dark-grey">
                    {charactersLeft} characters left
                  </p>

                  <p className="my-6 text-dark-grey">
                    Add your social handles below
                  </p>

                  <div className="md:grid md:grid-cols-2 gap-x-6">
                    {/* {Object.keys(social_links).map((key, i) => {
                  // let link = social_links[key];

                  return (
                    <Input
                      key={i}
                      name={key}
                      type="text"
                      placeholder="https://"
                    />
                  );
                })} */}
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

export default EditProfile;
