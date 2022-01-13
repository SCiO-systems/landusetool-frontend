import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Steps } from 'primereact/steps';
import { RadioButton } from 'primereact/radiobutton';
import { useTranslation } from 'react-i18next';

import MultipleKeyValueEntriesTable from './MultipleKeyValueEntriesTable';
import Glowglobe from './glowglobe';
import CountrySelector from './CountrySelector';
import { getCountryAdminLevelArea, getByCoordinates } from '../services/polygons';

const RegionOfInterestSelector = ({ register, setValue }) => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [country, setCountry] = useState(undefined);
  const [adminLevel, setAdminLevel] = useState(1);
  const [layers, setLayers] = useState([]);
  const [luClasses, setLuClasses] = useState([]);
  const [useDefaultLuClasses, setUseDefaultLuClasses] = useState(true);

  register('country', { required: true });
  register('adminLevel', { required: true });
  register('polygon', { required: true });
  register('defaultLuClasses', { value: true });
  register('luClasses', { required: false });

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

  useEffect(() => {
    setValue('luClasses', JSON.stringify(luClasses));
  }, [luClasses, setValue]);

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
    {
      label: t('SETUP_LU_CLASSES'),
      command: (_e) => {
        if (country === undefined) return;
        setActiveIndex(2);
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
      {activeIndex === 2 && (
        <>
          <div className="p-field-radiobutton">
            <RadioButton
              inputId="defaultLuClasses"
              value="true"
              name="defaultLuClasses"
              onChange={() => {
                setUseDefaultLuClasses(true);
                setValue('defaultLuClasses', true);
              }}
              checked={useDefaultLuClasses}
            />
            <label htmlFor="defaultLuClasses">{t('USE_DEFAULT_LU_CLASSIFICATION')}</label>
          </div>
          <div className="p-field-radiobutton">
            <RadioButton
              inputId="defaultLuClasses"
              value="false"
              name="defaultLuClasses"
              onChange={() => {
                setUseDefaultLuClasses(false);
                setValue('defaultLuClasses', false);
              }}
              checked={!useDefaultLuClasses}
            />
            <label htmlFor="defaultLuClasses">{t('USE_CUSTOM_LU_CLASSIFICATION')}</label>
          </div>
          {!useDefaultLuClasses && (
            <MultipleKeyValueEntriesTable
              className="p-mt-4"
              keyLabel={t('NAME')}
              valueLabel={t('VALUE')}
              header={t('CUSTOM_LU_CLASSES')}
              data={luClasses}
              onAddItem={(entry) =>
                setLuClasses(
                  [...luClasses, entry]
                )
              }
              onDeleteItem={(entry) => {
                setLuClasses(
                  luClasses.filter((lc) => lc.key !== entry.key)
                );
              }}
            />
          )}
        </>
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
        <Button
          className="p-button-secondary"
          type="button"
          disabled={activeIndex === 2}
          label={t('NEXT')}
          onClick={(_e) => setActiveIndex((oldIndex) => (oldIndex + 1))}
          icon="pi pi-angle-right"
          iconPos="right"
        />
      </div>
    </>
  );
};

export default RegionOfInterestSelector;
