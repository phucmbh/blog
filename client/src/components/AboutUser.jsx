import { Link } from 'react-router-dom';
import { getFullDay } from '../common/date';
import {
  FaFacebook,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa';

const AboutUser = ({ className, bio, social_links, joinedAt }) => {
  const social_icons = {
    youtube: <FaYoutube size={20} />,
    instagram: <FaInstagram size={20} />,
    facebook: <FaFacebook size={20} />,
    twitter: <FaTwitter size={20} />,
    github: <FaGithub size={20} />,
    website: <FaGlobe size={20} />,
  };

  return (
    <div className={'md:w-[90%] md:mt-7 ' + className}>
      <p className="text-xl leading-7">
        {bio.length ? bio : 'Nothing to read here'}
      </p>

      <div className="flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-dark-grey">
        {Object.keys(social_links).map((key) => {
          let link = social_links[key];
          const icon = social_icons[key];

          return link ? (
            <Link
              to={link}
              key={key}
              target="_blank"
              className="hover:text-black"
            >
              {icon}
            </Link>
          ) : (
            ' '
          );
        })}
      </div>

      <p className="text-xl leading-7 text-dark-grey">
        Joined on {getFullDay(joinedAt)}
      </p>
    </div>
  );
};

export default AboutUser;
