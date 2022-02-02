import classNames from 'classnames';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { FileUpload } from 'primereact/fileupload';
import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { uploadProjectFile } from '../services/files';
import { handleError } from '../utilities/errors';
import { ToastContext } from '../store';

const CustomLuClassesTable = ({
  data,
  onDeleteItem,
  onAddItem,
  onUpdateItem,
  projectId = null,
  helpText,
  className,
}) => {
  const { t } = useTranslation();
  const [entry, setEntry] = useState({ key: '', value: '' });
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const { setError, setSuccess } = useContext(ToastContext);

  const onSubmit = (e) => {
    e.preventDefault();
    onAddItem(entry);
    setEntry({ key: '', value: '' });
  };

  const onDelete = (e) => {
    onDeleteItem(e);
  };

  const uploadFile = async (e, files) => {
    // eslint-disable-next-line
    const formData = new FormData();
    formData.append('file', files[0]);
    try {
      const { data: res } = await uploadProjectFile(projectId, formData);
      onUpdateItem({ key: e.key, value: e.value, file_id: res.id });
      setSuccess('Done', 'Your file has been uploaded.');
    } catch (error) {
      setError(setError(handleError(error)));
    }
  }

  const headerTemplate = (body) => (
    <div className="p-d-flex p-ai-center">
      <span>{body}</span>
      {helpText && helpText.length > 0 && (
        <Button
          onClick={() => setHelpDialogOpen(!helpDialogOpen)}
          icon="pi pi-question-circle"
          style={{ padding: '0 1.125rem' }}
          className="p-ml-2 p-button-rounded p-button-lg p-button-text p-button-secondary"
        />
      )}
    </div>
  );

  const footerTemplate = (
    <div className="p-formgrid p-grid p-fluid p-d-flex p-ai-center">
      <div className="p-col-5">
        <div className="p-field">
          <label htmlFor="key">{t('NAME')}</label>
          <InputText
            id="key"
            value={entry.key}
            onChange={(e) => setEntry((oe) => ({ key: e.target.value, value: oe.value }))}
          />
        </div>
      </div>
      <div className="p-col-5">
        <div className="p-field">
          <label htmlFor="value">{t('VALUE')}</label>
          <InputText
            id="value"
            value={entry.value}
            onChange={(e) => setEntry((oe) => ({ key: oe.key, value: e.target.value }))}
          />
        </div>
      </div>
      <div className="p-col-2 p-text-right" style={{ marginTop: '0.7rem' }}>
        <Button
          icon="pi pi-plus"
          disabled={entry.key.length === 0 || entry.value.length === 0}
          onClick={onSubmit}
          type="button"
          label={t('ADD_ENTRY')}
        />
      </div>
    </div>
  );

  return (
    <>
      <DataTable
        emptyMessage={t('NO_ENTRIES')}
        value={data}
        footer={footerTemplate}
        className={classNames([className])}
        header={headerTemplate(t('CUSTOM_LU_CLASSES'))}
      >
        <Column header={t('NAME')} field="key" />
        <Column header={t('VALUE')} field="value" />
        <Column
          body={(e) => (
            <div className="p-text-right">
              {e.file_id
                ? (
                  <Button
                    label={t('HAS_SUITABILITY_MAP')}
                    className="p-button-secondary p-mr-2"
                    disabled
                    icon="pi pi-check"
                  />
                ) : (
                  <FileUpload
                    accept=".geotiff,.geotif,.tiff,.tif"
                    chooseLabel={t('UPLOAD_LAND_SUITABILITY_MAP')}
                    className="p-mr-2 p-d-inline-block"
                    mode="basic"
                    multiple={false}
                    customUpload
                    auto
                    uploadHandler={(event) => uploadFile(e, event.files)}
                  />
                )}
              <Button
                className="p-button-danger"
                icon="pi pi-trash"
                onClick={() => onDelete(e)}
              />
            </div>
          )}
        />
      </DataTable>
      {helpText && helpText.length > 0 && (
        <Dialog
          header={t('CUSTOM_LU_CLASSES')}
          onHide={() => setHelpDialogOpen(false)}
          visible={helpDialogOpen}
          style={{ width: '500px', maxWidth: '90%' }}
        >
          <p style={{ lineHeight: '1.75' }}>{helpText}</p>
        </Dialog>
      )}
    </>
  );
};

export default CustomLuClassesTable;
