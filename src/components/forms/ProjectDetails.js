import React from 'react';
import { useTranslation } from 'react-i18next';
import Input from './Input';
import TextArea from './TextArea';

const ProjectDetails = ({ project, register, errors }) => {
  const { t } = useTranslation();

  return (
    <>
      <Input value={project?.title} register={register} errors={errors} required name="title" label={t('PROJECT_TITLE')} />
      <Input value={project?.acronym} register={register} errors={errors} required name="acronym" label={t('PROJECT_ACRONYM')} />
      <TextArea value={project?.description} rows={5} cols={30} register={register} errors={errors} name="description" label={t('PROJECT_DESCRIPTION')} />
    </>
  );
};

export default ProjectDetails;
