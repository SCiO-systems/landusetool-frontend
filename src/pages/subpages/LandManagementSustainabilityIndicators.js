import { PickList } from 'primereact/picklist';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import StepNavigation from '../../components/navigation/StepNavigation';
import { getIndicators } from '../../services/indicators';
import { getProjectIndicators, saveProjectIndicators } from '../../services/projects';
import { ToastContext, UserContext } from '../../store';
import { handleError } from '../../utilities/errors';

const LandManagementSustainabilityIndicators = ({ onForward }) => {
  const { t } = useTranslation();
  const { setError } = useContext(ToastContext);
  const { currentProject } = useContext(UserContext);

  const [indicators, setIndicators] = useState([]);
  const [selected, setSelected] = useState({});

  const filterSourceListItems = (items, id) => {
    // Get the existing selected items and their ids.
    const ids = selected[id] ? selected[id]?.map((item) => item.id) : [];

    // Check if all the source items are transferable to the target
    // and also if the list of target ids does not contain the source item id.
    return items.filter((i) => i.transferable === 1).filter((i) => !ids.includes(i.id));
  };

  const filterTargetListItems = (items, id) => {
    // Get the existing selected items and their ids.
    const existing = selected[id] || [];
    const existingIds = existing.map((item) => item.id);

    // Tranfer all the items to the target list, then filter by untransferable
    // and also check if any of the source items are not in the target list already.
    return items
      .filter((i) => i.transferable === 0)
      .filter((i) => !existingIds.includes(i.id))
      .concat(existing);
  };

  const setDefaultSelectedIndicators = (allIndicators, projectIndicators) => {
    // Convert the project indicators to IDs.
    const projectIndicatorIds = projectIndicators.map((i) => i.id);

    // Get all the indicators that need to be selected by default.
    const defaults = allIndicators
      .map((e) => e.children)
      .flat()
      .map((c) =>
        c.children.filter((e) => e.transferable === 0 || projectIndicatorIds.includes(e.id))
      )
      .flat();

    // Create an empty object to hold them.
    const s = {};

    // Create the format that is needed.
    defaults.forEach((i) => {
      if (!s[i.parent_indicator_id]) {
        s[i.parent_indicator_id] = [];
      }
      s[i.parent_indicator_id].push(i);
    });

    // Send the untransferable items to the target.
    setSelected(s);
  };

  const onChange = (e, id) => {
    // Get the non-transferable items from the source back to the target.
    const nonTransferableSourceItems = e.source.filter((i) => i.transferable === 0);

    setSelected({ ...selected, [id]: e.target.concat(nonTransferableSourceItems) });
  };

  const onContinue = async () => {
    // Save the changes.
    try {
      const selectedIndicatorIds = Object.values(selected)
        .flat()
        .map(({ id }) => id);
      await saveProjectIndicators(currentProject?.id, selectedIndicatorIds);
      onForward();
    } catch (error) {
      setError(handleError(error));
    }
  };

  useEffect(() => {
    const fetchIndicators = async () => {
      try {
        const allIndicators = await getIndicators();
        const projectIndicators = await getProjectIndicators(currentProject?.id);
        setIndicators(allIndicators);
        setDefaultSelectedIndicators(allIndicators, projectIndicators);
      } catch (error) {
        setError(handleError(error));
      }
    };
    fetchIndicators();
  }, []); // eslint-disable-line

  const itemTemplate = ({ transferable, name }) => (
    <div key={name}>
      <span className="p-mr-2">
        {transferable === 1 ? <i className="fad fa-tag" /> : <i className="fas fa-tag" />}
      </span>
      <span>{name}</span>
    </div>
  );

  return (
    <>
      <div className="p-pt-5">
        {indicators.map((indicator) => (
          <div className="p-grid" key={indicator?.id}>
            <div className="p-col-12 p-pb-0">
              <h5 className="p-mb-1">{indicator?.name}</h5>
            </div>
            <div className="p-col-12">
              {indicator?.children?.map((impact) => (
                <div key={impact?.id} className="p-grid p-fluid p-pb-4">
                  <div className="p-col-12">
                    <PickList
                      sourceHeader={impact?.name}
                      showSourceControls={false}
                      targetHeader={t('ASSESSMENT_CRITERIA')}
                      source={filterSourceListItems(impact?.children, impact?.id)}
                      target={filterTargetListItems(impact?.children, impact?.id)}
                      itemTemplate={itemTemplate}
                      onChange={(e) => onChange(e, impact?.id)}
                      sourceStyle={{ height: '280px' }}
                      targetStyle={{ height: '280px' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <StepNavigation onForward={onContinue} />
    </>
  );
};

export default LandManagementSustainabilityIndicators;
