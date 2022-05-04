import React, { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';

import Map from './glowglobe/Map';
import { handleError } from '../utilities/errors';
import { ToastContext } from '../store';
import { prepareLDNMap } from '../services/projects';

const LDNMap = ({ polygonsList, projectId, downloadable = false }) => {
  const { t } = useTranslation();
  const [ldnMap, setLdnMap] = useState(null);
  const { setError } = useContext(ToastContext);

  const fetchLdnMap = async () => {
    if (polygonsList.length > 0) {
      try {
        const { data } = await prepareLDNMap(projectId, polygonsList);
        setLdnMap(data?.ldn_map);
      } catch (e) {
        setError(handleError(e));
      }
    } else {
      setLdnMap(null);
    }
  };

  useEffect(() => {
    fetchLdnMap();
  }, [polygonsList]); // eslint-disable-line

  if (polygonsList.length === 0) {
    return <></>;
  }

  if (ldnMap === null) {
    return (
      <div className="p-d-flex p-jc-center p-ai-center">
        <i className="pi pi-spin pi-spinner" style={{ fontSize: '2em' }} />
      </div>
    )
  }

  return (
    <>
      <Map
        type="single"
        maps={[
          {
            link: ldnMap,
            label: `LDN Map`,
            paletteType: 'LandDegradationPalette',
          },
        ]}
      />
      {downloadable && (
        <Button
          label={t('DOWNLOAD_MAP')}
          icon="pi pi-cloud-download"
          type="button"
          className="p-d-block p-button-secondary p-mt-2"
          onClick={() => window.open(ldnMap, '_blank')}
        />
      )}
    </>
  )
};

export default LDNMap;
