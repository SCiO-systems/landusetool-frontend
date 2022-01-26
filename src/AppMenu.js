import { Tag } from 'primereact/tag';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import Logo from './assets/img/LUP4LDN-LOGO_small.png';
import { UserContext } from './store';
import { DRAFT, PROJECT_STEPS } from './services/projects';

const AppMenu = ({ onMenuClick }) => {
  const { t } = useTranslation();
  const { availableProjects, currentProject, countryLevelLinks } = useContext(UserContext);

  const handleClick = (e, isDisabled) => {
    if (isDisabled) e.preventDefault();
  };

  return (
    <div className="layout-sidebar" role="button" tabIndex="0" onClick={onMenuClick}>
      <div className="logo">
        <NavLink to="/">
          <div className="p-d-flex p-ai-center">
            <img
              id="app-logo"
              className="logo-image p-mr-3"
              src={Logo}
              alt="LUP4LDN"
              style={{ height: '50px', width: '50px' }}
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
          {(availableProjects?.length > 0 && currentProject) && (
            <>
              <li className="layout-root-menuitem" role="menuitem">
                <div className="layout-root-menuitem">
                  <div className="layout-menuitem-root-text">
                    {t('ACTIVE_PROJECT')}:&nbsp;
                    <Tag
                      className="p-px-1 p-py-0 p-block"
                      style={{ wordBreak: 'break-all' }}
                      value={currentProject ? currentProject.acronym : '-'}
                    />
                  </div>
                </div>
              </li>
              <li className="menu-separator" role="separator" />
            </>
          )}
          <li className="layout-root-menuitem" role="menuitem">
            <div className="layout-root-menuitem">
              <div className="layout-menuitem-root-text">{t('MY_PROJECTS')}</div>
            </div>
            <ul className="layout-menu" role="menu">
              <li className="p-mb-1" role="menuitem">
                <NavLink to="/create-project" activeClassName="p-button" exact>
                  <i className="layout-menuitem-icon fad fa-file-plus" />
                  <span className="layout-menuitem-text">{t('NEW_PROJECT')}</span>
                </NavLink>
              </li>
              <li className="p-mb-1" role="menuitem">
                <NavLink to="/" activeClassName="p-button" exact>
                  <i className="layout-menuitem-icon fad fa-columns" />
                  <span className="layout-menuitem-text">{t('DASHBOARD')}</span>
                </NavLink>
              </li>
            </ul>
          </li>
          {(currentProject && currentProject.status === DRAFT) && (
            <>
              <li className="menu-separator" role="separator" />
              <li className="layout-root-menuitem" role="menuitem">
                <div className="layout-root-menuitem">
                  <div className="layout-menuitem-root-text">{t('SETUP_PROJECT')}</div>
                </div>
                <ul className="layout-menu" role="menu">
                  <li className="p-mb-1" role="menuitem">
                    <NavLink
                      onClick={(e) => handleClick(e, currentProject.step === PROJECT_STEPS.REGION_OF_INTEREST)}
                      to={`/setup-project/${currentProject.id}/region-of-interest`}
                      activeClassName="p-button"
                      exact
                    >
                      {(currentProject.step === PROJECT_STEPS.REGION_OF_INTEREST) ? (
                        <i className="layout-menuitem-icon fas fa-check-circle" />
                      ) : (
                        <i className="layout-menuitem-icon far fa-check-circle" />
                      )}
                      <span className="layout-menuitem-text">{t('REGION_OF_INTEREST')}</span>
                    </NavLink>
                  </li>
                  <li className="p-mb-1" role="menuitem">
                    <NavLink
                      onClick={(e) => handleClick(e, currentProject.step === null)}
                      to={`/setup-project/${currentProject.id}/datasets`}
                      activeClassName="p-button"
                    >
                      {(currentProject.step === PROJECT_STEPS.COMPLETED) ? (
                        <i className="layout-menuitem-icon fas fa-check-circle" />
                      ) : (
                        <i className="layout-menuitem-icon far fa-check-circle" />
                      )}
                      <span className="layout-menuitem-text">{t('PROJECT_DATASETS')}</span>
                    </NavLink>
                  </li>
                </ul>
              </li>
            </>
          )}
          {(currentProject && currentProject.status !== DRAFT) && countryLevelLinks && (
            <>
              <li className="menu-separator" role="separator" />
              <li className="layout-root-menuitem" role="menuitem">
                <div className="layout-root-menuitem">
                  <div className="layout-menuitem-root-text">{t('COUNTRY_LEVEL')}</div>
                </div>
                <ul className="layout-menu" role="menu">
                  {countryLevelLinks && countryLevelLinks.unccd_annex !== '' && (
                    <li className="p-mb-1" role="menuitem">
                      <a href={countryLevelLinks.unccd_annex} target="_blank" rel="noreferrer">
                        <i className="layout-menuitem-icon fad fa-bullseye-arrow" />
                        <span className="layout-menuitem-text">{t('UNCCD_ANNEX')}</span>
                      </a>
                    </li>
                  )}
                  <li className="p-mb-1" role="menuitem">
                    <NavLink to="/risk-profiles" activeClassName="p-button" exact>
                      <i className="layout-menuitem-icon fad fa-analytics" />
                      <span className="layout-menuitem-text">{t('RISK_PROFILES')}</span>
                    </NavLink>
                  </li>
                </ul>
              </li>
            </>
          )}
          {(currentProject && currentProject.status !== DRAFT) && (
            <>
              <li className="menu-separator" role="separator" />
              <li className="layout-root-menuitem" role="menuitem">
                <div className="layout-root-menuitem">
                  <div className="layout-menuitem-root-text">{t('REGION_OF_INTEREST')}</div>
                </div>
                <ul className="layout-menu" role="menu">
                  <li className="p-mb-1" role="menuitem">
                    <NavLink to="/current-state" activeClassName="p-button" exact>
                      <i className="layout-menuitem-icon fad fa-check-double" />
                      <span className="layout-menuitem-text">{t('CURRENT_STATE')}</span>
                    </NavLink>
                  </li>
                  <li className="p-mb-1" role="menuitem">
                    <NavLink to="/land-use-planning" activeClassName="p-button" exact>
                      <i className="layout-menuitem-icon fad fa-abacus" />
                      <span className="layout-menuitem-text">{t('LAND_USE_PLANNING')}</span>
                    </NavLink>
                  </li>
                </ul>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AppMenu;
