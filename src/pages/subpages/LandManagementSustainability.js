import { Steps } from 'primereact/steps';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DefineFocusAreas from './DefineFocusAreas';
import FocusAreaLMAssesment from './FocusAreaLMAssesment';
import LandManagementSustainabilityIndicators from './LandManagementSustainabilityIndicators';

const LandManagementSustainability = () => {
  const MIN_STEP_INDEX = 0;
  const MAX_STEP_INDEX = 2;

  const { t } = useTranslation();

  const [stepIndex, setStepIndex] = useState(MIN_STEP_INDEX);

  const onForward = () => {
    if (stepIndex >= MAX_STEP_INDEX) {
      return;
    }
    setStepIndex(stepIndex + 1);
  };

  const onBack = () => {
    if (stepIndex <= MIN_STEP_INDEX) {
      return;
    }
    setStepIndex(stepIndex - 1);
  };

  const steps = [
    {
      label: t('LM_SUSTAINABILITY_IMPACT_INDICATORS'),
      component: <LandManagementSustainabilityIndicators onForward={onForward} />,
    },
    {
      label: t('DEFINE_FOCUS_AREAS_IN_ROI'),
      component: <DefineFocusAreas onBack={onBack} onForward={onForward} />,
    },
    {
      label: t('FOCUS_AREA_LM_ASSESMENT'),
      component: <FocusAreaLMAssesment onBack={onBack} />,
    },
  ];

  return (
    <>
      <Steps
        className="p-pt-4"
        activeIndex={stepIndex}
        onSelect={(e) => setStepIndex(e.index)}
        model={steps}
      />
      {steps[stepIndex].component}
    </>
  );
};

export default LandManagementSustainability;
