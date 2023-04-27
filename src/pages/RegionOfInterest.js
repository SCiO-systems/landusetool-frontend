import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import RegionOfInterestSelector from '../components/RegionOfInterestSelector';
import { editProject, getUrlForStep, PROJECT_STEPS } from '../services/projects';
import { ToastContext } from '../store';
import { handleError } from '../utilities/errors';

const RegionOfInterest = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [readyToSubmit, setReadyToSubmit] = useState(false);
  const { register, handleSubmit, watch, setValue } = useForm();
  const { setError, setSuccess } = useContext(ToastContext);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await editProject(id, {
        ...data,
        administrative_level: data.adminLevel,
        country_iso_code_3: data.country,
        step: PROJECT_STEPS.DATASETS_LAND_USE,
      });
      setSuccess('Success', t('YOUR_CHANGES_HAVE_BEEN_SAVED'));
      setTimeout(() => history.push(getUrlForStep(id, PROJECT_STEPS.DATASETS_LAND_USE)), 1000);
    } catch (e) {
      setError(handleError(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const subscription = watch((value) => {
      if (value?.roi_file_id !== null) {
        setReadyToSubmit(true);
      } else if (value?.country && value?.polygon) {
        setReadyToSubmit(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setReadyToSubmit]);

  return (
    <div className="layout-dashboard">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <RegionOfInterestSelector projectId={id} register={register} setValue={setValue} />
        </Card>
        <div className="p-mt-4 p-mb-6">
          <Button
            className="p-button-lg"
            loading={loading}
            disabled={!readyToSubmit || loading}
            type="submit"
            label={t('SAVE_CHANGES')}
            icon="pi pi-save"
          />
          <div className="p-mt-4">
            <p>
              <strong>
                <u>Attributions</u>:
              </strong>
            </p>
            <p>
              The{' '}
              <a href="https://gadm.org/" target="_blank" rel="noreferrer">
                Database of Global Administrative Areas (GADM)
              </a>{' '}
              has been used as the source of the boundaries and names shown.
            </p>
            <p>
              Geophysical maps are powered by{' '}
              <a href="https://www.esri.com/" target="_blank" rel="noreferrer">
                ESRI.
              </a>
            </p>
            <p>
              <strong>
                <u>Disclaimer</u>:
              </strong>
            </p>
            <p>
              The boundaries and names shown and the designations used on this map do not imply
              official endorsement or acceptance by LUP4LDN.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegionOfInterest;
