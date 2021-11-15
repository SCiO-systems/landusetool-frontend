import { Card } from 'primereact/card';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button } from 'primereact/button';

import ProjectDetails from '../components/forms/ProjectDetails';
import Loading from '../components/Loading';
import { editProject, getProject } from '../services/projects';
import { ToastContext } from '../store';
import { handleError } from '../utilities/errors';

const EditProject = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const { setError, setSuccess } = useContext(ToastContext);

  const onSubmit = async (data) => {
    try {
      await editProject(id, data);
      setSuccess('Woohoo!', 'Project details have been updated.');
    } catch (e) {
      setError(handleError(e));
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await getProject(id);
        setProject(data);
      } catch (e) {
        setError(handleError(e));
      }
    };
    fetchProject();
  }, [id, setError]);

  if (project === null) {
    return <Loading />;
  }

  return (
    <div className="layout-dashboard">
      <Card title={t('PROJECT_DETAILS')} subTitle={t('PROJECT_DETAILS_SUBTITLE')}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ProjectDetails
            project={project}
            register={register}
            errors={errors}
          />
          <div className="p-d-flex p-jc-start p-mt-4 p-mb-2">
            <Button className="p-button-lg" type="submit" label={t('SAVE_CHANGES')} icon="pi pi-save" />
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditProject;
