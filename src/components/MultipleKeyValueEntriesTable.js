import classNames from 'classnames';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const MultipleKeyValueEntriesTable = ({
  data,
  header,
  onDeleteItem,
  onAddItem,
  keyLabel = 'Key',
  valueLabel = 'Value',
  helpText,
  className,
}) => {
  const { t } = useTranslation();
  const [entry, setEntry] = useState({ key: '', value: '' });
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    onAddItem(entry);
    setEntry({ key: '', value: '' });
  };

  const onDelete = (e) => {
    onDeleteItem(e);
  };

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
          <label>{ keyLabel }</label>
          <InputTextarea
            id="key"
            value={entry.key}
            onChange={(e) => setEntry((oe) => ({ key: e.target.value, value: oe.value }))}
            rows={1}
            autoResize
            cols={50}
          />
        </div>
      </div>
      <div className="p-col-5">
        <div className="p-field">
          <label>{ valueLabel }</label>
          <InputTextarea
            id="value"
            value={entry.value}
            onChange={(e) => setEntry((oe) => ({ key: oe.key, value: e.target.value }))}
            rows={1}
            autoResize
            cols={50}
          />
        </div>
      </div>
      <div className="p-col-2 p-text-right" style={{ marginTop: '0.3rem' }}>
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
        header={headerTemplate(header)}
      >
        <Column header={keyLabel} field="key" />
        <Column header={valueLabel} field="value" />
        <Column
          body={(e) => (
            <div className="p-text-right">
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
          header={header}
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

export default MultipleKeyValueEntriesTable;
