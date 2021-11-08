import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import 'primereact/resources/primereact.min.css';
import { Toast } from 'primereact/toast';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import Footer from '../components/Footer';
import Logo from '../components/Logo';
import { registerUser } from '../services/users';
import { UserContext } from '../store';
import { handleError } from '../utilities/errors';
import { validateName, validatePassword } from '../utilities/validations';

const Register = () => {
  const { t } = useTranslation();
  const toast = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const { isLoggedIn, resetData } = useContext(UserContext);

  useEffect(() => {
    resetData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const createNewAccount = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await registerUser({ firstname, lastname, email, password });
      toast.current.show({
        severity: 'success',
        summary: 'Registration',
        detail: 'Your new account has been created! You will be redirected to the login screen.',
      });
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
      setIsLoading(false);
    } catch (error) {
      toast.current.show({
        severity: 'error',
        summary: 'Oops!',
        detail: handleError(error),
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Basic form validation.
    if (
      !validatePassword(password, passwordConfirm) ||
      !validateName(firstname) ||
      !validateName(lastname)
    ) {
      setFormValid(false);
    } else {
      setFormValid(true);
    }
  }, [firstname, lastname, password, passwordConfirm, email, emailConfirm]);

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <Toast ref={toast} position="top-right" />
      <div className="register-page">
        <Logo />
        <div className="layout-content layout-content-fixed">
          <div className="p-grid">
            <div className="p-col-12 p-md-8" style={{ margin: '0 auto' }}>
              <div className="card p-fluid p-shadow-4 rounded">
                <h5>{t('NEW_USER_REGISTRATION_TEXT')}</h5>
                <div className="p-formgrid p-grid p-mt-3">
                  <div className="p-field p-col-12 p-md-6">
                    <label htmlFor="firstname">{t('FIRSTNAME')}</label>
                    <InputText
                      id="firstname"
                      type="text"
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                      required
                      className={firstname.length === 0 && 'p-invalid'}
                    />
                    {firstname.length === 0 && (
                      <small className="p-error p-d-block">Please fill in your first name.</small>
                    )}
                  </div>
                  <div className="p-field p-col-12 p-md-6">
                    <label htmlFor="lastname">{t('LASTNAME')}</label>
                    <InputText
                      id="lastname"
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                      type="text"
                      required
                      className={lastname.length === 0 && 'p-invalid'}
                    />
                    {lastname.length === 0 && (
                      <small className="p-error p-d-block">Please fill in your last name.</small>
                    )}
                  </div>
                  <div className="p-field p-col-12 p-md-6">
                    <label htmlFor="email">{t('EMAIL')}</label>
                    <InputText
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={(email.length === 0 || email.indexOf('@') === -1) && 'p-invalid'}
                      required
                    />
                    {email.length === 0 && (
                      <small className="p-error p-d-block">
                        Please fill in your email address.
                      </small>
                    )}
                    {email.indexOf('@') === -1 && email.length > 0 && (
                      <small className="p-error p-d-block">The email address is invalid.</small>
                    )}
                  </div>
                  <div className="p-field p-col-12 p-md-6">
                    <label htmlFor="emailConfirm">{t('REPEAT_EMAIL')}</label>
                    <InputText
                      id="emailConfirm"
                      onChange={(e) => setEmailConfirm(e.target.value)}
                      type="email"
                      value={emailConfirm}
                      required
                      className={email !== emailConfirm && 'p-invalid'}
                    />
                    {email !== emailConfirm && (
                      <small className="p-error p-d-block">
                        The two email addresses do not match.
                      </small>
                    )}
                  </div>
                  <div className="p-field p-col-12 p-md-6">
                    <label htmlFor="password">{t('PASSWORD')}</label>
                    <Password
                      feedback
                      toggleMask
                      id="password"
                      autoComplete="off"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      className={(password.length <= 8 && 'p-invalid') || ''}
                    />
                    {password.length <= 8 && (
                      <small className="p-error p-d-block">
                        The password must be more than 8 characters in length.
                      </small>
                    )}
                  </div>
                  <div className="p-field p-col-12 p-md-6">
                    <label htmlFor="passwordConfirm">{t('REPEAT_PASSWORD')}</label>
                    <Password
                      feedback
                      toggleMask
                      autoComplete="off"
                      value={passwordConfirm}
                      id="passwordConfirm"
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      type="password"
                      className={(password !== passwordConfirm && 'p-invalid') || ''}
                    />
                    {password !== passwordConfirm && (
                      <small className="p-error p-d-block">The two passwords do not match.</small>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-col-12 p-text-center p-mt-1">
            <div className="p-mb-5">
              <Checkbox
                inputId="legalCheck"
                name="option"
                value="Chicago"
                checked={acceptedTerms}
                onChange={() => setAcceptedTerms(!acceptedTerms)}
              />
              <label className="p-ml-2" style={{ cursor: 'pointer' }}>
                {t('TERMS_ACCEPT')}
              </label>
            </div>
            <Button
              label={t('CREATE_ACCOUNT_BUTTON')}
              icon="pi pi-user-plus"
              type="submit"
              loading={isLoading}
              onClick={createNewAccount}
              disabled={!acceptedTerms || !formValid}
              className="p-button-big p-mr-2 p-mb-2"
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
