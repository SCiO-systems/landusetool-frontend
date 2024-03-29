import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { RadioButton } from 'primereact/radiobutton';
import { TabPanel, TabView } from 'primereact/tabview';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import CustomLuClassesTable from '../components/CustomLuClassesTable';
import Loading from '../components/Loading';
import { uploadProjectFile } from '../services/files';
import {
  editProject,
  finaliseProject,
  getProject,
  getUrlForStep,
  PROJECT_STEPS,
} from '../services/projects';
import { ToastContext, UserContext } from '../store';
import { handleError } from '../utilities/errors';

const ProjectDatasets = () => {
  const { t } = useTranslation();
  // const { id, step } = useParams();
  const { id } = useParams();
  const history = useHistory();
  const { register, handleSubmit, setValue, getValues } = useForm();
  // const customLandDegradationMap = useRef(null);
  const customLandUseMap = useRef(null);
  const [project, setProject] = useState(null);
  // const [topTabIndex, setTopTabIndex] = useState(parseInt(step, 10));
  // const [topTabIndex, setTopTabIndex] = useState(0);
  const [luClasses, setLuClasses] = useState([]);
  const [useDefaultLuClasses, setUseDefaultLuClasses] = useState(true);
  // const [useDefaultLandDegradationMap, setUseDefaultLandDegradationMap] = useState(true);
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
          // step: PROJECT_STEPS.DATASETS_LAND_DEGRADATION,
          step: PROJECT_STEPS.COMPLETED,
          uses_default_lu_classification: data.defaultLuClasses,
          land_use_map_file_id: data.customLandUseMap,
          lu_classes: (!data.defaultLuClasses) ? data.luClasses : [],
          // The following is explicitely set here because we hide step 1
          custom_land_degradation_map_file_id: null,
        });
        // Move to next tab if this step is completed
        // setTopTabIndex(1);
        // it's done, let's finalise it
        await finaliseProject(id);
        history.push(`/`);
      } else if (dataset === 'land_degradation') {
        await editProject(id, {
          custom_land_degradation_map_file_id: data.customLandDegradationMap,
          step: PROJECT_STEPS.COMPLETED,
        });
        // it's done, let's finalise it
        await finaliseProject(id);
        history.push(`/`);
      }
      setSuccess('Success', 'Project details have been updated.');
    } catch (e) {
      setError(handleError(e));
    }
  };

  // const uploadLandDegradationMap = async (file) => {
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   try {
  //     const { data } = await uploadProjectFile(id, formData);
  //     setValue('customLandDegradationMap', data.id);
  //     setSuccess('Done', 'Your file has been uploaded.');
  //   } catch (error) {
  //     setError(setError(handleError(error)));
  //   }
  // };

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
    setValue('luClasses', luClasses);
  }, [luClasses, setValue]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await getProject(id);
        if (data.step === null || ![PROJECT_STEPS.DATASETS_LAND_USE, PROJECT_STEPS.DATASETS_LAND_DEGRADATION].includes(data.step)) {
          history.push(getUrlForStep(id, data.step));
          return;
        }
        setProject(data);
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
  };

  if (project === null) {
    return <Loading />;
  }

  return (
    <div className="layout-dashboard">
      <Card>
        <TabView>
          <TabPanel
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
                    setLuClasses([]);
                    setValue('defaultLuClasses', true);
                  }}
                  checked={useDefaultLuClasses}
                />
                <label htmlFor="defaultLuClasses">
                  {t('USE_DEFAULT_LU_CLASSIFICATION')}
                  &nbsp;(
                  <a
                    rel="noreferrer"
                    target="_blank"
                    href="https://data.apps.fao.org/map/catalog/srv/eng/catalog.search#/metadata/fc32c5de-440c-46aa-9cad-81f4c8b84c6a">
                    FAO/LADA
                  </a>)
                </label>
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
                  <p>{t('CUSTOM_LU_CLASSES_MESSAGE')}</p>
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
                  <CustomLuClassesTable
                    className="p-mt-4"
                    hasFiles
                    projectId={id}
                    data={luClasses}
                    onAddItem={(entry) => setLuClasses([...luClasses, entry])}
                    onUpdateItem={(entry) => {
                      setLuClasses((oldLC) => {
                        const index = oldLC.findIndex((lc) => lc.key === entry.key);
                        oldLC[index] = entry;
                        return [...oldLC];
                      });
                    }}
                    onDeleteItem={(entry) => {
                      setLuClasses(luClasses.filter((lc) => lc.key !== entry.key));
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
        </TabView>
      </Card>
    </div>
  );
};

export default ProjectDatasets;
