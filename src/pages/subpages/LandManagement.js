import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import EconWocatDialog from '../../components/dialogs/EconWocatDialog';

import FocusAreaQuestionnaire from '../../components/FocusAreaQuestionnaire';
import SingleWocatTechnology from '../../components/SingleWocatTechnology';
import { getEvaluations } from '../../services/focus-area-evaluations';
import { getEconWocatTechnology, getWocatTechnologies } from '../../services/landuse';
import {
  getProjectFocusAreas,
  getProjectWocatTechnologies,
  proposeProjectWocatTechnology,
  rejectProjectWocatTechnology,
  voteProjectWocatTechnology,
} from '../../services/projects';
import { ToastContext, UserContext } from '../../store';
import { handleError } from '../../utilities/errors';
import { findLuClassesByIds } from '../../utilities/schema-generators';

const findEvaluation = (evaluations, focusAreaId, luClass) => {
  if (!evaluations || evaluations.length === 0) return null;

  for (let i = 0; i < evaluations.length; i += 1) {
    if (
      evaluations[i].project_focus_area_id === focusAreaId &&
      evaluations[i].lu_class === luClass
    ) {
      return evaluations[i];
    }
  }

  return null;
};

const LandManagement = () => {
  const { t } = useTranslation();
  const { setError, setSuccess } = useContext(ToastContext);
  const { currentProject, id: userId } = useContext(UserContext);
  const [selectedFocusArea, setSelectedFocusArea] = useState(null);
  const [selectedLuClass, setSelectedLuClass] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectionEvaluated, setSelectionEvaluated] = useState(false);
  const [selectionEvaluation, setSelectionEvaluation] = useState(null);

  // Chunk size for each search.
  const ITEMS_CHUNK_SIZE = 10;

  // State related.
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTechnology, setIsLoadingTechnology] = useState(false);

  // Search related.
  const [keyword, setKeyword] = useState('');

  // Pagination.
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  // Data.
  const [technologies, setTechnologies] = useState([]);
  const [chosenTechnology, setChosenTechnology] = useState(null);
  const [selectedTechnology, setSelectedTechnology] = useState(null);

  // Economical data for Wocat.
  const [econTechData, setEconTechData] = useState(null);
  const [econDialogOpen, setEconDialogOpen] = useState(false);

  const showEconInfoDialog = async (techId) => {
    const id = techId.toString().replace('technologies_', '');
    setEconDialogOpen(true);
    getEconWocatTechnology(id).then(({ data }) => setEconTechData(data));
  };

  const onSearch = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await getWocatTechnologies(
        keyword,
        currentPage * ITEMS_CHUNK_SIZE,
        ITEMS_CHUNK_SIZE
      );
      setTechnologies(data?.items || []);
      setTotal(data?.total || 0);
    } catch (error) {
      setError(handleError(error));
    }
    setIsLoading(false);
  };

  const resetState = () => {
    setSelectedFocusArea(null);
    setSelectedLuClass(null);
    setSelectedTechnology(null);
    setSelectionEvaluation(null);
    setSelectionEvaluated(false);
  };

  const onPropose = async (_evaluationId, evaluationValues) => {
    if (selectedTechnology === null) {
      // How does he get here?
      resetState();
      return;
    }
    try {
      setIsLoading(true);
      await proposeProjectWocatTechnology(
        currentProject.id,
        selectedTechnology?.techId,
        selectedFocusArea.id,
        selectedLuClass,
        evaluationValues
      );
      setSuccess('Done', 'Your proposal has been saved for this focus area and land use.');
      resetState();
    } catch (error) {
      setError(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const onVote = async () => {
    if (!chosenTechnology) return;
    try {
      setIsLoading(true);
      await voteProjectWocatTechnology(currentProject.id, chosenTechnology.id);
      setSuccess('Done', 'Your vote has been saved for this focus area and land use.');
      resetState();
    } catch (error) {
      setError(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const onReject = async () => {
    if (!chosenTechnology) return;
    try {
      setIsLoading(true);
      await rejectProjectWocatTechnology(currentProject.id, chosenTechnology.id);
      setSuccess('Done', 'This proposal has been rejected.');
      resetState();
    } catch (error) {
      setError(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFocusAreaAndEvaludationsData = async () => {
    try {
      const { data: focusAreasResponse } = await getProjectFocusAreas(currentProject.id);
      const { data: evaluationsResponse } = await getEvaluations(currentProject.id);
      setOptions(
        focusAreasResponse.map((focusArea) => ({
          ...focusArea,
          luClasses: findLuClassesByIds(
            focusArea.extracted_classes,
            currentProject.lu_classes,
            currentProject.uses_default_lu_classification
          ).map((lc) => ({
            ...lc,
            evaluation: findEvaluation(evaluationsResponse, focusArea.id, `${lc.value}`),
          })),
        }))
      );
    } catch (error) {
      setError(handleError(error));
    }
  };

  const getProjectTechnologies = async (filters = {}) => {
    try {
      setIsLoadingTechnology(true);
      const { data } = await getProjectWocatTechnologies(currentProject?.id, { ...filters });
      if (data && data.length) {
        setChosenTechnology(data[0]);
      } else {
        setChosenTechnology(null);
      }
    } catch (error) {
      setChosenTechnology(null);
      setError(handleError(error));
    } finally {
      setIsLoadingTechnology(false);
    }
  };

  useEffect(() => {
    if (currentProject) {
      fetchFocusAreaAndEvaludationsData();
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    if (keyword !== '') {
      onSearch();
    }
  }, [currentPage]); // eslint-disable-line

  useEffect(() => {
    if (selectedFocusArea) {
      const luClass = selectedFocusArea.luClasses.find((lu) => lu.value === selectedLuClass);
      if (luClass) {
        setSelectionEvaluated(luClass.evaluation !== null);
        if (luClass.evaluation) {
          getProjectTechnologies({
            project_focus_area_id: selectedFocusArea.id,
            lu_class: luClass.value,
          });
          setSelectionEvaluation(luClass.evaluation);
        }
      }
    }
  }, [selectedLuClass]); // eslint-disable-line

  const header = (
    <div className="p-grid p-formgrid">
      <div className="p-col-6 p-d-flex p-ai-center">
        <h5 className="p-mb-0">{t('APPLICABLE_WOCAT_SLM_TECHNOLOGIES')}</h5>
      </div>
      <div className="p-col-6">
        <form onSubmit={onSearch}>
          <div className="p-grid p-formgrid p-fluid">
            <label className="p-col-2 p-d-flex p-ai-center p-jc-end" htmlFor="keyword">
              {t('SEARCH')}:
            </label>
            <div className="p-col-10">
              <span className="p-input-icon-right">
                <i className="pi pi-search p-pr-1" />
                <InputText
                  value={keyword}
                  placeholder={t('ENTER_KEYWORD')}
                  id="keyword"
                  disabled={isLoading}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  const itemTemplate = (tech) => (
    <div className="p-col-12">
      <div className="p-d-flex p-ai-center">
        <div className="p-col-2 p-text-center">
          <img
            style={{ width: '250px', maxWidth: '100%' }}
            src={tech?.images[0]?.url}
            alt={tech?.images[0]?.caption}
          />
        </div>
        <div className="p-col-8">
          <div className="p-px-4">
            <a href={tech?.url || '#'} target="_blank" rel="noreferrer noopener">
              <h5>
                {tech?.name || ''} - {tech?.location || ''}
              </h5>
            </a>
            <p className="p-pr-4">{tech?.definition || ''}</p>
            <div className="p-grid">
              <span className="p-col">
                <a
                  className="p-d-flex p-ai-center"
                  href={tech?.map_url || '#'}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <i className="pi pi-map-marker" />
                  <span className="p-ml-2">
                    {tech?.location || 'N/A'}, {tech?.province || 'N/A'}
                  </span>
                </a>
              </span>
            </div>
          </div>
        </div>
        <div className="p-col-2">
          <Button
            label="Select"
            onClick={() => setSelectedTechnology({ techId: tech?.id, label: tech?.name })}
            icon="pi pi-check"
          />
          {tech.econ_wocat && (
            <Button
              tooltip="Costs and Benefits of SLM Technologies"
              className="p-button-success p-ml-2"
              onClick={() => showEconInfoDialog(tech.id)}
              icon="fa fa-duotone fa-calculator"
              tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
            />
          )}
        </div>
      </div>
    </div>
  );

  const onFocusAreaChange = (e) => {
    setSelectedFocusArea(e.value);
    setSelectedLuClass(null);
    setChosenTechnology(null);
  };

  const onLuClassChange = (e) => {
    setSelectedLuClass(e.value);
  };

  const selectedFocusAreaTemplate = (option, props) => {
    if (option) {
      let hasFinishedEvaluations = true;
      for (let i = 0; i < option.luClasses.length; i += 1) {
        if (!option.luClasses[i].evaluation) {
          hasFinishedEvaluations = false;
          break;
        }
      }
      return (
        <div className="p-d-flex p-ai-center">
          {hasFinishedEvaluations ? (
            <i className="p-d-block far fa-check-circle p-mr-2" />
          ) : (
            <i className="p-d-block far fa-circle p-mr-2" />
          )}
          <span className="p-block">{option.name}</span>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const focusAreaOptionTemplate = (option) => {
    let hasFinishedEvaluations = true;
    for (let i = 0; i < option.luClasses.length; i += 1) {
      if (!option.luClasses[i].evaluation) {
        hasFinishedEvaluations = false;
        break;
      }
    }
    return (
      <div key={option.id} className="p-d-flex p-ai-center">
        {hasFinishedEvaluations ? (
          <i className="p-d-block far fa-check-circle p-mr-2" />
        ) : (
          <i className="p-d-block far fa-circle p-mr-2" />
        )}
        <span className="p-block">{option.name}</span>
      </div>
    );
  };

  const selectedLuClassTemplate = (option, props) => {
    if (option) {
      return (
        <div key={option.value} className="p-d-flex p-ai-center">
          {option.evaluation !== null ? (
            <i className="p-d-block far fa-check-circle p-mr-2" />
          ) : (
            <i className="p-d-block far fa-circle p-mr-2" />
          )}
          <span className="p-block">{option.key || option.value}</span>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const luClassOptionTemplate = (option) => (
    <div key={option.value} className="p-d-flex p-ai-center">
      {option.evaluation !== null ? (
        <i className="p-d-block far fa-check-circle p-mr-2" />
      ) : (
        <i className="p-d-block far fa-circle p-mr-2" />
      )}
      <span className="p-block">{option.key || option.value}</span>
    </div>
  );

  return (
    <>
      <div className="p-grid">
        <div className="p-col-6">
          <strong className="p-d-block p-mb-2">
            Select a focus area and then a land use type to select a WOCAT technology:
          </strong>
          <Dropdown
            className="p-mr-2"
            value={selectedFocusArea}
            options={options}
            onChange={onFocusAreaChange}
            optionLabel="name"
            placeholder="Select a focus area"
            valueTemplate={selectedFocusAreaTemplate}
            itemTemplate={focusAreaOptionTemplate}
          />
          {selectedFocusArea && (
            <Dropdown
              className="p-mr-2"
              value={selectedLuClass}
              options={selectedFocusArea.luClasses}
              onChange={onLuClassChange}
              optionLabel="value"
              optionValue="value"
              placeholder="Select a land use type"
              valueTemplate={selectedLuClassTemplate}
              itemTemplate={luClassOptionTemplate}
            />
          )}
        </div>
        {selectedTechnology !== null && (
          <div className="p-col-6 p-text-right">
            <strong className="p-d-block p-mb-2">{selectedTechnology?.label}.</strong>
            <Button
              icon="pi pi-arrow-circle-left"
              className="p-mb-2 p-button-secondary"
              onClick={() => setSelectedTechnology(null)}
              label="Search for a different technology"
            />
          </div>
        )}
      </div>
      {selectedFocusArea && selectedLuClass && !selectionEvaluated && (
        <Message
          severity="warn"
          text="The selected land use hasn't been evaluated from you yet. Please evaluate it first in the
          Current State menu, then come back here."
          className="p-mt-2"
        />
      )}
      {selectedFocusArea &&
        selectedLuClass &&
        selectionEvaluated &&
        chosenTechnology === null &&
        selectedTechnology !== null &&
        !isLoadingTechnology && (
          <FocusAreaQuestionnaire
            evaluation={null}
            onSave={onPropose}
            showFinalQuestion={false}
            comparingEvaluation={selectionEvaluation}
            isForProposal
          />
        )}
      {selectedFocusArea &&
        selectedLuClass &&
        selectionEvaluated &&
        chosenTechnology === null &&
        selectedTechnology === null &&
        !isLoadingTechnology && (
          <DataView
            paginator
            rows={ITEMS_CHUNK_SIZE}
            totalRecords={total}
            lazy
            paginatorPosition="both"
            first={currentPage * ITEMS_CHUNK_SIZE}
            value={technologies}
            onPage={(e) => setCurrentPage(e?.page || 0)}
            header={header}
            itemTemplate={itemTemplate}
            loading={isLoading}
            emptyMessage={t('NO_WOCAT_TECHNOLOGIES_FOUND')}
          />
        )}
      {selectedFocusArea && selectedLuClass && selectionEvaluated && chosenTechnology && (
        <SingleWocatTechnology
          techId={chosenTechnology?.technology_id}
          isOwnProposal={chosenTechnology?.user?.id === userId}
          proposerEvaluation={chosenTechnology?.evaluation}
          selfEvaluation={selectionEvaluation}
          isFinal={chosenTechnology?.status === 'final'}
          onReject={onReject}
          onVote={onVote}
        />
      )}
      <EconWocatDialog
        techData={econTechData}
        setTechData={setEconTechData}
        visible={econDialogOpen}
        setVisible={setEconDialogOpen}
      />
    </>
  );
};

export default LandManagement;
