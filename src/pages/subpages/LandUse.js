import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import initialScenarioData from '../../data/initial-scenario';
import ScenarioToolbar from '../../components/ScenarioToolbar';
import TransitionImpactMatrix from '../../components/TransitionImpactMatrix';
import NewScenarioDialog from '../../components/dialogs/NewScenario';

const LandUse = () => {
  const { t } = useTranslation();
  const [scenarios, setScenarios] = useState([]);
  const [canAddNewScenarios, setCanAddNewScenarios] = useState(true);
  const [scenarioModalVisible, setScenarioModalVisible] = useState(false);
  const [minYear, setMinYear] = useState(new Date().getFullYear());

  const prepareScenario = (startYear, endYear) => {
    const scenario = {
      ...initialScenarioData,
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
        <h5>{ t('LU_TRANSITION_IMPACT_MATRIX') }</h5>
      </div>
      <TransitionImpactMatrix />
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
