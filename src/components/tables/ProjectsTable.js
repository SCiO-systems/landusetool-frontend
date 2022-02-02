import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/primereact.min.css';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PROJECT_OWNER, PROJECT_USER, DRAFT, PUBLISHED, PREPROCESSING } from '../../services/projects';

const ProjectsTable = ({ title, projects, inviteToProject, goToProject, loadProject, className, deleteProject }) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('');
  const [rows, setRows] = useState(10);
  const [isDeleting, setIsDeleting] = useState(null);

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
          className="p-mr-3"
          placeholder={t('SEARCH')}
        />
      </span>
    </div>
  );

  const titleTemplate = (rowData) => (
    <>
      <div className="p-d-flex p-jc-start p-ai-center">
        {rowData.role === PROJECT_OWNER && (
          <Button
            icon="pi pi-pencil"
            className="p-button-rounded p-button-outlined p-button-icon-only p-mr-3"
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
      {(rowData.role === PROJECT_OWNER) && (rowData.status === DRAFT) && (
        <Button
          icon="pi pi-cog"
          className="p-mr-3"
          onClick={() => loadProject(rowData)}
          label={t('CONTINUE_SETUP')}
        />
      )}
      {(rowData.role === PROJECT_OWNER) && (rowData.status === PREPROCESSING) && (
        <Button
          icon="pi pi-cog"
          disabled
          className="p-mr-3 p-button-secondary"
          onClick={() => {}}
          label={t('PREPROCESSING')}
        />
      )}
      {(rowData.role === PROJECT_USER ) && (rowData.status === DRAFT || rowData.status === PREPROCESSING) && (
        <span>{t('PROJECT_UNDER_PREPARATION')}</span>
      )}
      {(rowData.status === PUBLISHED) && (
        <Button
          icon="pi pi-folder-open"
          className="p-mr-3"
          onClick={() => loadProject(rowData)}
          label={t('LOAD_PROJECT')}
        />
      )}
      {rowData.role === PROJECT_OWNER && (
        <>
          <Button
            icon="pi pi-user-plus"
            onClick={() => inviteToProject(rowData.id)}
            className="p-mr-3 p-button-secondary"
            tooltip={t('INVITE_MEMBERS_TO_PROJECT')}
            tooltipOptions={{ position: 'top' }}
            label=""
          />
          <Button
            icon="pi pi-times"
            className="p-button-danger p-mr-3"
            label=""
            loading={isDeleting === rowData.id}
            disabled={isDeleting === rowData.id}
            tooltip={t('DELETE_PROJECT')}
            tooltipOptions={{ position: 'top' }}
            onClick={() => tryToDelete(rowData.id)}
          />
        </>
      )}
    </div>
  );

  return (
    <DataTable
      header={tableHeader}
      globalFilter={filter}
      paginator
      rows={rows}
      rowsPerPageOptions={[10, 20, 50]}
      emptyMessage={t('NO_PROJECTS_FOUND')}
      value={projects}
      onPage={(event) => setRows(event.rows)}
      className={className}
    >
      <Column
        header={t('PROJECT_TITLE')}
        sortable
        body={titleTemplate}
      />
      <Column
        field="acronym"
        header={t('PROJECT_ACRONYM')}
        sortable
      />
      <Column
        field="description"
        header={t('PROJECT_DESCRIPTION')}
        sortable
      />
      <Column header={t('ACTIONS')} body={actionsTemplate} />
    </DataTable>
  );
};

export default ProjectsTable;

