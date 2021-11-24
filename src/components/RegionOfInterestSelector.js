import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Steps } from 'primereact/steps';
import { useTranslation } from 'react-i18next';

import Glowglobe from './glowglobe';
import CountrySelector from './CountrySelector';
import { getCountryAdminLevelArea, getByCoordinates } from '../services/polygons';

const RegionOfInterestSelector = ({ register, setValue }) => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [country, setCountry] = useState(undefined);
  const [adminLevel, setAdminLevel] = useState(1);
  const [layers, setLayers] = useState([]);

  register('country', { required: true });
  register('adminLevel', { required: true });
  register('polygon', { required: true });

  useEffect(() => {
    setValue('country', country);
    setValue('adminLevel', adminLevel);
    if (country) {
      getCountryAdminLevelArea(country, adminLevel)
        .then((res) => {
          setLayers([{
            layer: {
              type: 'geojson',
              data: res.polygon,
            },
          }]);
          setActiveIndex(1);
        });
    }
  }, [country, adminLevel, setValue]);

  const glowglobeOptions = {
    mode: 'select_administration_area',
    mask: true,
  };

  const resetSelections = () => {
    setCountry(undefined);
    setAdminLevel(1);
    setLayers([]);
    setActiveIndex(0);
  };

  const handleOutput = (pin) => {
    getByCoordinates(pin.point, adminLevel).then((res) => {
      setLayers([{
        layer: {
          type: 'geojson',
          data: res.polygon,
        },
      }]);
      setValue('polygon', res.polygon);
    });
  };

  const steps = [
    {
      label: t('SELECT_COUNTRY'),
      command: (_e) => {
        setActiveIndex(0);
      },
    },
    {
      label: t('DEFINE_THE_ROI'),
      command: (_e) => {
        if (country === undefined) return;
        setActiveIndex(1);
      },
    },
  ];

  return (
    <>
      <Steps
        model={steps}
        activeIndex={activeIndex}
        readOnly
        className="p-mb-4"
      />
      {activeIndex === 0 && (
        <CountrySelector setCountry={setCountry} />
      )}
      {activeIndex === 1 && (
        <Glowglobe
          options={glowglobeOptions}
          output={handleOutput}
          layers={layers}
          setAdminLevel={setAdminLevel}
        />
      )}
      <div className="p-d-flex p-jc-between p-mt-6 p-mb-2">
        <Button
          className="p-button-secondary"
          type="button"
          disabled={activeIndex === 0}
          onClick={(_e) => resetSelections()}
          label={t('PREVIOUS')}
          icon="pi pi-angle-left"
        />
        <Button className="p-button-secondary" type="button" disabled={activeIndex === 1} label={t('NEXT')} icon="pi pi-angle-right" iconPos="right" />
      </div>
    </>
  );
};

export default RegionOfInterestSelector;
