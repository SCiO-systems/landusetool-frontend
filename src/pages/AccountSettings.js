import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import React, { useContext, useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import UserPassword from '../components/UserPassword';
import UserProfile from '../components/UserProfile';
import { getUserProfile } from '../services/users';
import { UserContext } from '../store';

const AccountSettings = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { id } = useContext(UserContext);
  const [identityProvider, setIdentityProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const getIdentityProvider = async () => {
    setIsLoading(true);
    const { data } = await getUserProfile(id);
    setIdentityProvider(data.identity_provider);
    setIsLoading(false);
  };

  useEffect(() => {
    getIdentityProvider();
  }, []); // eslint-disable-line

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="account-settings-page">
        <div className="layout-content">
          {/* User profile */}
          <UserProfile
            identityProvider={identityProvider}
            userId={id}
            dialogOpen={dialogOpen}
            setDialogOpen={setDialogOpen}
          />
          {/* UI Preferences */}
          {/* <UserInterfacePreferences /> */}
          {identityProvider === 'scribe' && <UserPassword userId={id} />}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AccountSettings;
