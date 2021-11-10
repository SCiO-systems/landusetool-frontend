import React from 'react';
import { useTranslation } from 'react-i18next';
import { InputText } from 'primereact/inputtext';

const Input = ({ register, errors, name, label, value, required = false }) => {
  const { t } = useTranslation();

  return (
    <div className="p-field">
      <label htmlFor={name} className="p-d-block">{label}</label>
      <InputText
        className={errors[name]?.type === 'required' ? 'p-invalid' : ''}
        id={name}
        style={{ width: '100%' }}
        {...register(name, { required, value })}
      />
      {errors[name]?.type === 'required' && (
        <small id={`${name}-help`} className="p-error p-d-block">{t('FIELD_IS_REQUIRED')}</small>
      )}
    </div>
  );
};

export default Input;
