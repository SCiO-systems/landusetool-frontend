import React, { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { UserContext, ToastContext } from '../../store';
import { generateScenarioSchema, generateLUImpactMatrixSchema, fillInitialLandCoverageValues } from '../../utilities/schema-generators';
import { handleError } from '../../utilities/errors';
import { calculateScenarioLdImpact } from '../../utilities/ld-calculations';
import { createScenario, getScenarios, deleteAllScenarios, editScenario } from '../../services/scenarios';
import { editProject } from '../../services/projects';
import ScenarioToolbar from '../../components/ScenarioToolbar';
import TransitionImpactMatrix from '../../components/TransitionImpactMatrix';
import ScenarioTransitionMatrix from '../../components/ScenarioTransitionMatrix';
import NewScenarioDialog from '../../components/dialogs/NewScenario';

const LandUse = () => {
  const { t } = useTranslation();
  const { currentProject, setUser } = useContext(UserContext);
  const { setError, setSuccess } = useContext(ToastContext);
  const [scenarios, setScenarios] = useState([]);
  const [canAddNewScenarios, setCanAddNewScenarios] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [scenarioModalVisible, setScenarioModalVisible] = useState(false);
  const [minYear, setMinYear] = useState(new Date().getFullYear());

  const fetchScenarios = async () => {
    try {
      const { data } = await getScenarios(currentProject.id);
      let maxYear = new Date().getFullYear();
      data.forEach((sc) => {
        if (parseInt(sc.to_year, 10) > maxYear) {
          maxYear = sc.to_year;
        }
      });
      setMinYear(parseInt(maxYear, 10));
      setScenarios(data.map((sc) => sc.content));
    } catch (e) {
      setError(handleError(e));
    }
  };

  const editTransitionImpactMatrix = async (impactMatrixData, silently = false) => {
    try {
      const { data: updatedProject } = await editProject(currentProject.id, {
        has_edited_transition_matrix_data: true,
        transition_impact_matrix_data: impactMatrixData,
      });
      setUser({ currentProject: updatedProject });
      if (silently) return;
      setSuccess('Done', 'Trasition Impact Matrix for this project has been updated.');
    } catch (e) {
      setError(handleError(e));
    }
  };

  const prepareScenario = async (startYear, endYear) => {
    const scenario = fillInitialLandCoverageValues({
      ...generateScenarioSchema(currentProject.lu_classes, currentProject.uses_default_lu_classification),
      scenarioName: `${startYear} - ${endYear}`,
      scenarioPeriod: {
        scenarioStart: startYear,
        scenarioEnd: endYear,
      },
    }, currentProject.preprocessing_data.land_cover_hectares_per_class);

    try {
      const { data } = await createScenario(currentProject.id, scenario);
      scenario.remoteId = data.id;
      // update the remoteId
      await editScenario(currentProject.id, scenario);
    } catch (e) {
      setError(handleError(e));
      return;
    }

    setScenarios((oldScenarios) => {
      const newScenarios = [...oldScenarios, scenario];
      return newScenarios;
    });

    // The new min year is the last end year
    setMinYear(endYear);

    // If the user has put a scenario up to 2030, we're done
    if (parseInt(endYear, 10) === 2030) {
      setCanAddNewScenarios(false);
    }
  };

  const resetScenarios = async () => {
    try {
      await deleteAllScenarios(currentProject.id);
      setMinYear(new Date().getFullYear());
    } catch (e) {
      setError(handleError(e));
      return;
    }
    setScenarios([]);
    setCanAddNewScenarios(true);
  };

  const updateScenario = async (scenarioContent) => {
    try {
      if (currentProject.transition_impact_matrix_data === null) {
        setError(`You can't save changes on a scenario without first saving the Transition Impact
        Matrix for this project`);
        return;
      }
      setIsUpdating(true);
      scenarioContent.ld_impact = calculateScenarioLdImpact(scenarioContent, currentProject.transition_impact_matrix_data);
      await editScenario(currentProject.id, scenarioContent);
      await fetchScenarios();
    } catch (e) {
      setError(handleError(e));
    } finally {
      setIsUpdating(false);
    }
  };

  let initialDataForImpactMatrix = [];
  if (currentProject.has_edited_transition_matrix_data &&
    currentProject.transition_impact_matrix_data !== null) {
    initialDataForImpactMatrix = currentProject.transition_impact_matrix_data;
  } else {
    initialDataForImpactMatrix = generateLUImpactMatrixSchema(currentProject.lu_classes, currentProject.uses_default_lu_classification);
  }

  useEffect(() => {
    fetchScenarios();
    if (currentProject.transition_impact_matrix_data === null) {
      editTransitionImpactMatrix(initialDataForImpactMatrix, true);
    }
  }, []); // eslint-disable-line

  const usesDefaultData = currentProject.uses_default_lu_classification === 1;

  return (
    <>
      <ScenarioToolbar
        scenarios={scenarios}
        canAddNew={canAddNewScenarios}
        setScenarioModalVisible={setScenarioModalVisible}
        onReset={resetScenarios}
        totalRoiArea={currentProject.preprocessing_data.total_roi_area}
        initialRoiLd={currentProject.preprocessing_data.initial_roi_ld}
      />
      <div className="p-mt-4">
        <TransitionImpactMatrix
          title={t('LU_TRANSITION_IMPACT_MATRIX')}
          initialData={initialDataForImpactMatrix}
          hasDefaultData={usesDefaultData}
          onSave={(impactMatrixData) => editTransitionImpactMatrix(impactMatrixData)}
        />
      </div>
      <div className="p-mt-4">
        {(scenarios.length > 0) && scenarios.map((s, index)=> (
          <div className={index === 0 ? `p-mt-6` : `` } key={s.scenarioName} id={s.scenarioName}>
            <ScenarioTransitionMatrix
              inputScenario={s}
              projectId={currentProject.id}
              isUpdating={isUpdating}
              onSave={(sc) => {
                updateScenario(sc);
              }}
            />
          </div>
        ))}
      </div>
      <NewScenarioDialog
        dialogOpen={scenarioModalVisible}
        setDialogOpen={setScenarioModalVisible}
        hasScenarios={scenarios.length > 0}
        minYear={minYear}
        maxYear={2030}
        prepareScenario={prepareScenario}
      />
    </>
  );
};

export default LandUse;
