import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';

import RiskProfileCardLink from '../components/RiskProfileCardLink';
import { UserContext } from '../store';

const RiskProfiles = () => {
  const { countryLevelLinks } = useContext(UserContext);

  if (!countryLevelLinks) {
    return <Redirect to="/" />;
  }

  return (
    <div className="layout-dashboard">
      <RiskProfileCardLink
        iconClasses="fad fa-clipboard-list fa-3x"
        title="WHO-UNFCCC"
        subtitle="Health and Climate Change Country Profile"
        link={countryLevelLinks.who_unfcc}
      />
      <RiskProfileCardLink
        iconClasses="fad fa-thunderstorm-sun fa-3x"
        title="USAID-Climatelinks"
        subtitle="Climate Risk Profile"
        link={countryLevelLinks.usaid}
      />
      <RiskProfileCardLink
        iconClasses="fad fa-exclamation-triangle fa-3x"
        title="UNDRR-PreventionWeb"
        subtitle="Disaster & Risk Profile"
        link={countryLevelLinks.undrr}
      />
      <RiskProfileCardLink
        iconClasses="fad fa-clipboard-check fa-3x"
        title="Global Facility for Disaster Reduction and Recovery (GFDRR)"
        subtitle="Disaster Reduction and Recovery Profile"
        link={countryLevelLinks.gfdrr}
      />
      <RiskProfileCardLink
        iconClasses="fad fa-clipboard-check fa-3x"
        title="Global Facility for Disaster Reduction and Recovery (GFDRR)"
        subtitle="Disaster Risk Profile"
        link={countryLevelLinks.gfdrrdrf}
      />
    </div>
  );
};

export default RiskProfiles;
