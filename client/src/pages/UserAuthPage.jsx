import { useContext } from 'react';
import AnimationWrapper from '../utils/common/page-animation';
import googleIcon from '../assets/images/google.png';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { authWithGoogle } from '../utils/common/firebase';
import { useMutation } from '@tanstack/react-query';
import { ApiUser } from 'apis/user.api';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { userSchema } from 'utils/validate/user.validate';
import Input from 'components/Input';
import { MdEmail, MdKey } from 'react-icons/md';
import { FaUser } from 'react-icons/fa';
import { UserContext } from 'context/user.context';
import { PATH } from 'utils/constants/path.constant';

const UserAuthPage = ({ type }) => {
  const navigate = useNavigate();
  const { setUserAuth, setIsAuthenticated, isAuthenticated } =
    useContext(UserContext);
  const userAuthSchema =
    type == 'sign-in'
      ? userSchema.pick(['email', 'password'])
      : userSchema.pick(['email', 'password', 'fullname']);

  const signInMutation = useMutation({
    mutationFn: ApiUser.signIn,
    onSuccess: (data) => {
      setIsAuthenticated(true);
      setUserAuth(data.data);
      return navigate(PATH.HOME);
    },
  });
  const signUpMutation = useMutation({
    mutationFn: ApiUser.signUpMutation,
    onSuccess: (data) => {
      setIsAuthenticated(true);
      setUserAuth(data.data);
      return navigate(PATH.HOME);
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ resolver: yupResolver(userAuthSchema) });

  const onsubmit = handleSubmit((data) => {
    if (type === 'sign-in') {
      signInMutation.mutate(data);
    }
    signUpMutation.mutate(data);
  });

  const handleGoogleAuth = (e) => {
    e.preventDefault();
    authWithGoogle()
      .then((user) => {
        let serverRoute = '/google-auth';
        let formData = {
          access_token: user.accessToken,
        };

        // userAuthThroughServer(serverRoute, formData);
      })
      .catch((err) => {
        toast.error('trouble login through google');
        return console.log(err);
      });
  };

  return isAuthenticated ? (
    <Navigate to="/" />
  ) : (
    <AnimationWrapper keyValue={type}>
      <section className="h-cover flex items-center justify-center">
        <Toaster />
        <form onSubmit={onsubmit} className="w-[80%] max-w-[400px]">
          <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
            {type == 'sign-in' ? 'Welcome Back' : 'Join us today'}
          </h1>

          {type != 'sign-in' ? (
            <Input
              name="fullname"
              placeholder="Full Name"
              icon={<FaUser size={20} />}
              register={register}
              errorMessage={errors.fullname?.message}
            />
          ) : (
            ''
          )}

          <Input
            name="email"
            placeholder="Email"
            icon={<MdEmail size={20} />}
            register={register}
            errorMessage={errors.email?.message}
          />

          <Input
            name="password"
            type="password"
            placeholder="Password"
            icon={<MdKey size={20} />}
            register={register}
            errorMessage={errors.password?.message}
          />

          <button className="btn-dark center mt-14" type="submit">
            {type === 'sign-in' ? 'Sign In' : 'Sign Up'}
          </button>

          <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>

          <button
            className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
            onClick={handleGoogleAuth}
          >
            <img src={googleIcon} className="w-5" />
            Continue with Google
          </button>

          {type == 'sign-in' ? (
            <p className="mt-6 text-dark-grey text-xl text-center">
              {"Don't have an account?"}
              <Link to="/signup" className="underline text-black text-xl ml-1">
                Join us today
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Already a Member?
              <Link to="/signin" className="underline text-black text-xl ml-1">
                Sign in here
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthPage;
