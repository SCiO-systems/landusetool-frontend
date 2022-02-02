import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { TabPanel, TabView } from 'primereact/tabview';
import React, { useState, useContext, useEffect, useRef } from 'react';
import { RadioButton } from 'primereact/radiobutton';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams, useHistory } from 'react-router-dom';

import { uploadProjectFile } from '../services/files';
import { ToastContext, UserContext } from '../store';
import { handleError } from '../utilities/errors';
import { editProject, getProject, finaliseProject, getUrlForStep, getNextStep, PROJECT_STEPS } from '../services/projects';
import Loading from '../components/Loading';
import MultipleKeyValueEntriesTable from '../components/MultipleKeyValueEntriesTable';

const ProjectDatasets = () => {
  const { t } = useTranslation();
  const { id, step } = useParams();
  const history = useHistory();
  const { register, handleSubmit, setValue, getValues } = useForm();
  const customLandDegradationMap = useRef(null);
  const customLandUseMap = useRef(null);
  const [project, setProject] = useState(null);
  const [topTabIndex, setTopTabIndex] = useState(parseInt(step, 10));
  const [luClasses, setLuClasses] = useState([]);
  const [useDefaultLuClasses, setUseDefaultLuClasses] = useState(true);
  const [useDefaultLandDegradationMap, setUseDefaultLandDegradationMap] = useState(true);
  const { setError, setSuccess } = useContext(ToastContext);
  const { setUser } = useContext(UserContext);

  register('customLandDegradationMap', { value: null });
  register('customLandUseMap', { value: null });
  register('defaultLuClasses', { value: true });
  register('luClasses', { required: false });

  const onSubmit = async (dataset, data) => {
    try {
      if (dataset === 'land_use') {
        await editProject(id, {
          step: PROJECT_STEPS.DATASETS_LAND_DEGRADATION,
          uses_default_lu_classification: data.defaultLuClasses,
          land_use_map_file_id: data.customLandUseMap,
          lu_classes: luClasses,
        });
        // Move to next tab if this step is completed
        setTopTabIndex(1);
      } else if (dataset === 'land_degradation') {
        await editProject(id, {
          custom_land_degradation_map_file_id: data.customLandDegradationMap,
          step: PROJECT_STEPS.COMPLETED,
        });
        // it's done, let's finalise it
        await finaliseProject(id);
        setUser({ currentProject: null });
        setTimeout(() => history.push(`/`), 500);
      }
      setSuccess('Woohoo!', 'Project details have been updated.');
    } catch (e) {
      setError(handleError(e));
    }
  };

  const uploadLandDegradationMap = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const { data } = await uploadProjectFile(id, formData);
      setValue('customLandDegradationMap', data.id);
      setSuccess('Done', 'Your file has been uploaded.');
    } catch (error) {
      setError(setError(handleError(error)));
    }
  };

  const uploadLandUseMap = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const { data } = await uploadProjectFile(id, formData);
      setValue('customLandUseMap', data.id);
      setSuccess('Done', 'Your file has been uploaded.');
    } catch (error) {
      setError(setError(handleError(error)));
    }
  };

  useEffect(() => {
    setValue('luClasses', JSON.stringify(luClasses));
  }, [luClasses, setValue]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await getProject(id);
        setProject(data);
        if (data.step === null) {
          history.push(getUrlForStep(id, getNextStep(data)));
        }
        setUser({ currentProject: data });
      } catch (e) {
        setError(handleError(e));
      }
    };
    fetchProject();
  }, [id, setError, history]); // eslint-disable-line

  const isDisabled = () => {
    if (!useDefaultLuClasses) {
      // if custom LU classes we should have a land use map
      if (getValues('customLandUseMap') === null) {
        return true;
      }

      // if custom LU classes we should have at least one suitability map
      if (luClasses.length === 0) {
        return true;
      }

      // if we find at least one suitability map we should allow submission
      for (const luc of luClasses) {
        if (luc.file_id) {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  if (project === null) {
    return <Loading />;
  }

  return (
    <div className="layout-dashboard">
      <Card>
        <TabView activeIndex={topTabIndex} onTabChange={(e) => setTopTabIndex(e.index)}>
          <TabPanel
            disabled={project.step === PROJECT_STEPS.DATASETS_LAND_DEGRADATION && topTabIndex !== 0}
            header={
              <span>
                <i className="fad fa-th p-mr-2" />
                {t('LAND_USE')}
              </span>
            }
          >
            <form onSubmit={handleSubmit((data) => onSubmit('land_use', data))}>
              <div className="p-field-radiobutton">
                <RadioButton
                  inputId="defaultLuClasses"
                  value="true"
                  name="defaultLuClasses"
                  onChange={() => {
                    setUseDefaultLuClasses(true);
                    setValue('defaultLuClasses', true);
                  }}
                  checked={useDefaultLuClasses}
                />
                <label htmlFor="defaultLuClasses">{t('USE_DEFAULT_LU_CLASSIFICATION')}</label>
              </div>
              <div className="p-field-radiobutton">
                <RadioButton
                  inputId="defaultLuClasses"
                  value="false"
                  name="defaultLuClasses"
                  onChange={() => {
                    setUseDefaultLuClasses(false);
                    setValue('defaultLuClasses', false);
                  }}
                  checked={!useDefaultLuClasses}
                />
                <label htmlFor="defaultLuClasses">{t('USE_CUSTOM_LU_CLASSIFICATION')}</label>
              </div>
              {!useDefaultLuClasses && (
                <>
                  <p>
                    {t('CUSTOM_LU_CLASSES_MESSAGE')}
                  </p>
                  {getValues('customLandUseMap') === null && (
                    <>
                      <input
                        className="hidden"
                        type="file"
                        multiple={false}
                        accept=".geotiff,.geotif,.tiff,.tif"
                        ref={customLandUseMap}
                        onChange={(e) => uploadLandUseMap(e.target.files[0])}
                      />
                      <Button
                        label={t('UPLOAD_LAND_USE_MAP')}
                        icon="pi pi-image"
                        type="button"
                        className="p-mr-2 p-mt-4 p-d-block"
                        onClick={() => {
                          customLandUseMap.current.click();
                        }}
                      />
                    </>
                  )}
                  <MultipleKeyValueEntriesTable
                    className="p-mt-4"
                    hasFiles
                    fileLabel={t('UPLOAD_LAND_SUITABILITY_MAP')}
                    projectId={id}
                    keyLabel={t('NAME')}
                    valueLabel={t('VALUE')}
                    header={t('CUSTOM_LU_CLASSES')}
                    data={luClasses}
                    onAddItem={(entry) =>
                      setLuClasses(
                        [...luClasses, entry]
                      )
                    }
                    onDeleteItem={(entry) => {
                      setLuClasses(
                        luClasses.filter((lc) => lc.key !== entry.key)
                      );
                    }}
                  />
                </>
              )}
              <Button
                className="p-button-lg p-mt-4"
                type="submit"
                disabled={isDisabled()}
                label={t('SAVE_CHANGES')}
                icon="pi pi-save"
              />
            </form>
          </TabPanel>
          <TabPanel
            disabled={project.step === PROJECT_STEPS.DATASETS_LAND_USE && topTabIndex !== 1}
            header={
              <span>
                <i className="fad fa-recycle p-mr-2" />
                {t('LAND_DEGRADATION')}
              </span>
            }
          >
            <form onSubmit={handleSubmit((data) => onSubmit('land_degradation', data))}>
              <div className="p-field-radiobutton">
                <RadioButton
                  inputId="defaultLandDegradationMap"
                  value="true"
                  name="defaultLandDegradationMap"
                  onChange={() => {
                    setUseDefaultLandDegradationMap(true);
                    setValue('defaultLandDegradationMap', true);
                  }}
                  checked={useDefaultLandDegradationMap}
                />
                <label htmlFor="defaultLandDegradationMap">
                  {t('USE_DEFAULT_DATA')}
                  (<a
                    href="https://github.com/ConservationInternational/trends.earth"
                    target="_blank"
                    rel="noreferrer">
                    Trends.Earth
                  </a>)
                </label>
              </div>
              <div className="p-field-radiobutton">
                <RadioButton
                  inputId="defaultLandDegradationMap"
                  value="false"
                  name="defaultLandDegradationMap"
                  onChange={() => {
                    setUseDefaultLandDegradationMap(false);
                    setValue('defaultLandDegradationMap', false);
                  }}
                  checked={!useDefaultLandDegradationMap}
                />
                <label htmlFor="defaultLandDegradationMap">
                  {t('USE_CUSTOM_LAND_DEGRADATION_MAP')}
                </label>
              </div>
              {!useDefaultLandDegradationMap && (
                <>
                  <input
                    className="hidden"
                    type="file"
                    multiple={false}
                    ref={customLandDegradationMap}
                    onChange={(e) => uploadLandDegradationMap(e.target.files[0])}
                  />
                  <Button
                    label={t('UPLOAD_LAND_DEGRADATION_MAP')}
                    icon="pi pi-image"
                    type="button"
                    className="p-mr-2 p-mb-4 p-d-block"
                    onClick={() => {
                      customLandDegradationMap.current.click();
                    }}
                  />
                </>
              )}
              <Button
                className="p-button-lg"
                type="submit"
                disabled={
                  (!useDefaultLandDegradationMap)
                  ? (getValues('customLandDegradationMap') === null)
                  : false
                }
                label={t('SAVE_CHANGES')}
                icon="pi pi-save"
              />
            </form>
          </TabPanel>
        </TabView>
      </Card>
    </div>
  );
};

export default ProjectDatasets;
