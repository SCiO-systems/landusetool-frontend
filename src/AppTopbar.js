import { Button } from 'primereact/button';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import AppBreadcrumb from './AppBreadcrumb';
import MiniLogo from './assets/img/LUP4LDN-LOGO_small.png';
import { getInvites, updateInvite } from './services/users';
import { UserContext, ToastContext } from './store';
import { handleError } from './utilities/errors';

const AppTopbar = ({ onMenuButtonClick, routers, displayName, signOut }) => {
  const { t, i18n } = useTranslation();
  const [notificationMenuVisible, setNotificationMenuVisible] = useState(false);
  const [languageMenuVisible, setLanguageMenuVisible] = useState(false);
  const [invitations, setInvitations] = useState([]);
  const [loadingInvitation, setLoadingInvitation] = useState(0);
  const { setError } = useContext(ToastContext);
  const { avatar_url: avatarUrl, language, setUser } = useContext(UserContext);

  const acceptInvite = async (invitationId) => {
    setLoadingInvitation(invitationId);
    try {
      await updateInvite(invitationId, { status: 'accepted' });
    } catch (e) {
      setError(handleError(e));
    } finally {
      fetchInvites();
    }
  };

  const rejectInvite = async (invitationId) => {
    setLoadingInvitation(invitationId);
    try {
      await updateInvite(invitationId, { status: 'rejected' });
    } catch (e) {
      setError(handleError(e));
    } finally {
      fetchInvites();
    }
  };

  const changeLanguageTo = (newLang) => {
    // Update our local storage first
    setUser({
      language: { ...newLang },
    });
    // Change the language then
    i18n.changeLanguage(newLang.code);
    // hide the menu
    setLanguageMenuVisible(false);
  };

  const fetchInvites = async () => {
    try {
      const { data } = await getInvites();
      setInvitations(data);
      if (data.length === 0) {
        setNotificationMenuVisible(false);
      }
    } catch (e) {
      /* sh! fail silently */
    }
  };

  useEffect(() => {
    fetchInvites();
    const interval = setInterval(() => {
      fetchInvites();
    }, process.env.REACT_APP_INVITATION_POLLING_FREQUENCY * 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="layout-topbar">
      <div className="topbar-left">
        <button type="button" className="menu-button p-link" onClick={onMenuButtonClick}>
          <i className="pi pi-chevron-left" />
        </button>
        <span className="topbar-separator" />

        <div className="layout-breadcrumb viewname" style={{ textTransform: 'uppercase' }}>
          <AppBreadcrumb routers={routers} />
        </div>

        <img id="logo-mobile" className="mobile-logo" src={MiniLogo} alt="LUP4LDN Logo" />
      </div>

      <div className="topbar-right">
        <ul className="topbar-menu">
          <li className="p-d-flex p-ai-center">
            <img
              src={avatarUrl || '/assets/img/user-default.png'}
              alt="user"
              className="profile-image p-mr-4"
            />
            <span className="p-mr-4 profile-name">
              <small>{t('LOGGED_IN_AS')}</small>
              <br />
              {displayName}
            </span>
          </li>
          <li className="notifications-item active-menuitem">
            <button
              type="button"
              className="p-link"
              onClick={() =>
                invitations &&
                invitations.length &&
                setNotificationMenuVisible(!notificationMenuVisible)
              }
            >
              <i className="pi pi-bell" />
              {invitations && invitations.length > 0 && (
                <span className="topbar-badge">{invitations.length}</span>
              )}
            </button>
            {notificationMenuVisible && (
              <ul className="notifications-menu fade-in-up p-pt-2" style={{ zIndex: '9999' }}>
                {invitations &&
                  invitations.map((i) => (
                    <li key={i.id} role="menuitem" className="p-mb-2">
                      <div className="p-d-flex p-jc-between">
                        <div style={{ paddingRight: '.5rem' }}>
                          {t('INVITED_TEXT')} <strong>{i.project.title}</strong> {t('BY')}{' '}
                          <strong>{`${i.inviter.firstname} ${i.inviter.lastname}`}</strong>.
                        </div>
                        <div className="actionable-buttons">
                          <Button
                            title={t('ACCEPT_INVITE')}
                            disabled={loadingInvitation === i.id}
                            icon="pi pi-check"
                            className="p-button-success p-button-sm"
                            onClick={() => acceptInvite(i.id)}
                          />
                          <Button
                            title={t('REJECT_INVITE')}
                            disabled={loadingInvitation === i.id}
                            icon="pi pi-times"
                            className="p-button-danger p-button-sm p-ml-2"
                            onClick={() => rejectInvite(i.id)}
                          />
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </li>
          <li className="language-picker active-menuitem">
            <button
              type="button"
              className="p-link"
              onClick={() => setLanguageMenuVisible(!languageMenuVisible)}
            >
              <span style={{ fontSize: '2rem' }}>{ language?.icon }</span>
            </button>
            {languageMenuVisible && (
              <ul className="language-picker-menu fade-in-up p-pt-2" style={{ zIndex: '9999' }}>
                <li role="menuitem" className="p-mb-2">
                  <button type="button" className="p-link" style={{ fontSize: '1.2rem' }} onClick={() => changeLanguageTo({
                    icon: '🇬🇧',
                    label: 'English',
                    code: 'en',
                  })}>
                    <span style={{ fontSize: '1.5rem', marginRight: '1rem' }}>🇬🇧</span> English
                  </button>
                </li>
                <li role="menuitem" className="p-mb-2" style={{ fontSize: '1.2rem' }}>
                  <button type="button" className="p-link" style={{ fontSize: '1.2rem' }} onClick={() => changeLanguageTo({
                    icon: '🇫🇷',
                    label: 'Français',
                    code: 'fr',
                  })}>
                    <span style={{ fontSize: '1.5rem', marginRight: '1rem' }}>🇫🇷</span> Français
                  </button>
                </li>
              </ul>
            )}
          </li>
          <li>
            <NavLink to="/account-settings" style={{ width: '100%' }}>
              <Button
                label={t('ACCOUNT_SETTINGS')}
                icon="pi pi-cog"
                className="p-button-secondary p-button-sm"
              />
            </NavLink>
          </li>
          <li>
            <Button
              onClick={signOut}
              title={t('SIGN_OUT')}
              label=""
              icon="pi pi-sign-out"
              className="p-button-info p-button-sm"
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AppTopbar;
