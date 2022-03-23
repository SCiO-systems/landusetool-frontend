import React, { useEffect, useState, useContext } from 'react';

import Map from './glowglobe/Map';
import { handleError } from '../utilities/errors';
import { findImpactForTransition } from '../utilities/ld-calculations';
import { ToastContext } from '../store';
import { prepareLDNMap } from '../services/projects';

const simplifyValue = (val) => {
  if (val === 0) return 0;
  return val > 0 ? 1 : -1;
}

const LDNMap = ({ scenarios, impactMatrix, projectId }) => {
  const [polygonsList, setPolygonsList] = useState([]);
  const [ldnMap, setLdnMap] = useState(null);
  const { setError } = useContext(ToastContext);

  const fetchLdnMap = async () => {
    if (polygonsList.length > 0) {
      try {
        const { data } = await prepareLDNMap(projectId, polygonsList);
        setLdnMap(data?.ldn_map);
      } catch (e) {
        setError(handleError(e));
      }
    } else {
      setLdnMap(null);
    }
  };

  useEffect(() => {
    if (scenarios.length === 0 || !impactMatrix) return;
    const list = [];
    scenarios.forEach((sc) => {
      for (let i = 0; i < sc.landTypes.length; i += 1) {
        const transition = sc.landTypes[i];
        for (let j = 0; j < transition.breakDown.length; j += 1) {
          const breakDownEntry = transition.breakDown[j];
          if (breakDownEntry.landCoverage.file_id) {
            const ld_impact = findImpactForTransition(
              transition.landId,
              breakDownEntry.landCoverage.value,
              breakDownEntry.landId,
              impactMatrix
            );
            list.push({
              value: simplifyValue(ld_impact),
              file_id: breakDownEntry.landCoverage.file_id,
            });
          }
        }
      }
    });
    setPolygonsList(list);
  }, [scenarios, impactMatrix]);

  useEffect(() => {
    fetchLdnMap();
  }, [polygonsList]); // eslint-disable-line

  if (scenarios.length === 0 || !impactMatrix) {
    return <></>;
  }

  if (ldnMap === null) {
    return (
      <div className="p-d-flex p-jc-center p-ai-center">
        <i className="pi pi-spin pi-spinner" style={{ fontSize: '2em' }} />
      </div>
    )
  }

  return (
    <Map
      type="single"
      maps={[
        {
          link: ldnMap,
          label: `LDN Map`,
          paletteType: '',
        },
      ]}
    />
  )
};

export default LDNMap;
