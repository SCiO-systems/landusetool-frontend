import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TabView, TabPanel } from 'primereact/tabview';
import { Card } from 'primereact/card';

import PlanForLDN from './subpages/PlanForLDN';

const LandUsePlanning = () => {
  const { t } = useTranslation();
  const [topTabIndex, setTopTabIndex] = useState(1);

  return (
    <div className="layout-dashboard">
      <Card>
        <TabView activeIndex={topTabIndex} onTabChange={(e) => setTopTabIndex(e.index)}>
          <TabPanel
            header={(
              <span>
                <i className="fad fa-chart-line-down p-mr-2" />
                {t('ANTICIPATED_NEW_LAND_DEGRADATION')}
              </span>
          )}
          >
            Map
          </TabPanel>
          <TabPanel
            header={(
              <span>
                <i className="fad fa-abacus p-mr-2" />
                {t('PLAN_FOR_LDN')}
              </span>
          )}
          >
            <PlanForLDN />
          </TabPanel>
          <TabPanel
            header={(
              <span>
                <i className="fad fa-analytics p-mr-2" />
                {t('NEUTRALITY_MATRIX_MAP')}
              </span>
          )}
          >
            Neutrality Matrix
          </TabPanel>
        </TabView>
      </Card>
    </div>
  );
};

export default LandUsePlanning;
