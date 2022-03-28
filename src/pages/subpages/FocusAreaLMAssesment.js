import React, { useEffect, useState, useContext } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import Loading from '../../components/Loading';
import FocusAreaQuestionnaire from '../../components/FocusAreaQuestionnaire';
import { ToastContext, UserContext } from '../../store';
import { getProjectFocusAreas, editProject } from '../../services/projects';
import { getEvaluations, addEvaluation, updatEvaluation } from '../../services/focus-area-evaluations';
import { handleError } from '../../utilities/errors';
import { findLuClassesByIds } from '../../utilities/schema-generators';

const hasEvaluation = (evaluations, focusAreaId, luClass) => {
  if (!evaluations || evaluations.length === 0) return false;

  for (let i = 0; i < evaluations.length; i += 1) {
    if (evaluations[i].project_focus_area_id === focusAreaId && evaluations[i].lu_class === luClass) {
      return true;
    }
  }

  return false;
}

const FocusAreaLMAssesment = ({ onBack }) => {
  const { t } = useTranslation();
  const { currentProject, setUser } = useContext(UserContext);
  const { setError, setSuccess } = useContext(ToastContext);
  const [evaluations, setEvaluations] = useState([]);
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFocusArea, setSelectedFocusArea] = useState(null);
  const [selectedLuClass, setSelectedLuClass] = useState(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const history = useHistory();

  const fetchData = async () => {
    try {
      const { data: focusAreasResponse } = await getProjectFocusAreas(currentProject.id);
      const { data: evaluationsResponse } = await getEvaluations(currentProject.id);
      setEvaluations(evaluationsResponse);
      if (focusAreasResponse.length === 0) {
        onBack();
        return;
      }
      setOptions(focusAreasResponse.map((focusArea) => ({
        ...focusArea,
        luClasses: findLuClassesByIds(
          focusArea.extracted_classes,
          currentProject.lu_classes,
          currentProject.uses_default_lu_classification
        ).map((lc) => ({
          ...lc,
          hasEvaluation: hasEvaluation(evaluationsResponse, focusArea.id, `${lc.value}`),
        })),
      })));

      setIsLoading(false);
    } catch (error) {
      setError(handleError(error));
    }
  };

  const saveEvaluation = async (evaluationId, data) => {
    if (selectedLuClass === null || selectedFocusArea === null) {
      // Do nothing if nothing is selected
      return;
    }

    try {
      if (selectedEvaluation === null) {
        // Add it
        await addEvaluation(currentProject.id, {
          project_focus_area_id: selectedFocusArea.id,
          lu_class: selectedLuClass,
          ...data,
        });
      } else {
        // Update it
        await updatEvaluation(currentProject.id, evaluationId, data);
      }
    } catch (error) {
      setError(handleError(error));
    } finally {
      setSuccess(t('YOUR_CHANGES_HAVE_BEEN_SAVED'));
      setSelectedFocusArea(null);
      setSelectedLuClass(null);
      setSelectedEvaluation(null);
      await fetchData();
    }
  };

  const handleSubmit = async () => {
    if (currentProject.land_management_sustainability_method) {
      history.push('/land-use-planning');
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await editProject(currentProject.id, {
        land_management_sustainability_method: true,
      });
      setUser({ currentProject: data });
      setTimeout(() => history.push('/land-use-planning'), 500);
    } catch (e) {
      setError(handleError(e));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line

  useEffect(() => {
    if (selectedFocusArea && selectedLuClass) {
      const foundEvaluation = evaluations.find((ev) => (
        ev.project_focus_area_id === selectedFocusArea.id && ev.lu_class === `${selectedLuClass}`
      ));
      setSelectedEvaluation(foundEvaluation || null);
    }
  }, [selectedFocusArea, selectedLuClass]); // eslint-disable-line

  if (isLoading) {
    return <div className="p-mt-6"><Loading /></div>;
  }

  const onFocusAreaChange = (e) => {
    setSelectedFocusArea(e.value);
    setSelectedLuClass(null);
  }

  const onLuClassChange = (e) => {
    setSelectedLuClass(e.value);
  }

  const selectedFocusAreaTemplate = (option, props) => {
    if (option) {
      let hasFinishedEvaluations = true;
      for (let i = 0; i < option.luClasses.length; i += 1) {
        if (!option.luClasses[i].hasEvaluation) {
          hasFinishedEvaluations = false;
          break;
        }
      }
      return (
        <div className="p-d-flex p-ai-center">
          {hasFinishedEvaluations
            ? <i className="p-d-block far fa-check-circle p-mr-2" />
            : <i className="p-d-block far fa-circle p-mr-2" />
          }
          <span className="p-block">{option.name}</span>
        </div>
      );
    }

    return (
      <span>
        {props.placeholder}
      </span>
    );
  }

  const focusAreaOptionTemplate = (option) => {
    let hasFinishedEvaluations = true;
    for (let i = 0; i < option.luClasses.length; i += 1) {
      if (!option.luClasses[i].hasEvaluation) {
        hasFinishedEvaluations = false;
        break;
      }
    }
    return (
      <div key={option.id} className="p-d-flex p-ai-center">
        {hasFinishedEvaluations
          ? <i className="p-d-block far fa-check-circle p-mr-2" />
          : <i className="p-d-block far fa-circle p-mr-2" />
        }
        <span className="p-block">{option.name}</span>
      </div>
    );
  };

  const selectedLuClassTemplate = (option, props) => {
    if (option) {
      return (
        <div key={option.value} className="p-d-flex p-ai-center">
          {option.hasEvaluation
            ? <i className="p-d-block far fa-check-circle p-mr-2" />
            : <i className="p-d-block far fa-circle p-mr-2" />
          }
          <span className="p-block">{option.key || option.value}</span>
        </div>
      );
    }

    return (
      <span>
        {props.placeholder}
      </span>
    );
  }

  const luClassOptionTemplate = (option) => (
    <div key={option.value} className="p-d-flex p-ai-center">
      {option.hasEvaluation
        ? <i className="p-d-block far fa-check-circle p-mr-2" />
        : <i className="p-d-block far fa-circle p-mr-2" />
      }
      <span className="p-block">{option.key || option.value}</span>
    </div>
  );

  return (
    <div className="p-mt-4">
      <div className="p-grid">
        <div className="p-col-6">
          <strong className="p-d-block p-mb-2">
            Select a focus area and then a land use type to evaluate it:
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
        <div className="p-col-6 p-d-flex p-jc-end p-ai-center">
          {((evaluations && evaluations.length > 0) &&
            (currentProject.role === 'owner' ||
              currentProject.land_management_sustainability_method)) && (
            <Button
              label={t('ANTICIPATED_NEW_LAND_DEGRADATION')}
              loading={isLoading}
              icon="fad fa-chart-line-down"
              type="button"
              onClick={() => handleSubmit()}
            />
          )}
        </div>
      </div>
      {(selectedFocusArea && selectedLuClass) && (
        <FocusAreaQuestionnaire
          evaluation={selectedEvaluation}
          canProceedToPlanning={evaluations && evaluations.length > 0}
          onSave={saveEvaluation}
        />
      )}
    </div>
  );
}

export default FocusAreaLMAssesment;
