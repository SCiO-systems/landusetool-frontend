import React from 'react';
import { NavLink } from 'react-router-dom';
import LogoImage from '../assets/img/LUP4LDN-LOGO_small.png';

const Logo = () => (
  <div className="p-text-center">
    <NavLink to="/">
      <div className="p-d-flex p-ai-center">
        <img
          src={LogoImage}
          alt="LUP4LDN logo"
          width="100px"
          style={{ margin: '25px 15px 25px 0' }}
        />
        <h1 style={{ color: 'black', textAlign: 'left' }}>LUP4LDN</h1>
      </div>
    </NavLink>
  </div>
);

export default Logo;
