import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Card } from 'primereact/card';
import ProjectDetails from '../components/forms/ProjectDetails';
import { createProject } from '../services/projects';
import { ToastContext } from '../store';
import { handleError } from '../utilities/errors';

const CreateProject = () => {
  const { t } = useTranslation();
  const { register, formState: { errors }, handleSubmit } = useForm();
  const { setError, setSuccess } = useContext(ToastContext);
  const onSubmit = async (data) => {
    try {
      await createProject(data);
      setSuccess('Woohoo!', 'Your project has been created');
    } catch (e) {
      setError(handleError(e));
    }
  };

  return (
    <div className="layout-dashboard">
      <Card title={t('PROJECT_DETAILS')} subTitle={t('PROJECT_DETAILS_SUBTITLE')}>
        <ProjectDetails
          register={register}
          errors={errors}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
        />
      </Card>
    </div>
  );
};

export default CreateProject;
