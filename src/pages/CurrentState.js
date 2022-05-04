import { Card } from 'primereact/card';
import { TabPanel, TabView } from 'primereact/tabview';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LandManagementSustainability from './subpages/LandManagementSustainability';
import LandUseSuitability from './subpages/LandUseSuitability';

const CurrentState = () => {
  const { t } = useTranslation();
  const [topTabIndex, setTopTabIndex] = useState(0);

  return (
    <div className="layout-dashboard">
      <Card>
        <TabView activeIndex={topTabIndex} onTabChange={(e) => setTopTabIndex(e.index)}>
          <TabPanel
            header={
              <span>
                <i className="fad fa-th p-mr-2" />
                {t('LAND_USE_SUITABILITY')}
              </span>
            }
          >
            <LandUseSuitability />
          </TabPanel>
          <TabPanel
            header={
              <span>
                <i className="fad fa-recycle p-mr-2" />
                {t('LAND_MANAGEMENT_SUSTAINABILITY')}
              </span>
            }
          >
            <LandManagementSustainability />
          </TabPanel>
        </TabView>
      </Card>
    </div>
  );
};

export default CurrentState;
