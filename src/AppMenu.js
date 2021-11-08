import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import Logo from './assets/img/LUP4LDN-LOGO_small.png';

const AppMenu = ({ onMenuClick }) => {
  const { t } = useTranslation();

  return (
    <div
      className="layout-sidebar"
      role="button"
      tabIndex="0"
      onClick={onMenuClick}
    >
      <div className="logo">
        <NavLink to="/">
          <div className="p-d-flex p-ai-center">
            <img
              id="app-logo"
              className="logo-image"
              src={Logo}
              alt="LUP4LDN"
              style={{ height: '50px', width: '50px', marginRight: '15px' }}
            />
            <h3 style={{ color: 'white', textAlign: 'left' }}>
              LUP4LDN
              <small className="p-d-block">BETA</small>
            </h3>
          </div>
        </NavLink>
      </div>

      <div className="layout-menu-container">
        <ul className="layout-menu" role="menu">
          <li className="layout-root-menuitem" role="menuitem">
            <ul className="layout-menu" role="menu">
              <li className="" role="menuitem">
                <NavLink to="/" activeClassName="p-button" exact>
                  <i className="layout-menuitem-icon pi pi-fw pi-home" />
                  <span className="layout-menuitem-text">{t('DASHBOARD')}</span>
                </NavLink>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AppMenu;
