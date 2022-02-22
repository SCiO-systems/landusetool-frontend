import React, { useState, useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

import StepNavigation from '../../components/navigation/StepNavigation';
import { getProjectFocusAreas, addProjectFocusArea, deleteProjectFocusArea } from '../../services/projects';
import { uploadProjectFile } from '../../services/files';
import { handleError } from '../../utilities/errors';
import { ToastContext, UserContext } from '../../store';

const DefineFocusAreas = ({ onForward }) => {
  const { t } = useTranslation();
  const fileUploadRef = useRef();
  const { setError, setSuccess } = useContext(ToastContext);
  const { currentProject } = useContext(UserContext);
  const [focusAreas, setFocusAreas] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [name, setName] = useState('');
  const [fileId, setFileId] = useState(null);

  const fetchFocusAreas = async () => {
    try {
      const { data } = await getProjectFocusAreas(currentProject.id);
      setFocusAreas(data);
    } catch (error) {
      setError(setError(handleError(error)));
    }
  }

  const addNewFocusArea = async (e) => {
    e.preventDefault();
    if (name === '' || fileId === null) return;
    try {
      await addProjectFocusArea(currentProject.id, name, fileId);
      await fetchFocusAreas();
      setName('');
      setFileId(null);
      fileUploadRef.current?.clear();
    } catch (error) {
      setError(setError(handleError(error)));
    }
  }

  const deleteFocusArea = async (focusAreaId) => {
    try {
      await deleteProjectFocusArea(currentProject.id, focusAreaId);
      await fetchFocusAreas();
    } catch (error) {
      setError(setError(handleError(error)));
    }
  }

  const uploadFile = async (files) => {
    // eslint-disable-next-line
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', files[0]);
    try {
      const { data } = await uploadProjectFile(currentProject.id, formData);
      setFileId(data.id);
      setSuccess('Done', 'Your file has been uploaded.');
    } catch (error) {
      setError(setError(handleError(error)));
    } finally {
      setIsUploading(false);
    }
  }

  const onContinue = async () => {
    if (focusAreas.length !== 0) {
      setError(t('NO_FOCUS_AREAS_WARNING'));
      return;
    }
    onForward();
  };


  useEffect(() => {
    fetchFocusAreas();
  }, []); // eslint-disable-line

  return (
    <>
      <div className="p-grid p-fluid p-d-flex p-my-4">
        <div className="p-col-3">
          <h4>{t('ADD_NEW_FOCUS_AREA')}</h4>
          <form onSubmit={addNewFocusArea}>
            <div className="p-formgrid p-grid">
              <div className="p-field p-col-6 p-md-6">
                <label htmlFor="name">{t('NAME')}</label>
                <InputText
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="p-field p-col-6 p-md-6">
                <label htmlFor="file">{t('FOCUS_AREA')}</label>
                <FileUpload
                  disabled={fileId !== null || isUploading}
                  id="file"
                  ref={fileUploadRef}
                  accept=".geojson,.shp"
                  chooseLabel={t('SELECT_FILE')}
                  mode="basic"
                  multiple={false}
                  customUpload
                  auto
                  uploadHandler={(event) => uploadFile(event.files)}
                />
              </div>
            </div>
            <div className="p-grid p-formgrid">
              <div className="p-field p-col-4">
                <Button
                  label={t('ADD')}
                  type="submit"
                  disabled={name === '' || fileId === null}
                  icon="pi pi-plus"
                  className="p-button-primary p-mt-2"
                />
              </div>
            </div>
          </form>
        </div>
        <div className="p-col-9">
          <DataTable
            emptyMessage={t('NO_ENTRIES')}
            value={focusAreas}
            header={t('FOCUS_AREAS')}
          >
            <Column header={t('NAME')} field="name" />
            <Column header={t('FILE')} body={(rowData) => (
              <>
                {rowData.file.filename}
                (<a href={rowData.file.url} target="_blank" rel="noreferrer">{t('DOWNLOAD_FILE')}</a>)
              </>
            )} />
            <Column
              body={(rowData) => (
                <div className="p-text-right">
                  <Button
                    className="p-button-danger"
                    icon="pi pi-trash"
                    onClick={() => deleteFocusArea(rowData.id)}
                  />
                </div>
              )}
            />
          </DataTable>
        </div>
      </div>
      <StepNavigation onForward={onContinue} />
    </>
  )
};

export default DefineFocusAreas;
