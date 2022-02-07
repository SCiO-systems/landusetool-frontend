import React, { useContext, useState } from 'react';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { Card } from 'primereact/card';
import { useHistory } from 'react-router-dom';

import Map from '../../components/glowglobe/Map';
import { UserContext, ToastContext } from '../../store';
import { handleError } from '../../utilities/errors';
import { editProject, getNextStep } from '../../services/projects';

const LandUseSuitability = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { currentProject, setUser } = useContext(UserContext);
  const { setError } = useContext(ToastContext);
  const [isLoading, setIsLoading] = useState(false);

  if (!currentProject.preprocessing_data) {
    return <>Project preprocessing...</>;
  }

  const mapLinks = [
    currentProject.preprocessing_data.land_use,
    currentProject.preprocessing_data.suitability,
  ];

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const { data} = await editProject(currentProject.id, { step: getNextStep(currentProject) });
      setUser({ currentProject: data });
      setTimeout(() => history.push('/land-use-planning'), 500);
    } catch (e) {
      setError(handleError(e));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card>
        <Map
          type='side-by-side'
          mapLinks={mapLinks}
          paletteType='LandSuitabilityPalette'
          label='Land Use Suitability'
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
        <div className="p-grid p-justify-center p-text-center p-mt-4 p-px-3">
          <Button
            label={t('ANTICIPATED_NEW_LAND_DEGRADATION')}
            icon="fad fa-chart-line-down"
            type="button"
            loading={isLoading}
            className="p-d-block"
            onClick={() => handleSubmit()}
          />
        </div>
      </Card>
    </>
  );
};

export default LandUseSuitability;
