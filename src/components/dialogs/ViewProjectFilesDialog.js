import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import React from 'react';
import { useTranslation } from 'react-i18next';

const ViewProjectFilesDialog = ({ project, files, visible, setVisible }) => {
  const { t } = useTranslation();

  return (
    <Dialog
      header={t('PROJECT_FILES', { project })}
      visible={visible}
      style={{ width: '600px' }}
      closable
      modal
      onHide={() => setVisible(false)}
    >
      <div className="p-grid">
        <div className="p-col-12">
          <DataTable value={files} emptyMessage="No files were found for this project.">
            <Column header="File name" field="filename" />
            <Column
              className="p-text-right"
              body={({ url }) => (
                <Button label="Download" onClick={() => window.open(url, '_blank')} />
              )}
            />
          </DataTable>
        </div>
      </div>
    </Dialog>
  );
};

export default ViewProjectFilesDialog;
