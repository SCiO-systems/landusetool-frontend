import React, { useEffect, useState, useContext } from 'react';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

import { getWocatTechnology } from '../services/landuse';
import { ToastContext } from '../store';
import { handleError } from '../utilities/errors';

const SingleWocatTechnology = ({ techId, isOwnProposal, isFinal, onVote }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { setError } = useContext(ToastContext);
  const [tech, setTech] = useState(null);

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
                <Button
                  label="Vote"
                  onClick={() => onVote()}
                  className="p-my-2 p-d-block"
                  icon="pi pi-check"
                />
              )}
            </>
          )}
          {(isFinal) && (
            <Tag value="Final Accepted Proposal" severity="success" icon="pi pi-check" />
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleWocatTechnology;
