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
        <div className="p-d-flex p-jc-start p-mt-4 p-mb-6">
          <Button
            className="p-button-lg"
            loading={loading}
            disabled={!readyToSubmit || loading}
            type="submit"
            label={t('SAVE_CHANGES')}
            icon="pi pi-save"
          />
        </div>
      </form>
    </div>
  );
};

export default RegionOfInterest;
