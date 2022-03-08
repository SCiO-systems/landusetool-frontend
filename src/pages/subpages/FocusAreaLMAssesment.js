import React, { useEffect, useState, useContext } from 'react';
import { Dropdown } from 'primereact/dropdown';

import Loading from '../../components/Loading';
import FocusAreaQuestionnaire from '../../components/FocusAreaQuestionnaire';
import { ToastContext, UserContext } from '../../store';
import { getProjectFocusAreas } from '../../services/projects';
import { getEvaluations } from '../../services/focus-area-evaluations';
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
  const { currentProject } = useContext(UserContext);
  const { setError, setSuccess } = useContext(ToastContext);
  const [evaluations, setEvaluations] = useState([]);
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFocusArea, setSelectedFocusArea] = useState(null);
  const [selectedLuClass, setSelectedLuClass] = useState(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);

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
          hasEvaluation: hasEvaluation(evaluationsResponse, focusArea.id, lc.key),
        })),
      })));

      setIsLoading(false);
    } catch (error) {
      setError(setError(handleError(error)));
    }
  }

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line

  useEffect(() => {
    if (selectedFocusArea && selectedLuClass) {
      const foundEvaluation = evaluations.find((ev) => (
        ev.project_focus_area_id === selectedFocusArea.id && ev.lu_class === selectedLuClass
      ));
      if (foundEvaluation) {
        setSelectedEvaluation(foundEvaluation);
      }
    }
  }, [selectedFocusArea, selectedLuClass]); // eslint-disable-line

  if (isLoading) {
    return <div className="p-mt-6"><Loading /></div>;
  }

  const onFocusAreaChange = (e) => {
    setSelectedFocusArea(e.value);
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
            ? <i className="p-d-block pi pi-check p-mr-2" />
            : <i className="p-d-block pi pi-times p-mr-2" />
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
      <div className="p-d-flex p-ai-center">
        {hasFinishedEvaluations
          ? <i className="p-d-block pi pi-check p-mr-2" />
          : <i className="p-d-block pi pi-times p-mr-2" />
        }
        <span className="p-block">{option.name}</span>
      </div>
    );
  };

  const selectedLuClassTemplate = (option, props) => {
    if (option) {
      return (
        <div className="p-d-flex p-ai-center">
          {option.hasEvaluation
            ? <i className="p-d-block pi pi-check p-mr-2" />
            : <i className="p-d-block pi pi-times p-mr-2" />
          }
          <span className="p-block">{option.value}</span>
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
    <div className="p-d-flex p-ai-center">
      {option.hasEvaluation
        ? <i className="p-d-block pi pi-check p-mr-2" />
        : <i className="p-d-block pi pi-times p-mr-2" />
      }
      <span className="p-block">{option.value}</span>
    </div>
  );

  return (
    <div className="p-mt-4">
      <div>
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
            optionValue="key"
            placeholder="Select a land use type"
            valueTemplate={selectedLuClassTemplate}
            itemTemplate={luClassOptionTemplate}
          />
        )}
      </div>
      {(selectedFocusArea && selectedLuClass) && (
        <FocusAreaQuestionnaire
          evaluation={selectedEvaluation}
          headerLabel={`${selectedFocusArea.name} - ${selectedLuClass}`}
        />
      )}
    </div>
  );
}

export default FocusAreaLMAssesment;
