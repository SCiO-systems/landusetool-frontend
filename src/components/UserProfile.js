import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/primereact.min.css';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getUserProfile,
  updateUserAvatar,
  updateUserProfile,
} from '../services/users';
import { ToastContext, UserContext } from '../store';
import { handleError } from '../utilities/errors';

const UserProfile = ({
  userId,
  identityProvider,
}) => {
  const { t } = useTranslation();
  const userAvatar = useRef(null);
  const { setUser } = useContext(UserContext);
  const { setError, setSuccess } = useContext(ToastContext);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [userAvatarUrl, setUserAvatarUrl] = useState(null);

  const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const { data } = await updateUserAvatar(userId, formData);
      setUserAvatarUrl(data.avatar_url);
      setUser({ avatar_url: data.avatar_url });
      setSuccess('Avatar', 'Your avatar has been updated.');
    } catch (error) {
      setError(setError(handleError(error)));
    }
  };

  const fetchProfile = async () => {
    try {
      const { data } = await getUserProfile(userId);
      if (data) {
        setFirstname(data.firstname);
        setLastname(data.lastname);
        setEmail(data.email);
        setUserAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      setError(handleError(error));
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile(userId, { firstname, lastname });
      setSuccess('Profile', 'Your profile has been updated!');
    } catch (error) {
      setError(handleError(error));
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="p-grid">
      <div className="p-col-12 p-md-8">
        <div className="card p-fluid p-shadow-4 rounded">
          <h5>{t('USER_PROFILE_TITLE')}</h5>
          <form onSubmit={updateProfile}>
            <div className="p-formgrid p-grid">
              <div className="p-field p-col-12 p-md-6">
                <label htmlFor="firstname">{t('FIRSTNAME')}</label>
                <InputText
                  id="firstname"
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                />
              </div>
              <div className="p-field p-col-12 p-md-6">
                <label htmlFor="lastname">{t('LASTNAME')}</label>
                <InputText
                  id="lastname"
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                />
              </div>
              {identityProvider === 'local' && (
                <div className="p-field p-col-12 p-md-6">
                  <label htmlFor="email">{t('EMAIL')}</label>
                  <InputText
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>
            <div className="p-grid p-formgrid">
              <div className="p-field p-col-12 p-md-6">
                <Button
                  label={t('SAVE_CHANGES')}
                  type="submit"
                  onClick={updateProfile}
                  icon="pi pi-save"
                  className="p-button-primary p-mr-2 p-mt-2"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="p-col-12 p-md-4">
        <div className="card p-fluid p-shadow-4 rounded">
          <h5 className="p-text-center">{t('PROFILE_PICTURE_TITLE')}</h5>
          <div className="p-formgrid p-grid">
            <div className="p-field p-col-12 p-text-center">
              {userAvatarUrl ? (
                <img
                  src={userAvatarUrl}
                  height="130px"
                  className="rounded-full"
                  alt="Avatar"
                />
              ) : (
                <img
                  src="/assets/img/user-default.png"
                  style={{ height: '130px' }}
                  alt="Default Avatar"
                />
              )}
            </div>
            <div className="p-field p-col-12">
              <input
                className="hidden"
                type="file"
                multiple={false}
                ref={userAvatar}
                onChange={(e) => uploadAvatar(e.target.files[0])}
              />
              <Button
                label={t('CHANGE_PICTURE')}
                icon="pi pi-image"
                className="p-button-secondary p-mr-2 p-mb-2"
                onClick={(e) => {
                  userAvatar.current.click();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
