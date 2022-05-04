import React, { useEffect, useState, useContext } from 'react';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

import { getWocatTechnology } from '../services/landuse';
import { ToastContext } from '../store';
import { handleError } from '../utilities/errors';
import EvaluationSpiderGraph from './charts/EvaluationSpiderGraph';
import { buildInitialSpiderGraphData } from './FocusAreaQuestionnaire';
import questions from './FocusAreaQuestionnaire/data';

const SingleWocatTechnology = ({ techId, isOwnProposal, isFinal, onVote, onReject, proposerEvaluation, selfEvaluation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { setError } = useContext(ToastContext);
  const [tech, setTech] = useState(null);
  const [selfGraphData, setSelfGraphData] = useState([]);
  const [proposerGraphData, setProposerGraphData] = useState([]);

  useEffect(() => {
    const fetchTech = async () => {
      setIsLoading(true);
      try {
        const { data } = await getWocatTechnology(techId);
        setTech(data.item);
      } catch (error) {
        setError(handleError(error));
      }
      setIsLoading(false);
    };
    if (techId) {
      fetchTech();
    }
  }, [techId]); // eslint-disable-line

  useEffect(() => {
    setSelfGraphData(buildInitialSpiderGraphData(questions, selfEvaluation));
    setProposerGraphData(buildInitialSpiderGraphData(questions, proposerEvaluation));
  }, [selfEvaluation, proposerEvaluation]);

  if (isLoading || (tech === null)) {
    return (
      <i className="pi pi-spin pi-spinner" style={{ fontSize: '2em' }} />
    );
  }

  return (
    <div className="p-col-12">
      <div className="p-d-flex p-ai-center">
        <div className="p-col-2 p-text-center">
          <img
            style={{ width: '250px', maxWidth: '100%' }}
            src={tech?.images[0]?.url}
            alt={tech?.images[0]?.caption}
          />
        </div>
        <div className="p-col-8">
          <div className="p-px-4">
            <a href={tech?.url || '#'} target="_blank" rel="noreferrer noopener">
              <h5>
                {tech?.name || ''} - {tech?.location || ''}
              </h5>
            </a>
            <p className="p-pr-4">{tech?.definition || ''}</p>
            <div className="p-grid">
              <span className="p-col">
                <a
                  className="p-d-flex p-ai-center"
                  href={tech?.map_url || '#'}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <i className="pi pi-map-marker" />
                  <span className="p-ml-2">
                    {tech?.location || 'N/A'}, {tech?.province || 'N/A'}
                  </span>
                </a>
              </span>
            </div>
          </div>
        </div>
        <div className="p-col-2">
          {(!isFinal) && (
            <>
              {isOwnProposal ? (
                <Tag value="Pending Approval" severity="info" icon="pi pi-spinner pi-spin" />
              ) : (
                <>
                  <Button
                    label="Accept"
                    style={{ width: '160px' }}
                    onClick={() => onVote()}
                    className="p-my-2 p-d-block"
                    icon="pi pi-check"
                  />
                  <Button
                    label="Reject"
                    style={{ width: '160px' }}
                    onClick={() => onReject()}
                    className="p-my-2 p-d-block p-button-danger"
                    icon="pi pi-times"
                  />
                </>
              )}
            </>
          )}
          {(isFinal) && (
            <Tag value="Final Accepted Proposal" severity="success" icon="pi pi-check" />
          )}
        </div>
      </div>
      <div className="p-grid p-mt-4">
        <div className="p-col-6 p-text-center">
          <h4>Assessment of current SLM</h4>
          <div className="p-d-flex p-jc-center p-ai-center">
            {selfGraphData.length > 0 && (
              <EvaluationSpiderGraph
                domId="self-evaluation-spider-graph"
                data={selfGraphData} 
              />
            )}
          </div>
        </div>
        <div className="p-col-6 p-text-center">
          <h4>Proposed SLM assessment</h4>
          <div className="p-d-flex p-jc-center p-ai-center">
            {proposerGraphData.length > 0 && (
              <EvaluationSpiderGraph
                domId="new-evaluation-spider-graph"
                data={proposerGraphData} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleWocatTechnology;
