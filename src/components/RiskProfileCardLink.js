import React from 'react';
import { Card } from 'primereact/card';

const RiskProfileCardLink = ({ iconClasses, title, subtitle, link }) => {
  if (!link || link === '') {
    return <></>;
  }

  return (
    <Card className="p-mb-4 p-shadow-6">
      <div className="p-d-flex p-jc-start p-ai-center p-px-3">
        <div className="p-d-flex p-jc-center p-ai-center" style={{ width: '40px' }}>
          <i className={iconClasses} />
        </div>
        <blockquote className="p-my-0 p-ml-5 p-d-inline-block">
          <a href={link} target="_blank" rel="noreferrer">
            {title}<br />
            <h5 className="p-m-0">{subtitle}</h5>
          </a>
        </blockquote>
      </div>
    </Card>
  );
};

export default RiskProfileCardLink;
