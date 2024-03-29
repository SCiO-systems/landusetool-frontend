import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/primereact.min.css';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getProjectFiles } from '../../services/files';
import {
  DRAFT,
  getProjectFocusAreas,
  PREPROCESSING,
  PROJECT_OWNER,
  PROJECT_USER,
  PUBLISHED,
} from '../../services/projects';
import ViewProjectFilesDialog from '../dialogs/ViewProjectFilesDialog';

const ProjectsTable = ({
  title,
  projects,
  inviteToProject,
  goToProject,
  loadProject,
  className,
  deleteProject,
}) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('');
  const [isDeleting, setIsDeleting] = useState(null);
  const [viewFilesDialog, setViewFilesDialog] = useState({
    visible: false,
    project: null,
    files: [],
  });

  const tryToDelete = async (projectId) => {
    setIsDeleting(projectId);
    try {
      await deleteProject(projectId);
    } finally {
      setIsDeleting(null);
    }
  };

  const tableHeader = (
    <div className="p-d-flex p-flex-row p-jc-between p-ai-center">
      <h4 className="p-my-0 p-text-capitalize">{title}</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-mr-2"
          placeholder={t('SEARCH')}
        />
      </span>
    </div>
  );

  const titleTemplate = (rowData) => (
    <>
      <div className="p-d-flex p-jc-start p-ai-center">
        {rowData.role === PROJECT_OWNER && rowData.status === DRAFT && (
          <Button
            icon="pi pi-pencil"
            className="p-button-rounded p-button-outlined p-button-icon-only p-mr-2"
            label=""
            onClick={() => goToProject(rowData.id)}
          />
        )}
        <div>{rowData.title}</div>
      </div>
    </>
  );

  const actionsTemplate = (rowData) => (
    <div>
      {rowData.role === PROJECT_OWNER && rowData.status === DRAFT && (
        <Button
          icon="pi pi-cog"
          className="p-mr-2 p-mb-2"
          onClick={() => loadProject(rowData)}
          style={{ width: '160px' }}
          label={t('CONTINUE_SETUP')}
        />
      )}
      {rowData.role === PROJECT_OWNER && rowData.status === PREPROCESSING && (
        <Button
          icon="pi pi-cog"
          disabled
          className="p-mr-2 p-mb-2 p-button-secondary"
          onClick={() => {}}
          label={t('PREPROCESSING')}
        />
      )}
      {rowData.role === PROJECT_USER &&
        (rowData.status === DRAFT || rowData.status === PREPROCESSING) && (
          <span>{t('PROJECT_UNDER_PREPARATION')}</span>
        )}
      {rowData.status === PUBLISHED && (
        <Button
          icon="pi pi-folder-open"
          className="p-mr-2 p-mb-2"
          onClick={() => loadProject(rowData)}
          style={{ width: '160px' }}
          label={t('LOAD_PROJECT')}
        />
      )}
      {rowData.role === PROJECT_OWNER && (
        <Button
          icon="pi pi-user-plus"
          onClick={() => inviteToProject(rowData.id)}
          className="p-mr-2 p-mb-2 p-button-secondary"
          tooltip={t('INVITE_MEMBERS_TO_PROJECT')}
          tooltipOptions={{ position: 'top' }}
          label=""
        />
      )}
      {rowData.status === PUBLISHED && (
        <Button
          icon="pi pi-file"
          className="p-button-success p-mb-2 p-mr-2"
          tooltip={t('VIEW_PROJECT_FILES')}
          tooltipOptions={{ position: 'top' }}
          onClick={() => {
            Promise.all([getProjectFiles(rowData.id), getProjectFocusAreas(rowData.id)]).then(
              ([files, focusAreas]) => {
                const focusAreasFileIds = focusAreas.data.map(({ file }) => file.id);
                const filteredFiles = files.data.filter(({ id }) => !focusAreasFileIds.includes(id));
                setViewFilesDialog({ visible: true, files: filteredFiles, project: rowData });
              }
            );
          }}
        />
      )}
      {rowData.role === PROJECT_OWNER && (
        <Button
          icon="pi pi-times"
          className="p-button-danger p-mb-2 p-mr-2"
          loading={isDeleting === rowData.id}
          disabled={isDeleting === rowData.id}
          tooltip={t('DELETE_PROJECT')}
          tooltipOptions={{ position: 'top' }}
          onClick={() => tryToDelete(rowData.id)}
        />
      )}
    </div>
  );

  return (
    <>
      <DataTable
        header={tableHeader}
        globalFilter={filter}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 20, 50]}
        totalRecords={projects.length}
        emptyMessage={t('NO_PROJECTS_FOUND')}
        value={projects}
        className={className}
      >
        <Column header={t('PROJECT_TITLE')} sortable body={titleTemplate} />
        <Column field="acronym" header={t('PROJECT_ACRONYM')} sortable />
        <Column field="description" header={t('PROJECT_DESCRIPTION')} sortable />
        <Column header={t('ACTIONS')} body={actionsTemplate} />
      </DataTable>
      <ViewProjectFilesDialog
        visible={viewFilesDialog.visible}
        setVisible={(visible) => setViewFilesDialog({ ...viewFilesDialog, visible })}
        project={viewFilesDialog.project}
        files={viewFilesDialog.files}
      />
    </>
  );
};

export default ProjectsTable;
