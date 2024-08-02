import AnimationWrapper from '../common/page-animation';
import { Toaster, toast } from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { ApiUser } from 'apis/user.api';
import { useForm } from 'react-hook-form';
import { userSchema } from 'utils/validate/user.validate';
import { MdKey } from 'react-icons/md';
import Input from 'components/Input';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from 'components/Button';
import { isAxiosError } from 'axios';
const changePasswordSchema = userSchema.pick([
  'password',
  'newPassword',
]);

const ChangePassword = () => {
  const {
    register,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
    resolver: yupResolver(changePasswordSchema),
  });

  const changePasswordMutation = useMutation({
    mutationFn: ApiUser.changePasswordUser,
    onSuccess: () => {
      toast.success('Change password success');
    },

    onError: (error) => {
      if (isAxiosError(error))
        setError('currentPassword', {
          message: error.response.data.error,
          type: 'server',
        });
    },
  });

  const onSubmit = handleSubmit((data) => {
    changePasswordMutation.mutate(data);
  });

  return (
    <AnimationWrapper>
      <Toaster />
      <form onSubmit={onSubmit}>
        <h1 className="max-md:hidden">Change Password</h1>

        <div className="py-10 w-full md:max-w-[400px]">
          <Input
            name="password"
            type="password"
            className="profile-edit-input"
            placeholder="Current Password"
            icon={<MdKey size={20} />}
            register={register}
            errorMessage={errors.password?.message}
          />
          <Input
            name="newPassword"
            type="password"
            className="profile-edit-input"
            placeholder="New Password"
            icon={<MdKey size={20} />}
            register={register}
            errorMessage={errors.newPassword?.message}
          />

          <Button isLoading={changePasswordMutation.isPending}>
            Change Password
          </Button>
        </div>
      </form>
    </AnimationWrapper>
  );
};

export default ChangePassword;
