import React, { createContext } from 'react';
import axiosInstance from '../utilities/api-client';
import { useLocalStorage } from '../utilities/hooks';

const initialState = {
  access_token: null,
  isLoggedIn: false,
  id: null,
  firstname: null,
  lastname: null,
  email: null,
  role: null,
  avatar_url: null,
  currentProject: null,
  availableProjects: [],
  countryLevelLinks: null,
  language: {
    icon: 'US',
    label: 'English',
    code: 'en',
  },
};

export const UserContext = createContext(initialState);

export const UserProvider = ({ children }) => {
  // md5sum: scio-lup4ldn-v1.2.1
  const localStorageKey = 'user-5afff809592f72098f489cbfc6540ffe';
  const [userData, setUserData] = useLocalStorage(
    localStorageKey,
    initialState
  );

  if (userData.access_token !== null) {
    axiosInstance.setup(() => {
      setUserData({ ...initialState });
    }, userData.access_token);
  }

  return (
    <UserContext.Provider
      value={{
        ...userData,
        setUser: (user) => {
          if (user.access_token) {
            axiosInstance.setup(() => {
              setUserData({ ...initialState });
            }, user.access_token);
          }
          setUserData({ ...userData, ...user });
        },
        resetData: () => {
          axiosInstance.resetInterceptors();
          setUserData({ ...initialState });
        },
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
