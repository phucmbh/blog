import { createContext, useState } from 'react';
import { LocalStorage } from 'utils/common/localStorage';

const initialUserContext = {
  userAuth: LocalStorage.getUser(),
  setUserAuth: () => null,
  isAuthenticated: Boolean(LocalStorage.getAccessToken()),
  setIsAuthenticated: () => null,
  reset: () => null,
};

export const UserContext = createContext(initialUserContext);

export const UserProvider = ({ children }) => {
  const [userAuth, setUserAuth] = useState(initialUserContext.userAuth);
  const [isAuthenticated, setIsAuthenticated] = useState(
    initialUserContext.isAuthenticated
  );

  const reset = () => {
    setIsAuthenticated(false);
    setUserAuth(null);
  };

  return (
    <UserContext.Provider
      value={{
        userAuth,
        setUserAuth,
        isAuthenticated,
        setIsAuthenticated,
        reset,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
