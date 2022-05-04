import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

import { UserContext } from '../store';
import Map from '../components/glowglobe/Map';
import PlanForLDN from './subpages/PlanForLDN';
import NeutralityMatrix from './subpages/NeutralityMatrix';

const NewLandDegradationMap = () => {
  const { t } = useTranslation();
  const { currentProject } = useContext(UserContext);

  if (!currentProject.preprocessing_data) {
    return <>Project preprocessing...</>;
  }

  const maps = [
    {
      link: currentProject.preprocessing_data.land_degradation,
      label: 'Current Land Degradation',
      paletteType: 'LandDegradationPalette',
    },
    {
      link: currentProject.preprocessing_data.future_ld,
      label: 'Future Land Degradation',
      paletteType: 'FutureLandDegradation',
    },
  ];

  return (
    <>
      <div className="p-grid p-justify-between p-mt-2 p-px-3">
        <div>
          <h4>{ maps[0].label }</h4>
        </div>
        <div>
          <h4>{ maps[1].label }</h4>
        </div>
      </div>
      <Map
        type='side-by-side'
        maps={maps}
        customLuClasses={currentProject.lu_classes}
      />
        <div className="p-grid p-justify-between p-mt-4 p-px-3">
          <Button
            label={t('DOWNLOAD_MAP')}
            icon="pi pi-cloud-download"
            type="button"
            className="p-d-block p-button-secondary"
            onClick={() => window.open(maps[0].link, '_blank')}
          />
          <Button
            label={t('DOWNLOAD_MAP')}
            icon="pi pi-cloud-download"
            type="button"
            className="p-d-block p-button-secondary"
            onClick={() => window.open(maps[1].link, '_blank')}
          />
        </div>
    </>
  );
}

const LandUsePlanning = () => {
  const { t } = useTranslation();
  const [topTabIndex, setTopTabIndex] = useState(0);

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
            <NewLandDegradationMap />
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
            <NeutralityMatrix />
          </TabPanel>
        </TabView>
      </Card>
    </div>
  );
};

export default LandUsePlanning;
