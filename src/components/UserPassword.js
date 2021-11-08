import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import 'primereact/resources/primereact.min.css';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { changeUserPassword } from '../services/users';
import { ToastContext } from '../store';
import { handleError } from '../utilities/errors';

const UserPassword = ({ userId }) => {
  const { t } = useTranslation();
  const { setError, setSuccess } = useContext(ToastContext);
  const [isLoading, setIsLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordRepeat, setNewPasswordRepeat] = useState('');

  const changePassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await changeUserPassword(userId, {
        password: oldPassword,
        new: newPassword,
      });
      setOldPassword('');
      setNewPassword('');
      setNewPasswordRepeat('');
      setSuccess('Changed password', 'Your password has been changed.');
    } catch (error) {
      setError(handleError(error));
    }
    setIsLoading(false);
  };

  return (
    <div className="p-grid p-mt-1">
      <div className="p-col-12 p-md-12">
        <div className="card p-fluid p-shadow-4 rounded">
          <h5>{t('CHANGE_PASSWORD')}</h5>
          <form onSubmit={changePassword}>
            <div className="p-formgrid p-grid">
              <div className="p-field p-col-12 p-md-6">
                <label htmlFor="oldPassword">{t('OLD_PASSWORD')}</label>
                <Password
                  id="oldPassword"
                  feedback={false}
                  autoComplete="off"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="p-formgrid p-grid">
              <div className="p-field p-col-12 p-md-6">
                <label htmlFor="newPassword">{t('NEW_PASSWORD')}</label>
                <Password
                  id="newPassword"
                  value={newPassword}
                  autoComplete="off"
                  toggleMask
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className={
                    newPassword !== newPasswordRepeat ? 'p-invalid' : ''
                  }
                />
              </div>
            </div>
            <div className="p-formgrid p-grid">
              <div className="p-field p-col-12 p-md-6">
                <label htmlFor="newPasswordRepeat">
                  {t('REPEAT_NEW_PASSWORD')}
                </label>
                <Password
                  id="newPasswordRepeat"
                  value={newPasswordRepeat}
                  autoComplete="off"
                  feedback={false}
                  toggleMask
                  onChange={(e) => setNewPasswordRepeat(e.target.value)}
                  required
                  className={
                    newPassword !== newPasswordRepeat ? 'p-invalid' : ''
                  }
                />
                {newPassword !== newPasswordRepeat && (
                  <small className="p-error p-d-block">
                    The two passwords do not match.
                  </small>
                )}
              </div>
            </div>
            <div className="p-formgrid p-grid p-justify-start">
              <div className="p-field p-col-12 p-md-6">
                <Button
                  label={t('CHANGE_PASSWORD')}
                  icon="pi pi-save"
                  loading={isLoading}
                  type="submit"
                  disabled={
                    oldPassword.length === 0 ||
                    newPassword.length === 0 ||
                    newPasswordRepeat === 0 ||
                    newPassword !== newPasswordRepeat
                  }
                  onClick={changePassword}
                  className="p-button-primary p-mt-1"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserPassword;
