import * as yup from 'yup';
const passwordRegExp = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).{6,20}$/;
export const userSchema = yup.object({
  username: yup.string().min(3, 'Username should be at least 3 letters long'),
  email: yup.string().email('Email is invalid'),
  fullname: yup.string().min(3, 'Fullname should be at least 3 letters long'),
  password: yup
    .string()
    .required('Please enter password.')
    .matches(
      passwordRegExp,
      'Password should be 6 to 20 characters long with 1 numeric, 1 lowercase and 1 uppercase letters.'
    ),
  newPassword: yup
    .string()
    .required('Please enter new password.')
    .matches(
      passwordRegExp,
      'Password should be 6 to 20 characters long with 1 numeric, 1 lowercase and 1 uppercase letters.'
    ),
  bio: yup.string().min(150, 'Bio  should not be more than 150 characters'),
  youtube: yup.string(),
  facebook: yup.string(),
  twitter: yup.string(),
  github: yup.string(),
  instagram: yup.string(),
  website: yup.string(),
});
