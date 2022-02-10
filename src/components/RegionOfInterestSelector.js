import React, { useEffect, useState, useRef, useContext } from 'react';
import { Button } from 'primereact/button';
import { Steps } from 'primereact/steps';
import { useTranslation } from 'react-i18next';

import Glowglobe from './glowglobe';
import CountrySelector from './CountrySelector';
import { handleError } from '../utilities/errors';
import { ToastContext } from '../store';
import { getCountryAdminLevelArea, getByCoordinates } from '../services/polygons';
import { uploadProjectFile } from '../services/files';

const RegionOfInterestSelector = ({ projectId, register, setValue }) => {
  const { t } = useTranslation();
  const roiFileRef = useRef(null);
  const { setError, setSuccess } = useContext(ToastContext);
  const [activeIndex, setActiveIndex] = useState(0);
  const [country, setCountry] = useState(undefined);
  const [adminLevel, setAdminLevel] = useState(1);
  const [layers, setLayers] = useState([]);

  register('country', { required: false });
  register('adminLevel', { required: false });
  register('polygon', { required: false });
  register('roi_file_id', { value: null });

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
    if (!pin.point) return;
    getByCoordinates(pin.point, adminLevel).then((res) => {
      setLayers([{
        layer: {
          type: 'geojson',
          data: res.polygon,
        },
      }]);
      setValue('polygon', res.polygon);
      setValue('roi_file_id', null);
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

  const uploadRoiFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const { data } = await uploadProjectFile(projectId, formData);
      setValue('roi_file_id', data.id);
      setValue('polygon', null);
      setSuccess('Done', 'Your file has been uploaded.');
    } catch (error) {
      setError(setError(handleError(error)));
    }
  };

  return (
    <>
      <Steps
        model={steps}
        activeIndex={activeIndex}
        readOnly
        className="p-mb-4"
      />
      {activeIndex === 0 && (
        <>
          <CountrySelector setCountry={setCountry} />
          <p className="p-mt-6">
            {t('OR_UPLOAD_CUSTOM_POLYGON')}:
            <br />
            <input
              className="hidden"
              type="file"
              accept=".geojson,.shp"
              multiple={false}
              ref={roiFileRef}
              onChange={(e) => uploadRoiFile(e.target.files[0])}
            />
            <Button
              label={t('UPLOAD_POLYGON')}
              icon="pi pi-image"
              type="button"
              className="p-mr-2 p-mt-2"
              onClick={() => {
                roiFileRef.current.click();
              }}
            />
          </p>
        </>
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
          className={`p-button-secondary ${activeIndex === 0 ? ' hidden' : ''}`}
          type="button"
          disabled={activeIndex === 0}
          onClick={(_e) => resetSelections()}
          label={t('PREVIOUS')}
          icon="pi pi-angle-left"
        />
        <Button
          className={`p-button-secondary ${(activeIndex === 1 || country === undefined) ? ' hidden' : ''}`}
          type="button"
          disabled={activeIndex === 1 || country === undefined}
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
