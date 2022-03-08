import React from 'react';
import LikertScale from './LikertScale';

const QuestionPanel = ({ question, onChange }) => (
  <div>
    {question && (
      <div id={question.id}>
        <div>
          <h5 className="p-mb-0">
            {question.label}
          </h5>
          {question.sublabel?.length > 0 && (
            <span>
              ({
                question.sublabel.map(
                  (item, i) => {
                    if (question.sublabel.length === i + 1) {
                      return ` ${item} `;
                    }
                    return ` ${item} / `

                  }
                )
              })
            </span>
          )}
          <div className="p-mt-2 p-mb-4">
            <LikertScale
              id={`likert_${question.id}`}
              callback={onChange}
              initialScale="neither_agree_or_disagree"
            />
          </div>
        </div>
      </div>
    )}
  </div>
);


export default QuestionPanel;
