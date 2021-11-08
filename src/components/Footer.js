import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import LogoSCiO from '../assets/img/SCiO-sLogo-Dark.png';

library.add(fab);

const Footer = () => (
  <div className="layout-footer">
    <div
      className="footer-logo-container p-d-flex p-flex-row"
      style={{ width: '100%', justifyContent: 'space-between' }}
    >
      <div className="p-d-flex p-flex-row p-ai-center">
        <a
          href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
          title="Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)"
          target="_blank"
          rel="noreferrer"
        >
          <span className="hover-item">
            <FontAwesomeIcon
              className="p-mr-3"
              icon={['fab', 'creative-commons']}
              size="2x"
            />
            <FontAwesomeIcon
              className="p-mr-3"
              icon={['fab', 'creative-commons-by']}
              size="2x"
            />
            <FontAwesomeIcon
              className="p-mr-3"
              icon={['fab', 'creative-commons-nc']}
              size="2x"
            />
            <FontAwesomeIcon
              className="p-mr-3"
              icon={['fab', 'creative-commons-sa']}
              size="2x"
            />
          </span>
        </a>
      </div>
      <div className="p-d-flex p-flex-row p-ai-center">
        <span className="p-mr-3">powered by</span>
        <a href="https://scio.systems" rel="noreferrer" target="_blank">
          <img
            src={LogoSCiO}
            alt="SCiO Logo"
            style={{ height: '30px', width: 'auto' }}
          />
        </a>
      </div>
    </div>
  </div>
);

export default Footer;
