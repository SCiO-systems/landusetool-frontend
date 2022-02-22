import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import Loading from '../../components/Loading';
import ScenarioImpactTable from '../../components/tables/ScenarioImpactTable';
import LandDegradationWaterfall from '../../components/charts/LandDegradationWaterfall';
import { getScenarios } from '../../services/scenarios';
import { UserContext, ToastContext } from '../../store';
import { handleError } from '../../utilities/errors';

const NeutralityMatrix = () => {
  const { t } = useTranslation();
  const { currentProject } = useContext(UserContext);
  const { setError } = useContext(ToastContext);
  const [isLoading, setIsLoading] = useState(true);
  const [scenarios, setScenarios] = useState([]);
  const [waterfallData, setWaterfallData] = useState([]);

  const fetchScenarios = async () => {
    if (!isLoading) setIsLoading(true);
    try {
      const { data } = await getScenarios(currentProject.id);
      setScenarios(data.map((sc) => sc.content));
    } catch (e) {
      setError(handleError(e));
    } finally {
      setIsLoading(false);
    }
  };

  const prepareWaterfallData = () => {
    const initialDegradation = (currentProject?.preprocessing_data?.initial_roi_ld) || 0;
    let lastValue = initialDegradation;
    let lastDate = 0;


    let initialColor = '#d43333';
    if (initialDegradation >= 0) {
      initialColor = '#398e3b';
    } else if (initialDegradation < 0) {
      initialColor = '#d43333';
    }

    const initialColumn = {
      category: `${new Date().getFullYear()}`,
      value: initialDegradation,
      open: 0,
      stepValue: initialDegradation,
      color: initialColor,
      displayValue: initialDegradation,
    }

    const waterfall = scenarios.map(
      (scenarioLocal) => {
        const category = `( ${scenarioLocal.scenarioPeriod.scenarioStart} - ${scenarioLocal.scenarioPeriod.scenarioEnd} )`;
        const value = lastValue + scenarioLocal.ld_impact;
        const open = lastValue;
        const stepValue = lastValue + scenarioLocal.ld_impact;
        const displayValue = scenarioLocal.ld_impact;

        let color = '#d43333';
        if (displayValue >= 0) {
          color = '#398e3b';
        } else if (displayValue < 0) {
          color = '#d43333';
        }

        const column = {
          category,
          value,
          open,
          stepValue,
          color,
          displayValue,
        }

        lastValue = value;

        if (lastDate < scenarioLocal.scenarioPeriod.scenarioEnd) {
          lastDate = scenarioLocal.scenarioPeriod.scenarioEnd;
        }

        return column;
      }
    );

    let lastColor = '#d43333';
    if (waterfall[waterfall.length - 1].value >= 0) {
      lastColor = '#398e3b';
    } else if (waterfall[waterfall.length - 1].value < 0) {
      lastColor = '#d43333';
    }

    const lastColumn = {
      category: lastDate.toString(),
      value: waterfall[waterfall.length - 1].value,
      open: 0,
      stepValue: waterfall[waterfall.length - 1].stepValue,
      color: lastColor,
      displayValue: waterfall[waterfall.length - 1].value,
    }

    waterfall.unshift(initialColumn);
    waterfall.push(lastColumn);

    setWaterfallData(waterfall);
  }

  useEffect(() => {
    fetchScenarios();
  }, []); // eslint-disable-line

  useEffect(() => {
    if (scenarios.length > 0) {
      prepareWaterfallData();
    }
  }, [scenarios]); // eslint-disable-line

  if (isLoading) {
    return (<Loading />);
  }

  if (scenarios.length === 0) {
    return (<div className="p-mt-2 p-text-bold">{t('NOT_ENOUGH_SCENARIOS')}</div>)
  }

  return (
    <>
      {scenarios.map((sc) => (
        <ScenarioImpactTable key={sc.remoteId} scenario={sc} />
      ))}
      {waterfallData.length > 0 && (
        <div className="p-grid p-justify-center p-mt-6">
          <h4>Land Degradation Evolution in ROI</h4>
          <LandDegradationWaterfall data={waterfallData} />
        </div>
      )}
    </>
  )
}

export default NeutralityMatrix;
