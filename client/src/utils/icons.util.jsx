import { CiSearch, CiHeart, CiLock } from 'react-icons/ci';
import { IoNotificationsOutline } from 'react-icons/io5';
import { TfiWrite } from 'react-icons/tfi';
import {
  FaBars,
  FaFacebook,
  FaGithub,
  FaGlobe,
  FaHeart,
  FaInstagram,
  FaRegCommentDots,
  FaRegHeart,
  FaRegTrashAlt,
  FaRegUser,
  FaTwitter,
  FaUser,
  FaYoutube,
} from 'react-icons/fa';
import {
  MdOutlineLightMode,
  MdOutlineDarkMode,
  MdEmail,
  MdKey,
} from 'react-icons/md';
import { RxCross1 } from 'react-icons/rx';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { LuTrash2 } from 'react-icons/lu';

export const Icon = (name) => {
  const list = {
    username: <FaRegUser size={20} />,
    fullname: <FaUser size={20} />,
    email: <MdEmail size={20} />,
    password: <MdKey size={20} />,
    youtube: <FaYoutube size={20} />,
    instagram: <FaInstagram size={20} />,
    facebook: <FaFacebook size={20} />,
    twitter: <FaTwitter size={20} />,
    github: <FaGithub size={20} />,
    website: <FaGlobe size={20} />,
  };

  return list[name];
};

const icons = {
  CiSearch,
  CiHeart,
  CiLock,
  IoNotificationsOutline,
  IoMdNotificationsOutline,
  TfiWrite,
  FaRegUser,
  MdOutlineLightMode,
  MdOutlineDarkMode,
  MdEmail,
  FaHeart,
  FaRegHeart,
  FaTwitter,
  FaRegCommentDots,
  FaBars,
  LuTrash2,
  FaRegTrashAlt,
  RxCross1,
  IoDocumentTextOutline,
};

export default icons;
