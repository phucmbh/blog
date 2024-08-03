import * as yup from 'yup';
const passwordRegExp = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).{6,20}$/;
export const userSchema = yup.object({
  username: yup
    .string()
    .default('')
    .min(3, 'Username should be at least 3 letters long'),
  email: yup.string().default('').email('Email is invalid'),
  fullname: yup
    .string()
    .default('')
    .min(3, 'Fullname should be at least 3 letters long'),
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
  bio: yup
    .string()
    .default('')
    .max(150, 'Bio should not be more than 150 characters'),
  youtube: yup.string().default(''),
  facebook: yup.string().default(''),
  twitter: yup.string().default(''),
  github: yup.string().default(''),
  instagram: yup.string().default(''),
  website: yup.string().default(''),
});
