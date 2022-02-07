import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

import { UserContext } from '../store';
import Map from '../components/glowglobe/Map';
import PlanForLDN from './subpages/PlanForLDN';

const NewLandDegradationMap = () => {
  const { t } = useTranslation();
  const { currentProject } = useContext(UserContext);

  if (!currentProject.preprocessing_data) {
    return <>Project preprocessing...</>;
  }

  const mapLinks = [
    currentProject.preprocessing_data.land_degradation,
    currentProject.preprocessing_data.future_ld,
  ];

  return (
    <>
      <Map
        type='side-by-side'
        mapLinks={mapLinks}
        paletteType='LandDegradationPalette'
        label='New Land Degradation'
        customLuClasses={currentProject.lu_classes}
      />
        <div className="p-grid p-justify-between p-mt-4 p-px-3">
          <Button
            label={t('DOWNLOAD_MAP')}
            icon="pi pi-cloud-download"
            type="button"
            className="p-d-block p-button-secondary"
            onClick={() => window.open(mapLinks[0], '_blank')}
          />
          <Button
            label={t('DOWNLOAD_MAP')}
            icon="pi pi-cloud-download"
            type="button"
            className="p-d-block p-button-secondary"
            onClick={() => window.open(mapLinks[1], '_blank')}
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
            Neutrality Matrix
          </TabPanel>
        </TabView>
      </Card>
    </div>
  );
};

export default LandUsePlanning;
