import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import Input from '../components/forms/Input';
import TextArea from '../components/forms/TextArea';
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input register={register} errors={errors} required name="title" label={t('PROJECT_TITLE')} />
          <Input register={register} errors={errors} required name="acronym" label={t('PROJECT_ACRONYM')} />
          <TextArea rows={5} cols={30} register={register} errors={errors} name="description" label={t('PROJECT_DESCRIPTION')} />
          <div className="p-d-flex p-jc-end">
            <Button type="submit" label={t('SAVE_CONTINUE')} icon="pi pi-save" />
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateProject;
