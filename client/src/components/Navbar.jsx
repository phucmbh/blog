import { Link, Outlet, useNavigate } from 'react-router-dom';
import darkLogo from '../assets/images/logo-dark.png';
import lightLogo from '../assets/images/logo-light.png';
import darkLogoMobile from '../assets/images/logo-dark-mobile.png';
import lightLogoMobile from '../assets/images/logo-light-mobile.png';
import { useContext, useState } from 'react';
import UserNavigationPanel from './user/UserNavigationPanel';
import icons from '../utils/icons.util';
import { LocalStorage } from 'utils/common/localStorage';
import { ThemeContext } from 'context/theme.context';
import { UserContext } from 'context/user.context';
import { useQuery } from '@tanstack/react-query';
import { ApiNotification } from 'apis/notification.api';
const {
  CiSearch,
  MdNotificationsNone,
  MdOutlineLightMode,
  MdOutlineDarkMode,
  MdMode,
} = icons;
const Navbar = () => {
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
  const [userNavPanel, setUserNavPanel] = useState(false);

  const { theme, setTheme } = useContext(ThemeContext);

  const navigate = useNavigate();


  const { userAuth, setUserAuth, isAuthenticated } = useContext(UserContext);

  const { data: notificationData } = useQuery({
    queryKey: ['notifications', 'new'],
    queryFn: ApiNotification.newNotification,
  });

  // useEffect(() => {
  //   if (access_token) {
  //     const fetchNewNotification = async () => {
  //       const response = await apiNewNotification();
  //       setUserAuth({ ...userAuth, ...response });
  //     };

  //     fetchNewNotification();
  //   }
  // }, [access_token]);

  const handleUserNavPanel = () => {
    setUserNavPanel((currentVal) => !currentVal);
  };

  const handleSearch = (e) => {
    let query = e.target.value;

    if (e.keyCode == 13 && query.length) {
      navigate(`/search/${query}`);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setUserNavPanel(false);
    }, 200);
  };

  const changeTheme = () => {
    let newTheme = theme == 'light' ? 'dark' : 'light';

    setTheme(newTheme);

    document.body.setAttribute('data-theme', newTheme);

    LocalStorage.setTheme(newTheme);
  };

  return (
    <>
      <nav className="navbar z-50">
        <Link to="/" className="flex-none h-8 max-md:hidden">
          <img
            src={theme == 'light' ? darkLogo : lightLogo}
            className="w-full h-full mt-1"
          />
        </Link>
        <Link to="/" className="flex-none h-8 md:hidden">
          <img
            src={theme == 'light' ? darkLogoMobile : lightLogoMobile}
            className="w-full h-full mt-1"
          />
        </Link>

        <div
          className={
            'flex flex-row absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show ' +
            (searchBoxVisibility ? 'show' : 'hide')
          }
        >
          <input
            type="text"
            placeholder="Search"
            className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
            onKeyDown={handleSearch}
          />

          <CiSearch
            className="absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"
            size={20}
          />
        </div>

        <div className="flex items-center gap-3 md:gap-6 ml-auto">
          <button
            className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center"
            onClick={() => setSearchBoxVisibility((currentVal) => !currentVal)}
          >
            <CiSearch />
          </button>

          <Link
            to="/editor"
            className="hidden md:flex  gap-2 px-3 py-2 rounded text-gray-200 bg-gray-500 hover:bg-gray-700"
          >
            <MdMode size={20} />
            <p>Write</p>
          </Link>

          <button
            className="flex justify-center items-center text-2xl w-12 h-12 rounded-full bg-grey hover:bg-black/10"
            onClick={changeTheme}
          >
            {theme == 'light' ? (
              <MdOutlineLightMode size={20} />
            ) : (
              <MdOutlineDarkMode size={20} />
            )}
          </button>

          {isAuthenticated && userAuth ? (
            <>
              <Link to="/dashboard/notifications">
                <button className="flex justify-center items-center w-12 h-12 rounded-full bg-grey  hover:bg-black/10">
                  <MdNotificationsNone size={20} />

                  {userAuth.new_notification_available ? (
                    <span className="bg-red w-3 h-3 rounded-full absolute z-10 top-2 right-2"></span>
                  ) : (
                    ''
                  )}
                </button>
              </Link>

              <div
                className="relative"
                onClick={handleUserNavPanel}
                onBlur={handleBlur}
              >
                <button className="w-12 h-12 mt-1">
                  <img
                    src={userAuth.profile_img}
                    className="w-full h-full object-cover rounded-full"
                  />
                </button>

                {userNavPanel ? <UserNavigationPanel /> : ''}
              </div>
            </>
          ) : (
            <>
              <Link className="btn-dark py-2" to="/signin">
                Sign In
              </Link>
              <Link className="btn-light py-2 hidden md:block" to="/signup">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;
