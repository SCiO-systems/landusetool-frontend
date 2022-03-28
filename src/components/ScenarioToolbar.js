import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { OverlayPanel } from 'primereact/overlaypanel';

import LandDegradationGauge from './charts/LandDegradationGauge';

const format = (num, decimals) => num.toFixed(decimals).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')

const ScenarioToolbar = ({ scenarios, canAddNew, setScenarioModalVisible, onReset, totalRoiArea, initialRoiLd }) => {
  const { t } = useTranslation();
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gaugeValues, setGaugeValues] = useState([totalRoiArea, initialRoiLd]);
  const op = useRef(null);

  useEffect(() => {
    const newLd = scenarios.reduce(
      (previousValue, sc) => previousValue + sc.ld_impact,
      0
    );
    setGaugeValues((oldGaugeValues) => ([oldGaugeValues[0], initialRoiLd + newLd]))
  }, [scenarios, initialRoiLd]);

  const tryResetting = async () => {
    setIsLoading(true);
    await onReset();
    setIsLoading(false);
    setResetModalVisible(false);
  };

  const scenarioLdImpact = (rowData) => {
    if (!rowData.ld_impact) {
      return <Tag value={0} severity='warn' />;
    }

    return (
      <Tag
        value={`${format(Math.abs(rowData.ld_impact), 2)} ha`}
        severity={rowData.ld_impact > 0 ? 'success' : 'error'}
        icon={rowData.ld_impact > 0 ? 'pi pi-plus' : 'pi pi-minus'}
      />
    );
  }

  const leftContents = (
    <>
      <Button
        type="button"
        icon="fad fa-eye"
        label={t('LD_IMPACT_OVERVIEW')}
        onClick={(e) => op.current.toggle(e)}
        disabled={scenarios.length === 0}
      />
      <OverlayPanel
        ref={op}
        showCloseIcon
        id="overlay_panel"
        style={{ width: '700px' }}
        appendTo={document.body}
      >
        <>
          <LandDegradationGauge gaugeValues={gaugeValues} />
          <DataTable
            value={scenarios}
            selectionMode="single"
            paginator
            rows={5}
          >
            <Column field="scenarioName" header={t('NAME')} sortable />
            <Column header={t('SCENARIO_LD_IMPACT')} body={scenarioLdImpact} />

          </DataTable>
        </>
      </OverlayPanel>

      <Button
        label={t('NEW_SCENARIO')}
        icon="fad fa-layer-plus"
        className="p-ml-2"
        onClick={() => setScenarioModalVisible(true)}
        disabled={!canAddNew}
      />
    </>
  );

  const renderResetFooter = () => (
    <div>
      <Button
        label={t('YES_DELETE_ALL_SCENARIOS')}
        icon="fad fa-calendar-times"
        disabled={isLoading}
        className="p-button-danger"
        onClick={() => {
          tryResetting();
        }}
        autoFocus
      />
    </div>
  );

  const rightContents = (
    <>
      <Button
        icon="fad fa-trash-alt"
        className="p-button-danger"
        onClick={() => setResetModalVisible(true)}
        disabled={scenarios.length === 0}
      />
      <Dialog
        header={t('DELETE_ALL_SCENARIOS')}
        visible={resetModalVisible}
        style={{ width: '500px' }}
        footer={renderResetFooter()}
        onHide={() => setResetModalVisible(false)}
      >
        {t('ARE_YOU_SURE')}
      </Dialog>
    </>
  );

  return (
    <>
      <Toolbar left={leftContents} right={rightContents} />
    </>
  );
};

export default ScenarioToolbar;
