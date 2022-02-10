import React, { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { UserContext, ToastContext } from '../../store';
import { generateScenarioSchema, fillInitialLandCoverageValues } from '../../utilities/schema-generators';
import { handleError } from '../../utilities/errors';
import { createScenario, getScenarios, deleteAllScenarios, editScenario } from '../../services/scenarios';
import ScenarioToolbar from '../../components/ScenarioToolbar';
import TransitionImpactMatrix from '../../components/TransitionImpactMatrix';
import ScenarioTransitionMatrix from '../../components/ScenarioTransitionMatrix';
import NewScenarioDialog from '../../components/dialogs/NewScenario';

const LandUse = () => {
  const { t } = useTranslation();
  const { currentProject } = useContext(UserContext);
  const { setError } = useContext(ToastContext);
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
    console.log(scenarioContent); // eslint-disable-line
    try {
      setIsUpdating(true);
      await editScenario(currentProject.id, scenarioContent);
    } catch (e) {
      setError(handleError(e));
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    console.log(scenarios);
  }, [scenarios]);

  useEffect(() => {
    fetchScenarios();
  }, []); // eslint-disable-line

  return (
    <>
      <ScenarioToolbar
        scenarios={scenarios}
        canAddNew={canAddNewScenarios}
        setScenarioModalVisible={setScenarioModalVisible}
        onReset={resetScenarios}
      />
      <div className="p-mt-4">
        <TransitionImpactMatrix title={t('LU_TRANSITION_IMPACT_MATRIX')} currentProject={currentProject} />
      </div>
      <div className="p-mt-4">
        {(scenarios.length > 0) && scenarios.map((s)=> (
          <div className="p-mt-6" key={s.scenarioName} id={s.scenarioName}>
            <ScenarioTransitionMatrix
              inputScenario={s}
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
