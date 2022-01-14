import React, { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { UserContext } from '../../store';
import { generateScenarioSchema } from '../../utilities/schema-generators';
import ScenarioToolbar from '../../components/ScenarioToolbar';
import TransitionImpactMatrix from '../../components/TransitionImpactMatrix';
import ScenarioTransitionMatrix from '../../components/ScenarioTransitionMatrix';
import NewScenarioDialog from '../../components/dialogs/NewScenario';

const LandUse = () => {
  const { t } = useTranslation();
  const { currentProject } = useContext(UserContext);
  const [scenarios, setScenarios] = useState([]);
  const [canAddNewScenarios, setCanAddNewScenarios] = useState(true);
  const [scenarioModalVisible, setScenarioModalVisible] = useState(false);
  const [minYear, setMinYear] = useState(new Date().getFullYear());

  const prepareScenario = (startYear, endYear) => {
    const scenario = {
      ...generateScenarioSchema(currentProject.lu_classes, currentProject.uses_default_lu_classification),
      scenarioName: `${startYear} - ${endYear}`,
      scenarioPeriod: {
        scenarioStart: startYear,
        scenarioEnd: endYear,
      },
    };
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

  const resetScenarios = () => {
    setScenarios([]);
    setCanAddNewScenarios(true);
  };

  useEffect(() => {
    // eslint-disable-next-line
    console.log(scenarios);
  }, [scenarios]);

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
              onSave={(e, sc) => {
                // eslint-disable-next-line
                console.log(e, sc);
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
