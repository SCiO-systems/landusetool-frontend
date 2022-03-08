import React from 'react';
import { Fieldset } from 'primereact/fieldset';

import QuestionPanel from './QuestionPanel';
import questions from './data';

const FocusAreaQuestionnaire = ({ evaluation, headerLabel }) => {
  console.log(questions); // eslint-disable-line
  console.log(evaluation); // eslint-disable-line

  const updateSpiderGraph = () => { };

  return (
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
                    className="p-col-12 p-shadow-8"
                    collapsed={false}
                  >
                    <div className="p-grid">
                      {
                        questionnaire.questions.map(
                          (question) => (
                            <div className="p-col-6">
                              <QuestionPanel
                                likertData={updateSpiderGraph}
                                question={question} />
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
                  className="p-col-12 p-shadow-8"
                  collapsed={false}
                >
                  {
                    questionnaire.questions.map(
                      (question) => (
                        <QuestionPanel
                          likertData={updateSpiderGraph}
                          question={question} />
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
  )
};

export default FocusAreaQuestionnaire;
