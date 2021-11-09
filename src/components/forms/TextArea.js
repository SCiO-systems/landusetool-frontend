import React from 'react';
import { useTranslation } from 'react-i18next';
import { InputTextarea } from 'primereact/inputtextarea';

const TextArea = ({ rows, cols, register, errors, name, label, required = false }) => {
  const { t } = useTranslation();

  return (
    <div className="p-field">
      <label htmlFor={name} className="p-d-block">{label}</label>
      <InputTextarea
        className={errors[name]?.type === 'required' ? 'p-invalid' : ''}
        rows={rows}
        cols={cols}
        autoResize
        id={name}
        style={{ width: '100%' }}
        {...register(name, { required })}
      />
      {errors[name]?.type === 'required' && (
        <small id={`${name}-help`} className="p-error p-d-block">{t('FIELD_IS_REQUIRED')}</small>
      )}
    </div>
  );
};

export default TextArea;
