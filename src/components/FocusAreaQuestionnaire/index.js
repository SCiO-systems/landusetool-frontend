import React, { useEffect, useState } from 'react';
import { Fieldset } from 'primereact/fieldset';
import { RadioButton } from 'primereact/radiobutton';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';

import EvaluationSpiderGraph from '../charts/EvaluationSpiderGraph';
import CurvedGraph from '../charts/CurvedGraph';
import QuestionPanel from './QuestionPanel';
import questions from './data';

const buildInitialSpiderGraphData = (data, evaluation) => {
  const spiderGraphData = [];

  if (data.length === 0) return spiderGraphData;

  data.forEach((questionSection) => {
    questionSection.questions.forEach((likertValues) => {
      spiderGraphData.push({
        'criteria': likertValues.label,
        'slm1': (evaluation) ? evaluation[likertValues.id] : 0,
        'slm2': 0,
        'id': likertValues.id,
      });
    });
  });

  return spiderGraphData;
};

const buildInitialCurvedGraphData = (evaluation) => {
  const data = [
    {
      'indicator': 'LU Cover Change',
      'value': 0,
    }, {
      'indicator': 'Productivity',
      'value': 0,
    }, {
      'indicator': 'Soil Organic Carbon',
      'value': 0,
    },
  ];

  if (evaluation) {
    data[0].value = (evaluation.water_value + evaluation.climate_change_resilience_value) / 2;
    data[1].value = evaluation.biodiversity_value;
    data[2].value = evaluation.soil_value;
  }

  return data;
}

const getEvaluationValues = (evaluation) => {
  const defaults = {
    soil_value: 0,
    biodiversity_value: 0,
    water_value: 0,
    climate_change_resilience_value: 0,
    production_value: 0,
    economic_viability_value: 0,
    food_security_value: 0,
    equality_of_opportunity_value: 0,
    anticipated_ld_impact: 'neutral',
  };

  if (!evaluation) {
    return defaults;
  }

  Object.keys(evaluation).forEach((key) => {
    if (defaults[key] !== undefined) {
      defaults[key] = evaluation[key];
    }
  });

  return defaults;
}

const FocusAreaQuestionnaire = ({ evaluation, onSave }) => {
  const { t } = useTranslation();
  const [spiderData, setSpiderData] = useState([]);
  const [curvedData, setCurvedData] = useState([]);
  const [evaluationValues, setEvaluationValues] = useState();

  const handleChangeEvaluation = ({ id, numericValue }) => {
    setEvaluationValues((oev) => {
      const copy = { ...oev };
      if (copy[id] !== undefined) {
        copy[id] = numericValue;
      }
      return copy;
    });
  }

  const handleLdImpactChange = (value) => {
    setEvaluationValues((oev) => {
      const copy = { ...oev };
      if (copy.anticipated_ld_impact !== undefined) {
        copy.anticipated_ld_impact = value;
      }
      return copy;
    });
  }

  const handleSave = async () => {
    if (onSave) {
      await onSave(evaluation?.id, evaluationValues);
    }
  }

  useEffect(() => {
    setSpiderData(buildInitialSpiderGraphData(questions, evaluationValues));
    setCurvedData(buildInitialCurvedGraphData(evaluationValues));
  }, [evaluationValues]);

  useEffect(() => {
    setEvaluationValues(getEvaluationValues(evaluation));
  }, [evaluation]);

  return (
    <>
      <div className="p-grid p-mt-2">
        {
          questions.map(
            (questionnaire) => {
              if (questionnaire.questions.length === 4) {
                return (
                  <div className="p-col-12" key={questionnaire.id}>
                    <Fieldset
                      legend={questionnaire.label}
                      toggleable
                      className="p-col-12 p-shadow-2"
                      collapsed={false}
                    >
                      <div className="p-grid">
                        {
                          questionnaire.questions.map(
                            (question) => (
                              <div key={question.id} className="p-col-6">
                                <QuestionPanel
                                  onChange={handleChangeEvaluation}
                                  question={question}
                                  value={evaluationValues ? evaluationValues[question.id] : 0}
                                />
                              </div>
                            )
                          )
                        }
                      </div>
                    </Fieldset>
                  </div>
                )
              }

              return (
                <div className="p-col-6" key={questionnaire.id}>
                  <Fieldset
                    legend={questionnaire.label}
                    toggleable
                    className="p-col-12 p-shadow-2"
                    collapsed={false}
                  >
                    {
                      questionnaire.questions.map(
                        (question) => (
                          <QuestionPanel
                            key={question.id}
                            onChange={handleChangeEvaluation}
                            value={evaluationValues ? evaluationValues[question.id] : 0}
                            question={question}
                          />
                        )
                      )
                    }
                  </Fieldset>
                </div>
              )

            }
          )
        }
      </div>
      <div className="p-grid p-my-2">
        <div className="p-col-6 p-d-flex p-jc-center p-ai-center">
          {spiderData.length > 0 && (
            <EvaluationSpiderGraph data={spiderData} />
          )}
        </div>
        <div className="p-col-6">
          {curvedData.length > 0 && (
            <CurvedGraph data={curvedData} />
          )}
        </div>
      </div>
      <div className="p-grid p-my-2">
        <div className="p-col-6 p-offset-6">
          <h5>
            What is the anticipated LD impact for this LU Type?
          </h5>
          <div className="p-field-radiobutton p-mt-4">
            <RadioButton
              id="improved_ld_impact"
              name="anticipated_ld_impact"
              value="improved"
              onChange={(e) => handleLdImpactChange(e.value)}
              checked={evaluationValues?.anticipated_ld_impact === 'improved'}
            />
            <label htmlFor="improved_ld_impact">Improved</label>
          </div>
          <div className="p-field-radiobutton">
            <RadioButton
              id="slightly_improved_ld_impact"
              name="anticipated_ld_impact"
              value="slightly_improved"
              onChange={(e) => handleLdImpactChange(e.value)}
              checked={evaluationValues?.anticipated_ld_impact === 'slightly_improved'}
            />
            <label htmlFor="slightly_improved_ld_impact">Slightly Improved</label>
          </div>
          <div className="p-field-radiobutton">
            <RadioButton
              id="neutral_ld_impact"
              name="anticipated_ld_impact"
              value="neutral"
              onChange={(e) => handleLdImpactChange(e.value)}
              checked={evaluationValues?.anticipated_ld_impact === 'neutral'}
            />
            <label htmlFor="neutral_ld_impact">Neutral</label>
          </div>
          <div className="p-field-radiobutton">
            <RadioButton
              id="slightly_reduced_ld_impact"
              name="anticipated_ld_impact"
              value="slightly_reduced"
              onChange={(e) => handleLdImpactChange(e.value)}
              checked={evaluationValues?.anticipated_ld_impact === 'slightly_reduced'}
            />
            <label htmlFor="slightly_reduced_ld_impact">Slightly Reduced</label>
          </div>
          <div className="p-field-radiobutton">
            <RadioButton
              id="reduced_ld_impact"
              name="anticipated_ld_impact"
              value="reduced"
              onChange={(e) => handleLdImpactChange(e.value)}
              checked={evaluationValues?.anticipated_ld_impact === 'reduced'}
            />
            <label htmlFor="reduced_ld_impact">Reduced</label>
          </div>
        </div>
      </div>
      <div className="p-d-flex p-jc-end p-my-4">
        <Button
          onClick={() => handleSave()}
          className="p-button-primary"
          icon="fad fa-save"
          iconPos="right"
          label={t('SAVE_ASSESSMENT')}
        />
      </div>
    </>
  )
};

export default FocusAreaQuestionnaire;
