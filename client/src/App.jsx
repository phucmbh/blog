import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';

import UserAuthForm from './pages/UserAuthPage';
import { createContext, useContext, useEffect, useState } from 'react';
import Editor from './pages/EditorPage';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import PageNotFound from './pages/PageNotFound';
import ProfilePage from './pages/ProfilePage';
import BlogPage from './pages/BlogPage';
import SideNav from './components/SideNav';
import ChangePassword from './pages/ChangePassword';
import EditProfile from './pages/EditProfile';
import Notifications from './pages/Notifications';
import ManageBlogs from './pages/ManageBlogs';
import { LocalStorage } from 'utils/common/localStorage';
import { ThemeContext, ThemeProvider } from 'context/theme.context';
import { UserContext, UserProvider } from 'context/user.context';

const App = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <Routes>
          <Route path="/editor" element={<Editor />} />
          <Route path="/editor/:blog_id" element={<Editor />} />
          <Route path="/" element={<Navbar />}>
            <Route index element={<HomePage />} />
            <Route path="dashboard" element={<SideNav />}>
              <Route path="blogs" element={<ManageBlogs />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>
            <Route path="settings" element={<SideNav />}>
              <Route path="edit-profile" element={<EditProfile />} />
              <Route path="change-password" element={<ChangePassword />} />
            </Route>
            <Route path="signin" element={<UserAuthForm type="sign-in" />} />
            <Route path="signup" element={<UserAuthForm type="sign-up" />} />
            <Route path="search/:search" element={<SearchPage />} />
            <Route path="user/:id" element={<ProfilePage />} />
            <Route path="blog/:blog_id" element={<BlogPage />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
