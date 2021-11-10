import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';
import Input from './Input';
import TextArea from './TextArea';

const ProjectDetails = ({ project, handleSubmit, onSubmit, register, errors }) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input value={project?.title} register={register} errors={errors} required name="title" label={t('PROJECT_TITLE')} />
      <Input value={project?.acronym} register={register} errors={errors} required name="acronym" label={t('PROJECT_ACRONYM')} />
      <TextArea value={project?.description} rows={5} cols={30} register={register} errors={errors} name="description" label={t('PROJECT_DESCRIPTION')} />
      <div className="p-d-flex p-jc-end">
        <Button type="submit" label={t('SAVE_CHANGES')} icon="pi pi-save" />
      </div>
    </form>
  );
};

export default ProjectDetails;
